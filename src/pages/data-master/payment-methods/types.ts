export type PaymentMethod = {
  id: string
  name: string
  description: string
  active: boolean
  icon: string
}

export type PaymentMethodFormValues = {
  flexParamId: string
  name: string
  description: string
  icon: string
}
