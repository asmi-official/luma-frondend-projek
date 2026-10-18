export type ExpenseStatus = 'Selesai' | 'Dibatalkan'

export type ExpenseItem = {
  id: string
  /** ISO date (YYYY-MM-DD) */
  date: string
  title: string
  /** Who the money was paid to */
  vendor: string
  category: string
  branch: string
  paymentMethod: string
  /** Rupiah */
  amount: number
  status: ExpenseStatus
}
