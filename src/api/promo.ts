import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { buildListQueryParams, type ListQueryParams } from '../lib/queryFilter'
import type { PromoDiscountType, PromoStatus } from '../pages/data-master/event-promo/types'

export const PROMOS_QUERY_KEY = ['promos']

/** A product attached to a promo, as returned inside a promo. */
export type PromoItemProduct = {
  id: string
  sku: string
  name: string
  category: string
  category_id: string
  unit: string
  cost_price: string
  sell_price: string
  stock: number
  photo_url: string | null
  active: boolean
  /** Rupiah off this product's price, or its own price for a special price promo (decimal as text) */
  promo_discount: string | null
}

export type Promo = {
  id: string
  name: string
  description: string | null
  discount_type: PromoDiscountType
  /** Decimal as text, e.g. "20.00" */
  discount_value: string
  discount_text: string | null
  discount_description: string | null
  /** YYYY-MM-DD */
  start_date: string
  /** YYYY-MM-DD */
  end_date: string
  /** HH:mm:ss, null when the promo runs all day */
  start_time: string | null
  /** HH:mm:ss, null when the promo runs all day */
  end_time: string | null
  status: PromoStatus
  user_id: string
  owner_id: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  deleted_at: string | null
  deleted_by: string | null
  products: PromoItemProduct[]
}

export type PromoColumn =
  | 'id'
  | 'name'
  | 'discount_type'
  | 'discount_value'
  | 'discount_text'
  | 'discount_description'
  | 'start_date'
  | 'end_date'
  | 'start_time'
  | 'end_time'
  | 'status'
  | 'created_at'
  | 'updated_at'

export type PromoListMeta = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type PromoListResponse = {
  status: string
  message: string
  /** Counts per status for the summary line; the list endpoint adds them next to `data` */
  total_promo?: number
  total_aktif?: number
  total_terjadwal?: number
  total_selesai?: number
  total_nonaktif?: number
  data: Promo[]
  meta: PromoListMeta
}

export type PromoListQuery = ListQueryParams<PromoColumn> & {
  search?: string
}

export async function getPromos(query?: PromoListQuery) {
  const { search, ...rest } = query ?? {}
  const params = query ? buildListQueryParams(rest) : undefined

  if (search) {
    params!.search = search
  }

  const { data } = await api.get<PromoListResponse>('/promos', { params })
  return data
}

export function usePromos(query?: PromoListQuery) {
  return useQuery({
    queryKey: [...PROMOS_QUERY_KEY, query],
    queryFn: () => getPromos(query),
  })
}

export type CreatePromoProduct = {
  id: string
  /** Rupiah taken off this product's price, or the product's own price for a special price promo */
  promo_discount: number
}

export type CreatePromoPayload = {
  name: string
  description: string
  discount_type: string
  /** The entered value as text, e.g. "20"; "Harga Spesial" for a special price promo */
  discount_value: string
  /** Label of the chosen discount, e.g. "Diskon 20%" */
  discount_text: string
  /** Explanation of the chosen discount type */
  discount_description: string
  /** YYYY-MM-DD */
  start_date: string
  /** YYYY-MM-DD */
  end_date: string
  /** HH:mm, only sent when the promo has a time window */
  start_time?: string
  /** HH:mm, only sent when the promo has a time window */
  end_time?: string
  products: CreatePromoProduct[]
}

export type CreatePromoResponse = {
  status: string
  message: string
  data: unknown
}

export async function createPromo(payload: CreatePromoPayload) {
  const { data } = await api.post<CreatePromoResponse>('/promos', payload)
  return data
}

export function useCreatePromo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPromo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOS_QUERY_KEY })
    },
  })
}

export type PromoDetailResponse = {
  status: string
  message: string
  data: Promo
}

export async function getPromoDetail(id: string) {
  const { data } = await api.get<PromoDetailResponse>(`/promos/${id}`)
  return data
}

export function usePromoDetail(id: string | undefined) {
  return useQuery({
    queryKey: [...PROMOS_QUERY_KEY, id],
    queryFn: () => getPromoDetail(id as string),
    enabled: !!id,
  })
}

export type UpdatePromoPayload = Omit<CreatePromoPayload, 'start_date' | 'start_time' | 'end_time'> & {
  id: string
  /** Only send when the start date was changed: the API rejects a start date before today */
  start_date?: string
  /** null clears the time window */
  start_time?: string | null
  /** null clears the time window */
  end_time?: string | null
  /** Left out to keep the current status; the API only changes it when one is sent */
  status?: PromoStatus
}

export type UpdatePromoResponse = {
  status: string
  message: string
  data: Promo
}

export async function updatePromo({ id, ...payload }: UpdatePromoPayload) {
  const { data } = await api.put<UpdatePromoResponse>(`/promos/${id}`, payload)
  return data
}

export function useUpdatePromo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePromo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOS_QUERY_KEY })
    },
  })
}

export type UpdatePromoStatusPayload = {
  id: string
  status: PromoStatus
  /** The API always wants the full product list on update, so send the promo's current products unchanged */
  products: { id: string; promo_discount: number | null }[]
}

/** Changes only the status of a promo (e.g. to "Nonaktif") through PUT; everything else stays as it is. */
export async function updatePromoStatus({ id, ...payload }: UpdatePromoStatusPayload) {
  const { data } = await api.put<UpdatePromoResponse>(`/promos/${id}`, payload)
  return data
}

export function useUpdatePromoStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePromoStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOS_QUERY_KEY })
    },
  })
}

export type DeletePromoResponse = {
  status: string
  message: string
}

export async function deletePromo(id: string) {
  const { data } = await api.delete<DeletePromoResponse>(`/promos/${id}`)
  return data
}

export function useDeletePromo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePromo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOS_QUERY_KEY })
    },
  })
}
