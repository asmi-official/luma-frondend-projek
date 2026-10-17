import { formatRupiah, formatRupiahWithPrefix } from '../../../utils/currency'
import type { PromoDiscountType } from './types'

const SHORT_MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const LONG_MONTH_LABELS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

function parseIsoDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return { year, month, day }
}

/** "2026-09-12" -> "12 September 2026" */
export function formatLongDate(isoDate: string) {
  const { year, month, day } = parseIsoDate(isoDate)
  return `${day} ${LONG_MONTH_LABELS[month - 1]} ${year}`
}

/** "2026-09-12", "2026-09-18" -> "12 Sep – 18 Sep 2026" */
export function formatPromoPeriod(startDate: string, endDate: string) {
  const start = parseIsoDate(startDate)
  const end = parseIsoDate(endDate)
  const startLabel = `${start.day} ${SHORT_MONTH_LABELS[start.month - 1]}`
  const endLabel = `${end.day} ${SHORT_MONTH_LABELS[end.month - 1]} ${end.year}`

  return start.year === end.year
    ? `${startLabel} – ${endLabel}`
    : `${startLabel} ${start.year} – ${endLabel}`
}

/** Compact value for the promo table: "20%", "Rp5.000" or "Harga Spesial". */
export function formatPromoDiscount(type: PromoDiscountType, value: number) {
  if (type === 'percentage') return `${value}%`
  if (type === 'nominal') return `Rp${formatRupiah(value) || '0'}`
  return 'Harga Spesial'
}

/** Label for previews and summaries: "Diskon 20%", "Diskon Rp 5.000" or "Harga Spesial". */
export function formatPromoBenefit(type: PromoDiscountType, value: number) {
  if (type === 'percentage') return `Diskon ${value}%`
  if (type === 'nominal') return `Diskon ${formatRupiahWithPrefix(value)}`
  return 'Harga Spesial'
}

/** Price of a product once the promo is applied. */
export function calculatePromoPrice(price: number, type: PromoDiscountType, value: number) {
  if (type === 'percentage') return Math.max(0, Math.round((price * (100 - value)) / 100))
  if (type === 'nominal') return Math.max(0, price - value)
  return value
}
