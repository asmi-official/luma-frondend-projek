import DynamicLucideIcon from '../../icon/DynamicLucideIcon'
import { getInventoryStatus, type InventoryItem, type InventoryStatus } from '../../pages/inventory/types'
import InventoryStatusBadge from './InventoryStatusBadge'

const STOCK_COLOR_BY_STATUS: Record<InventoryStatus, string> = {
  Aman: 'text-[#20242d]',
  Menipis: 'text-[#cb7b00]',
  Habis: 'text-[#d1293d]',
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** "2 menit lalu", "3 jam lalu", "Hari ini, 09:12", "Kemarin, 17:05" or "30 Sep 2026" */
function formatLastUpdated(isoDateTime: string) {
  const updatedAt = new Date(isoDateTime)
  const now = new Date()

  const minutes = Math.floor((now.getTime() - updatedAt.getTime()) / 60_000)
  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`

  const hours = Math.floor(minutes / 60)
  if (hours < 4) return `${hours} jam lalu`

  const time = updatedAt
    .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
    .replace('.', ':')
  const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const daysAgo = Math.round((startOfDay(now) - startOfDay(updatedAt)) / MS_PER_DAY)

  if (daysAgo === 0) return `Hari ini, ${time}`
  if (daysAgo === 1) return `Kemarin, ${time}`
  return updatedAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

type InventoryTableRowProps = {
  item: InventoryItem
  isAlternate: boolean
  onViewDetail: () => void
}

export default function InventoryTableRow({ item, isAlternate, onViewDetail }: InventoryTableRowProps) {
  const status = getInventoryStatus(item)

  return (
    <div className={`flex h-16 w-full items-center gap-4 px-4 ${isAlternate ? 'bg-[#fafafb]' : 'bg-white'}`}>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 leading-[1.4] whitespace-nowrap">
        <p className="truncate text-sm font-medium text-[#20242d]">{item.productName}</p>
        <p className="truncate text-xs text-[#8f99a7]">{item.category}</p>
      </div>

      <p className="w-24 shrink-0 text-sm leading-[1.4] whitespace-nowrap text-[#6a7789]">{item.sku}</p>

      <p className="w-[120px] shrink-0 text-sm leading-[1.4] whitespace-nowrap text-[#20242d]">{item.branch}</p>

      <p
        className={`w-24 shrink-0 text-right text-sm leading-[1.4] font-semibold whitespace-nowrap ${STOCK_COLOR_BY_STATUS[status]}`}
      >
        {item.stock} {item.unit}
      </p>

      <p className="w-22 shrink-0 text-right text-sm leading-[1.4] whitespace-nowrap text-[#6a7789]">
        {item.minStock} {item.unit}
      </p>

      <div className="flex w-[104px] shrink-0 items-center">
        <InventoryStatusBadge status={status} />
      </div>

      <p className="w-[132px] shrink-0 text-sm leading-[1.4] whitespace-nowrap text-[#8f99a7]">
        {formatLastUpdated(item.updatedAt)}
      </p>

      <div className="flex w-[100px] shrink-0 items-center justify-center">
        <button
          type="button"
          onClick={onViewDetail}
          aria-label={`Lihat detail ${item.productName}`}
          className="flex size-6 items-center justify-center rounded-md text-[#4d5057] hover:bg-[#f0f1f5]"
        >
          <DynamicLucideIcon name="eye" size={18} />
        </button>
      </div>
    </div>
  )
}
