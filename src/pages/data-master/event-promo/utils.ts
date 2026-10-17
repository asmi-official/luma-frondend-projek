import type { Promo, PromoFormValues, PromoStatus } from './types'

function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** Today's date as YYYY-MM-DD in the user's local time zone. */
export function getTodayIsoDate() {
  return toIsoDate(new Date())
}

/** An inactive promo stays inactive; otherwise the status follows the promo period. */
export function resolvePromoStatus(
  startDate: string,
  endDate: string,
  currentStatus?: PromoStatus,
): PromoStatus {
  if (currentStatus === 'inactive') return 'inactive'

  const today = getTodayIsoDate()
  if (startDate > today) return 'scheduled'
  if (endDate < today) return 'finished'
  return 'active'
}

export function promoToFormValues(promo: Promo): PromoFormValues {
  return {
    name: promo.name,
    description: promo.description,
    products: promo.products,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    specialPrices: Object.fromEntries(
      promo.products
        .filter((product) => product.specialPrice !== undefined)
        .map((product) => [product.id, product.specialPrice as number]),
    ),
    startDate: promo.startDate,
    endDate: promo.endDate,
    useTime: Boolean(promo.startTime && promo.endTime),
    startTime: promo.startTime ?? '',
    endTime: promo.endTime ?? '',
  }
}

export function formValuesToPromo(
  values: PromoFormValues,
  currentStatus?: PromoStatus,
): Omit<Promo, 'id'> {
  const isSpecialPrice = values.discountType === 'special_price'

  return {
    name: values.name.trim(),
    description: values.description.trim(),
    products: values.products.map((product) => ({
      ...product,
      specialPrice: isSpecialPrice ? values.specialPrices[product.id] : undefined,
    })),
    allProducts: false,
    discountType: values.discountType,
    discountValue: isSpecialPrice ? 0 : values.discountValue,
    startDate: values.startDate,
    endDate: values.endDate,
    startTime: values.useTime ? values.startTime : undefined,
    endTime: values.useTime ? values.endTime : undefined,
    status: resolvePromoStatus(values.startDate, values.endDate, currentStatus),
  }
}
