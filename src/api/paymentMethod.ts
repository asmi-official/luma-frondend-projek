import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { buildListQueryParams, type ListQueryParams } from '../lib/queryFilter'

export const PAYMENT_METHODS_QUERY_KEY = ['payment-methods']

export type PaymentMethodParam = {
  id: string
  type_param: string
  value_param: string
  description: string | null
  icon: string | null
  color_icon: string | null
  color_bg_icon: string | null
  active: boolean
}

export type PaymentMethodItem = {
  id: string
  user_id: string
  owner_id: string | null
  active: boolean
  key_payment_param_id: string
  payment_gateway_id: string | null
  created_by: string
  updated_by: string
  deleted_by: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  key_payment: PaymentMethodParam
  payment_gateway: unknown | null
}

export type PaymentMethodColumn = 'id' | 'active' | 'created_at' | 'updated_at'

export type PaymentMethodListMeta = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type PaymentMethodListResponse = {
  status: string
  message: string
  data: PaymentMethodItem[]
  meta: PaymentMethodListMeta
}

export async function getPaymentMethods(query?: ListQueryParams<PaymentMethodColumn>) {
  const params = query ? buildListQueryParams(query) : undefined
  const { data } = await api.get<PaymentMethodListResponse>('/payment-methods', { params })
  return data
}

export function usePaymentMethods(query?: ListQueryParams<PaymentMethodColumn>) {
  return useQuery({
    queryKey: [...PAYMENT_METHODS_QUERY_KEY, query],
    queryFn: () => getPaymentMethods(query),
  })
}

export type CreatePaymentMethodPayload = {
  key_payment_param_id: string
  active: boolean
}

export type CreatePaymentMethodResponse = {
  status: string
  message: string
  data: PaymentMethodItem
}

export async function createPaymentMethod(payload: CreatePaymentMethodPayload) {
  const { data } = await api.post<CreatePaymentMethodResponse>('/payment-methods', payload)
  return data
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY })
    },
  })
}

export type UpdatePaymentMethodPayload = {
  id: string
  active: boolean
}

export type UpdatePaymentMethodResponse = {
  status: string
  message: string
  data: PaymentMethodItem
}

export async function updatePaymentMethod({ id, ...payload }: UpdatePaymentMethodPayload) {
  const { data } = await api.put<UpdatePaymentMethodResponse>(`/payment-methods/${id}`, payload)
  return data
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY })
    },
  })
}
