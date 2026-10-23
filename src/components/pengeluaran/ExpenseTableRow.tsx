import DynamicLucideIcon from '../../icon/DynamicLucideIcon'
import type { ExpenseItem } from '../../pages/pengeluaran/types'
import { formatRupiah } from '../../utils/currency'
import ExpenseStatusBadge from './ExpenseStatusBadge'

const CATEGORY_DOT_COLORS: Record<string, string> = {
  'Bahan Baku': '#717cde',
  Utilitas: '#feae33',
  Operasional: '#4cba8d',
  Marketing: '#de806e',
  Maintenance: '#5ba4e6',
  Transportasi: '#79cbaa',
  Sewa: '#e6a092',
  Pajak: '#fec266',
}
const DEFAULT_DOT_COLOR = '#a6abb4'
const CANCELLED_DOT_COLOR = '#d9dde2'

type ExpenseTableRowProps = {
  expense: ExpenseItem
  isAlternate: boolean
  onViewDetail: () => void
}

export default function ExpenseTableRow({ expense, isAlternate, onViewDetail }: ExpenseTableRowProps) {
  const isCancelled = expense.status === 'Dibatalkan'
  // A cancelled expense is dimmed and its amount struck through
  const textClass = isCancelled ? 'text-[#8f99a7]' : 'text-[#20242d]'
  const dotColor = isCancelled ? CANCELLED_DOT_COLOR : (CATEGORY_DOT_COLORS[expense.category] ?? DEFAULT_DOT_COLOR)

  return (
    <div className={`flex h-16 w-full items-center gap-4 px-4 ${isAlternate ? 'bg-[#fafafb]' : 'bg-white'}`}>
      <p className={`w-24 shrink-0 text-[13px] whitespace-nowrap ${isCancelled ? 'text-[#8f99a7]' : 'text-[#6a7789]'}`}>
        {new Date(`${expense.date}T00:00:00`).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </p>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 whitespace-nowrap">
        <p className={`truncate text-[13px] font-medium ${textClass}`}>{expense.title}</p>
        <p className="truncate text-xs text-[#8f99a7]">{expense.vendor}</p>
      </div>

      <div className="flex w-32 shrink-0 items-center gap-2">
        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: dotColor }} />
        <p className={`truncate text-[13px] whitespace-nowrap ${textClass}`}>{expense.category}</p>
      </div>

      <p className={`w-[148px] shrink-0 truncate text-[13px] whitespace-nowrap ${textClass}`}>{expense.branch}</p>

      <p className={`w-32 shrink-0 truncate text-[13px] whitespace-nowrap ${textClass}`}>{expense.paymentMethod}</p>

      <p
        className={`w-28 shrink-0 text-right text-[13px] font-semibold whitespace-nowrap ${textClass} ${
          isCancelled ? 'line-through' : ''
        }`}
      >
        Rp{formatRupiah(expense.amount)}
      </p>

      <div className="flex w-28 shrink-0 items-center">
        <ExpenseStatusBadge status={expense.status} />
      </div>

      <div className="flex w-[60px] shrink-0 items-center justify-center">
        <button
          type="button"
          onClick={onViewDetail}
          aria-label={`Lihat detail ${expense.title}`}
          className="flex size-6 items-center justify-center rounded-md text-[#4d5057] hover:bg-[#f0f1f5]"
        >
          <DynamicLucideIcon name="eye" size={18} />
        </button>
      </div>
    </div>
  )
}
