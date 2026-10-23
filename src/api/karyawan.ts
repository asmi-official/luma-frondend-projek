import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'

export const KARYAWAN_QUERY_KEY = ['karyawan']

export type Employee = {
  id: string
  userId: string | null
  namaLengkap: string
  name: string
  email: string
  nomorHp: string
  phone: string
  idKaryawan: string
  employeeId: string
  role: string
  cabangId: string
  branchId: string
  cabang: string | null
  branch: string | null
  loginAccess: boolean
  active: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export type KaryawanListMeta = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type KaryawanListQuery = {
  search?: string
  role?: string
  cabangId?: string
  branchId?: string
  status?: 'active' | 'inactive'
  sort?: 'name' | 'employee_id' | 'role' | 'active' | 'last_login' | 'created_at'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export type KaryawanListResponse = {
  status: string
  message: string
  total_active: number
  total_inactive: number
  data: Employee[]
  meta: KaryawanListMeta
}

export type KaryawanResponse = {
  status: string
  message: string
  data: Employee
}

export type CreateKaryawanPayload = {
  namaLengkap: string
  email: string
  nomorHp: string
  idKaryawan?: string
  cabangId: string
  role: string
  loginAccess: boolean
  username?: string
  password?: string
}

export type UpdateKaryawanPayload = Partial<CreateKaryawanPayload> & {
  id: string
}

export async function getKaryawans(query?: KaryawanListQuery) {
  const { data } = await api.get<KaryawanListResponse>('/karyawan', { params: query })
  return data
}

export function useKaryawans(query?: KaryawanListQuery) {
  return useQuery({
    queryKey: [...KARYAWAN_QUERY_KEY, query],
    queryFn: () => getKaryawans(query),
  })
}

export async function getKaryawanDetail(id: string) {
  const { data } = await api.get<KaryawanResponse>(`/karyawan/${id}`)
  return data
}

export function useKaryawanDetail(id: string | undefined) {
  return useQuery({
    queryKey: [...KARYAWAN_QUERY_KEY, id],
    queryFn: () => getKaryawanDetail(id as string),
    enabled: Boolean(id),
  })
}

export async function createKaryawan(payload: CreateKaryawanPayload) {
  const { data } = await api.post<KaryawanResponse>('/karyawan', payload)
  return data
}

export function useCreateKaryawan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createKaryawan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KARYAWAN_QUERY_KEY }),
  })
}

export async function updateKaryawan({ id, ...payload }: UpdateKaryawanPayload) {
  const { data } = await api.put<KaryawanResponse>(`/karyawan/${id}`, payload)
  return data
}

export function useUpdateKaryawan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateKaryawan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KARYAWAN_QUERY_KEY }),
  })
}

export async function deleteKaryawan(id: string) {
  const { data } = await api.delete<{ status: string; message: string; data: null }>(`/karyawan/${id}`)
  return data
}

export function useDeleteKaryawan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteKaryawan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KARYAWAN_QUERY_KEY }),
  })
}

export async function toggleKaryawanActive(id: string) {
  const { data } = await api.patch<KaryawanResponse>(`/karyawan/${id}/toggle-active`)
  return data
}

export function useToggleKaryawanActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleKaryawanActive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KARYAWAN_QUERY_KEY }),
  })
}

export async function resetKaryawanPassword({ id, password }: { id: string; password: string }) {
  const { data } = await api.patch<{ status: string; message: string; data: null }>(
    `/karyawan/${id}/reset-password`,
    { password },
  )
  return data
}

export function useResetKaryawanPassword() {
  return useMutation({ mutationFn: resetKaryawanPassword })
}
