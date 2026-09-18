import axios from 'axios'
import { clearAuthTokens, getAccessToken, getRefreshToken, setAccessToken } from './authToken'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessTokenOnce(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const { data } = await axios.post<{ data: { access_token: string } }>(
      `${api.defaults.baseURL}/users/refresh-token`,
      { refresh_token: refreshToken },
    )
    const newAccessToken = data.data.access_token
    setAccessToken(newAccessToken)
    return newAccessToken
  } catch {
    clearAuthTokens()
    return null
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isRefreshRequest = originalRequest?.url?.includes('/users/refresh-token')

    if (error.response?.status !== 401 || isRefreshRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (!refreshPromise) {
      refreshPromise = refreshAccessTokenOnce().finally(() => {
        refreshPromise = null
      })
    }

    const newAccessToken = await refreshPromise

    if (!newAccessToken) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
    return api(originalRequest)
  },
)
