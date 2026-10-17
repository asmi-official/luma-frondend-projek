import type { Promo } from '../../../api/promo'
import { formatPromoDiscount, formatPromoPeriod } from '../../../pages/data-master/event-promo/format'
import PromoRowActionsMenu from './PromoRowActionsMenu'
import PromoStatusBadge from './PromoStatusBadge'

const VISIBLE_PRODUCT_NAMES = 2

function formatProductSummary(promo: Promo) {
  const visibleNames = promo.products
    .slice(0, VISIBLE_PRODUCT_NAMES)
    .map((product) => product.name)
    .join(', ')
  const hiddenCount = promo.products.length - VISIBLE_PRODUCT_NAMES
  return hiddenCount > 0 ? `${visibleNames} +${hiddenCount}` : visibleNames
}

/** "09:00:00" -> "09:00" */
function formatTime(time: string) {
  return time.slice(0, 5)
}

type PromoTableRowProps = {
  promo: Promo
  isAlternate: boolean
  onEdit: () => void
  onViewDetail: () => void
  onDelete: () => void
}

export default function PromoTableRow({
  promo,
  isAlternate,
  onEdit,
  onViewDetail,
  onDelete,
}: PromoTableRowProps) {
  return (
    <div className={`flex h-16 w-full items-center ${isAlternate ? 'bg-[#fafafb]' : 'bg-white'}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px] pr-6 pl-4">
        <p className="truncate text-sm leading-[normal] font-semibold text-[#20242d]">{promo.name}</p>
        <p className="truncate text-xs leading-[normal] text-[#8f99a7]">{promo.description}</p>
      </div>

      <div className="flex w-[236px] shrink-0 flex-col gap-[3px] pr-6">
        <p className="text-sm leading-[normal] font-medium whitespace-nowrap text-[#20242d]">
          {promo.products.length} Produk
        </p>
        <p className="truncate text-xs leading-[normal] text-[#8f99a7]">{formatProductSummary(promo)}</p>
      </div>

      <div className="flex w-[136px] shrink-0 items-center">
        <p className="text-sm leading-[normal] font-medium whitespace-nowrap text-[#20242d]">
          {formatPromoDiscount(promo.discount_type, Number(promo.discount_value))}
        </p>
      </div>

      <div className="flex w-[196px] shrink-0 flex-col gap-1">
        <p className="text-[13px] leading-[normal] whitespace-nowrap text-[#4a5261]">
          {formatPromoPeriod(promo.start_date, promo.end_date)}
        </p>
        {promo.start_time && promo.end_time && (
          <p className="text-xs leading-[normal] whitespace-nowrap text-[#8f99a7]">
            {formatTime(promo.start_time)} – {formatTime(promo.end_time)}
          </p>
        )}
      </div>

      <div className="flex w-[160px] shrink-0 items-center">
        <PromoStatusBadge status={promo.status} />
      </div>

      <div className="flex w-[84px] shrink-0 items-center">
        <PromoRowActionsMenu onEdit={onEdit} onViewDetail={onViewDetail} onDelete={onDelete} />
      </div>
    </div>
  )
}
