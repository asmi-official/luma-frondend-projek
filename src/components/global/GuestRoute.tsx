import { Navigate, Outlet } from 'react-router-dom'
import { getAccessToken } from '../../lib/authToken'

// Kalau user sudah login, redirect ke /dashboard (jangan tampilkan login/register)
export default function GuestRoute() {
  const token = getAccessToken()
  if (token) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}
