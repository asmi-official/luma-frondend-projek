export type InventoryStatus = 'Aman' | 'Menipis' | 'Habis'

export const INVENTORY_STATUSES: InventoryStatus[] = ['Aman', 'Menipis', 'Habis']

export type InventoryItem = {
  id: string
  productName: string
  category: string
  sku: string
  branch: string
  stock: number
  minStock: number
  unit: string
  /** ISO date-time of the last stock change */
  updatedAt: string
}

/** Out of stock at 0, running low once the stock reaches the minimum, otherwise safe. */
export function getInventoryStatus({ stock, minStock }: Pick<InventoryItem, 'stock' | 'minStock'>): InventoryStatus {
  if (stock === 0) return 'Habis'
  if (stock <= minStock) return 'Menipis'
  return 'Aman'
}
