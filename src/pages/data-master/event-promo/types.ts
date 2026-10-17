export type PromoStatus = 'active' | 'scheduled' | 'finished' | 'inactive'

export type PromoDiscountType = 'percentage' | 'nominal' | 'special_price'

export const PROMO_STATUS_LABEL: Record<PromoStatus, string> = {
  active: 'Aktif',
  scheduled: 'Terjadwal',
  finished: 'Selesai',
  inactive: 'Nonaktif',
}

/** Snapshot of a product at the time it was added to a promo. */
export type PromoProduct = {
  id: string
  name: string
  category: string
  price: number
  photoUrl: string | null
  /** Fixed price during the promo; only set when the promo type is "special_price". */
  specialPrice?: number
}

export type Promo = {
  id: string
  name: string
  description: string
  products: PromoProduct[]
  allProducts: boolean
  discountType: PromoDiscountType
  /** Percent for "percentage", rupiah for "nominal"; unused for "special_price" (each product has its own price). */
  discountValue: number
  /** ISO date (YYYY-MM-DD) */
  startDate: string
  /** ISO date (YYYY-MM-DD) */
  endDate: string
  /** HH:mm */
  startTime?: string
  /** HH:mm */
  endTime?: string
  status: PromoStatus
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
