const rupiahFormatter = new Intl.NumberFormat('id-ID')

/** Formats a number as Indonesian thousand-separated digits, e.g. 10000 -> "10.000" */
export function formatRupiah(value: number | string) {
  const numericValue = typeof value === 'string' ? parseRupiah(value) : value
  return numericValue ? rupiahFormatter.format(numericValue) : ''
}

/** Formats a number with a "Rp" prefix, e.g. 10000 -> "Rp 10.000" */
export function formatRupiahWithPrefix(value: number | string) {
  const formatted = formatRupiah(value)
  return formatted ? `Rp ${formatted}` : 'Rp 0'
}

/** Extracts the numeric value from a formatted rupiah string, e.g. "Rp 10.000" -> 10000 */
export function parseRupiah(text: string) {
  const digitsOnly = text.replace(/\D/g, '')
  return digitsOnly ? Number(digitsOnly) : 0
}
