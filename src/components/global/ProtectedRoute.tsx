import { Navigate, Outlet } from 'react-router-dom'
import { getAccessToken } from '../../lib/authToken'

// Cek apakah user sudah login (punya access token di localStorage)
// Kalau belum, redirect ke /login
export default function ProtectedRoute() {
  const token = getAccessToken()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
