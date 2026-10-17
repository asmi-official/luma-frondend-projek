import type { Product } from '../../api/product'
import StatusBadge from '../data-master/category/StatusBadge'
import DynamicLucideIcon from '../../icon/DynamicLucideIcon'
import ProductRowActionsMenu from './ProductRowActionsMenu'

function formatPrice(price: string) {
  return `Rp ${Number(price).toLocaleString('id-ID')}`
}

type ProductTableRowProps = {
  product: Product
  isAlternate: boolean
  onEdit: () => void
  onViewDetail: () => void
  onViewSalesAnalytics: () => void
  onDelete: () => void
}

export default function ProductTableRow({
  product,
  isAlternate,
  onEdit,
  onViewDetail,
  onViewSalesAnalytics,
  onDelete,
}: ProductTableRowProps) {
  const isLowStock = product.stock <= 10

  return (
    <div className={`flex w-full items-center ${isAlternate ? 'bg-[#fafafb]' : 'bg-white'}`}>
      <div className="flex min-w-0 flex-1 items-center gap-3 py-3 pr-2 pl-4">
        {product.photo_url ? (
          <img
            src={product.photo_url}
            alt={product.name}
            className="size-10 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f1f5]">
            <DynamicLucideIcon name="package" size={18} className="text-[#8f99a7]" />
          </span>
        )}
        <div className="flex min-w-0 flex-col items-start whitespace-nowrap">
          <p className="text-sm font-medium leading-[1.4] text-[#20242d]">{product.name}</p>
          <p className="text-xs leading-[1.4] text-[#8f99a7]">{product.sku}</p>
        </div>
      </div>

      <div className="flex w-[130px] shrink-0 items-center px-4 py-3">
        <p className="text-sm leading-[1.4] whitespace-nowrap text-[#6a7789]">{product.category}</p>
      </div>

      <div className="flex w-[120px] shrink-0 items-center px-4 py-3">
        <p className="text-sm font-medium leading-[1.4] whitespace-nowrap text-[#20242d]">
          {formatPrice(product.sell_price)}
        </p>
      </div>

      <div className="flex w-[90px] shrink-0 items-center px-4 py-3">
        <p
          className={`text-sm leading-[1.4] whitespace-nowrap ${isLowStock ? 'text-[#d1293d]' : 'text-[#6a7789]'}`}
        >
          {product.stock}
        </p>
      </div>

      <div className="flex w-[120px] shrink-0 items-center px-4 py-3">
        <StatusBadge active={product.active} />
      </div>

      <div className="flex w-[56px] shrink-0 items-center justify-end px-4 py-3">
        <ProductRowActionsMenu
          onEdit={onEdit}
          onViewDetail={onViewDetail}
          onViewSalesAnalytics={onViewSalesAnalytics}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
