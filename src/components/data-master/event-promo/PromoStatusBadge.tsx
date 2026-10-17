import { PROMO_STATUS_LABEL, type PromoStatus } from '../../../pages/data-master/event-promo/types'

const STATUS_STYLES: Record<PromoStatus, { bg: string; border: string; text: string }> = {
  active: { bg: '#e7f4ec', border: '#c8e9d4', text: '#149042' },
  scheduled: { bg: '#f4f0ff', border: '#ddd2ff', text: '#8066b5' },
  finished: { bg: '#e8f8f7', border: '#bde8e5', text: '#268f89' },
  inactive: { bg: '#f5f6f7', border: '#d9dde2', text: '#8a929b' },
}

type PromoStatusBadgeProps = {
  status: PromoStatus
}

export default function PromoStatusBadge({ status }: PromoStatusBadgeProps) {
  const style = STATUS_STYLES[status]

  return (
    <span
      className="rounded-xl border px-3 py-1 text-xs font-medium leading-[1.4] whitespace-nowrap"
      style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
    >
      {PROMO_STATUS_LABEL[status]}
    </span>
  )
}
