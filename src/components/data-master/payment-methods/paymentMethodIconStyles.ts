type PaymentMethodIconStyle = { bg: string; border: string; color: string }

const paymentMethodIconStyleMap: Record<string, PaymentMethodIconStyle> = {
  banknote: { bg: '#e6f7f0', border: '#a6ffda', color: '#1fa971' },
  'qr-code': { bg: '#eaf7f7', border: '#d0ffff', color: '#299b9b' },
  landmark: { bg: '#fdecef', border: '#ffecf0', color: '#d1293d' },
}

const defaultPaymentMethodIconStyle: PaymentMethodIconStyle = {
  bg: '#edeffb',
  border: '#b8c6ff',
  color: '#4e5bd6',
}

export function getPaymentMethodIconStyle(icon: string): PaymentMethodIconStyle {
  return paymentMethodIconStyleMap[icon] ?? defaultPaymentMethodIconStyle
}
