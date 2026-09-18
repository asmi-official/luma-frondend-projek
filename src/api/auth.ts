import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { api } from '../lib/axios'
import { getAccessToken } from '../lib/authToken'
import { useAuthStore } from '../store/authStore'

export type RegisterPayload = {
  username: string
  full_name: string
  email: string
  phone: string
  password: string
  role: string
  company_name: string
  agree: boolean
}

export type RegisterResponse = {
  status: string
  message: string
  data: {
    access_token: string
    refresh_token: string
    user: {
      id: string
      username: string
      email: string
      full_name: string
      role: string
    }
  }
}

export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<RegisterResponse>('/users/register', payload)
  return data
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  status: string
  message: string
  data: {
    access_token: string
    refresh_token: string
    user: {
      id: string
      username: string
      email: string
      full_name: string
      role: string
    }
  }
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>('/users/login', payload)
  return data
}

export type ProfileResponse = {
  status: string
  message: string
  data: {
    id: string
    username: string
    email: string
    phone: string
    role: string
    full_name: string
    photo_id: string | null
    photo_url: string | null
    agree: boolean
    company_id: string | null
    header_id: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
  }
}

export async function getProfile() {
  const { data } = await api.get<ProfileResponse>('/users/profile')
  return data
}

export function useProfile() {
  const setUser = useAuthStore((state) => state.setUser)

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!getAccessToken(),
  })

  useEffect(() => {
    if (!query.data) return
    const { created_at: _created_at, updated_at: _updated_at, deleted_at: _deleted_at, ...user } = query.data.data
    setUser(user)
  }, [query.data, setUser])

  return query
}

