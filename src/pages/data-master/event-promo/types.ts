/** Status values exactly as the API returns and filters them. */
export type PromoStatus = 'Aktif' | 'Terjadwal' | 'Selesai' | 'Nonaktif'

export const PROMO_STATUSES: PromoStatus[] = ['Aktif', 'Terjadwal', 'Selesai', 'Nonaktif']

export type PromoDiscountType = 'percentage' | 'fixed' | 'special_price'

/** Title of each discount type, shown on the option cards and sent as the promo's discount text. */
export const PROMO_DISCOUNT_TYPE_TITLE: Record<PromoDiscountType, string> = {
  percentage: 'Diskon Persentase',
  fixed: 'Diskon Nominal',
  special_price: 'Harga Spesial',
}

/** Short explanation of each discount type, shown on the option cards and sent as the promo's discount description. */
export const PROMO_DISCOUNT_TYPE_DESCRIPTION: Record<PromoDiscountType, string> = {
  percentage: 'Potongan harga dalam persen (%)',
  fixed: 'Potongan harga dalam nominal (Rp)',
  special_price: 'Harga tetap khusus saat promo',
}

/** Snapshot of a product at the time it was added to a promo. */
export type PromoProduct = {
  id: string
  name: string
  category: string
  price: number
  photoUrl: string | null
}

export type PromoFormValues = {
  name: string
  description: string
  products: PromoProduct[]
  discountType: PromoDiscountType
  discountValue: number
  /** Special price per product id, used when the promo type is "special_price" */
  specialPrices: Record<string, number>
  startDate: string
  endDate: string
  useTime: boolean
  startTime: string
  endTime: string
}
