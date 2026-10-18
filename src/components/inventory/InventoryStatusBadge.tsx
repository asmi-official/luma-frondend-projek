import type { InventoryStatus } from '../../pages/inventory/types'

const STATUS_STYLES: Record<InventoryStatus, { bg: string; border: string; text: string }> = {
  Aman: { bg: '#e7f4ec', border: '#c8e9d4', text: '#149042' },
  Menipis: { bg: '#fff8e6', border: '#f0dfa8', text: '#a67c00' },
  Habis: { bg: '#fdedef', border: '#f2c7ce', text: '#c83e50' },
}

type InventoryStatusBadgeProps = {
  status: InventoryStatus
}

export default function InventoryStatusBadge({ status }: InventoryStatusBadgeProps) {
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
