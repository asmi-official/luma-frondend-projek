import { create } from 'zustand'
import type { ProfileResponse } from '../api/auth'

export type AuthUser = Omit<ProfileResponse['data'], 'created_at' | 'updated_at' | 'deleted_at'>

type AuthState = {
  user: AuthUser | null
  setUser: (user: AuthUser) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
