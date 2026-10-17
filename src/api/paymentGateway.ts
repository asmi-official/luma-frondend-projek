import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'

export const PAYMENT_GATEWAY_QUERY_KEY = ['payment-gateway']

export type PaymentGateway = {
  id: string
  merchant_id: string
  client_key: string
  server_key: string
  active: boolean
  created_at: string
  updated_at: string
}

export type ConnectPaymentGatewayPayload = {
  merchant_id: string
  client_key: string
  server_key: string
}

export type ConnectPaymentGatewayResponse = {
  status: string
  message: string
  data: PaymentGateway
}

export async function connectPaymentGateway(payload: ConnectPaymentGatewayPayload) {
  const { data } = await api.post<ConnectPaymentGatewayResponse>('/payment-gateway', payload)
  return data
}

export function useConnectPaymentGateway() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: connectPaymentGateway,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_GATEWAY_QUERY_KEY })
    },
  })
}

export type UpdatePaymentGatewayPayload = {
  merchant_id: string
  client_key: string
  server_key: string
}

export type UpdatePaymentGatewayResponse = {
  status: string
  message: string
  data: PaymentGateway
}

export async function updatePaymentGateway(payload: UpdatePaymentGatewayPayload) {
  const { data } = await api.put<UpdatePaymentGatewayResponse>('/payment-gateway', payload)
  return data
}

export function useUpdatePaymentGateway() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePaymentGateway,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_GATEWAY_QUERY_KEY })
    },
  })
}

export type GetPaymentGatewayResponse = {
  status: string
  message: string
  data: PaymentGateway | null
}

export async function getPaymentGateway() {
  const { data } = await api.get<GetPaymentGatewayResponse>('/payment-gateway', {
    params: { reveal: true },
  })
  return data
}

export function usePaymentGateway(enabled = true) {
  return useQuery({
    queryKey: PAYMENT_GATEWAY_QUERY_KEY,
    queryFn: getPaymentGateway,
    enabled,
  })
}
