import type { ExpenseStatus } from '../../pages/pengeluaran/types'

const STATUS_STYLES: Record<ExpenseStatus, { bg: string; border: string; text: string }> = {
  Selesai: { bg: '#e8f8f7', border: '#bde8e5', text: '#268f89' },
  Dibatalkan: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
}

type ExpenseStatusBadgeProps = {
  status: ExpenseStatus
}

export default function ExpenseStatusBadge({ status }: ExpenseStatusBadgeProps) {
  const style = STATUS_STYLES[status]

  return (
    <span
      className="rounded-xl border px-3 py-1 text-xs font-medium leading-[1.4] whitespace-nowrap"
      style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
    >
      {status}
    </span>
  )
}
