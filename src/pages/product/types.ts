export type ProductFormValues = {
  name: string
  category: string
  sku: string
  unit: string
  cost_price: number
  sell_price: number
  stock: number
  description: string
  active: boolean
  image: File | null
}
