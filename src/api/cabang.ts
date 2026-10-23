import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { buildListQueryParams, type ListQueryParams } from '../lib/queryFilter'

export const CABANG_QUERY_KEY = ['cabangs']
export const CABANG_FILTER_OPTIONS_QUERY_KEY = ['cabang-filter-options']

export type Cabang = {
  id: string
  name: string
  code: string
  address: string | null
  phone: string | null
  email: string | null
  manager_name: string | null
  icon: string | null
  color_icon: string | null
  color_bg_icon: string | null
  active: boolean
  user_id: string
  owner_id: string | null
  company_id: string | null
  sales_total?: number
  transaction_count?: number
  expense_total?: number
  created_by: string
  updated_at: string
  updated_by: string
  deleted_at: string | null
  deleted_by: string | null
}

export type CabangColumn =
  | 'id'
  | 'name'
  | 'code'
  | 'address'
  | 'phone'
  | 'email'
  | 'manager_name'
  | 'active'
  | 'user_id'
  | 'company_id'
  | 'created_at'
  | 'created_by'
  | 'updated_at'
  | 'updated_by'

export type CabangListMeta = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type CabangListResponse = {
  status: string
  message: string
  total_active: number
  total_inactive: number
  data: Cabang[]
  meta: CabangListMeta
}

export type CabangListQuery = ListQueryParams<CabangColumn> & {
  search?: string
}

export async function getCabangs(query?: CabangListQuery) {
  const { search, ...rest } = query ?? {}
  const params = query ? buildListQueryParams(rest) : undefined

  if (search) params!.search = search

  const { data } = await api.get<CabangListResponse>('/cabangs', { params })
  return data
}

export function useCabangs(query?: CabangListQuery) {
  return useQuery({
    queryKey: [...CABANG_QUERY_KEY, query],
    queryFn: () => getCabangs(query),
  })
}

export type CabangStatusOption = {
  value: 'active' | 'inactive'
  label: string
}

export type CabangFilterOptionsResponse = {
  status: string
  message: string
  data: {
    status_options: CabangStatusOption[]
  }
}

export async function getCabangFilterOptions() {
  const { data } = await api.get<CabangFilterOptionsResponse>('/cabangs/filter-options')
  return data
}

export function useCabangFilterOptions() {
  return useQuery({
    queryKey: CABANG_FILTER_OPTIONS_QUERY_KEY,
    queryFn: getCabangFilterOptions,
    staleTime: Infinity,
  })
}

export type CreateCabangPayload = {
  name: string
  address?: string | null
  phone?: string | null
  email?: string | null
  manager_name?: string | null
  icon?: string | null
  color_icon?: string | null
  color_bg_icon?: string | null
  active?: boolean
}

export type CabangMutationResponse = {
  status: string
  message: string
  data: Cabang
}

export async function createCabang(payload: CreateCabangPayload) {
  const { data } = await api.post<CabangMutationResponse>('/cabangs', payload)
  return data
}

export function useCreateCabang() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCabang,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CABANG_QUERY_KEY })
    },
  })
}

export type UpdateCabangPayload = Partial<Omit<CreateCabangPayload, 'active'>> & {
  id: string
  active?: boolean
}

export async function updateCabang({ id, ...payload }: UpdateCabangPayload) {
  const { data } = await api.put<CabangMutationResponse>(`/cabangs/${id}`, payload)
  return data
}

export function useUpdateCabang() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCabang,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CABANG_QUERY_KEY })
    },
  })
}

export type CabangDetailResponse = {
  status: string
  message: string
  data: Cabang
}

export async function getCabangDetail(id: string) {
  const { data } = await api.get<CabangDetailResponse>(`/cabangs/${id}`)
  return data
}

export function useCabangDetail(id: string | undefined) {
  return useQuery({
    queryKey: [...CABANG_QUERY_KEY, id],
    queryFn: () => getCabangDetail(id as string),
    enabled: !!id,
  })
}

export type DeleteCabangResponse = {
  status: string
  message: string
  data: null
}

export async function deleteCabang(id: string) {
  const { data } = await api.delete<DeleteCabangResponse>(`/cabangs/${id}`)
  return data
}

export function useDeleteCabang() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCabang,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CABANG_QUERY_KEY })
    },
  })
}
