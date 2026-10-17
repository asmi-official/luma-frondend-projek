import Drawer from '@mui/material/Drawer'
import type { Product } from '../../api/product'
import StatusBadge from '../data-master/category/StatusBadge'
import CloseIcon from '../../icon/CloseIcon'
import DynamicLucideIcon from '../../icon/DynamicLucideIcon'

function formatPrice(price: string) {
  return `Rp ${Number(price).toLocaleString('id-ID')}`
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

type ProductDetailDrawerProps = {
  product: Product | null
  onClose: () => void
  onToggleActive: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function ProductDetailDrawer({
  product,
  onClose,
  onToggleActive,
  onEdit,
  onDelete,
}: ProductDetailDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={product !== null}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: '420px' } } }}
    >
      {product && (
        <div className="flex h-full w-full flex-col items-start bg-white">
          <div className="flex w-full items-start justify-between border-b border-[#dadde1] px-5 py-[18px]">
            <p className="text-base leading-[1.4] font-semibold text-[#20242d]">Detail Produk</p>
            <button
              type="button"
              onClick={onClose}
              className="flex size-[18px] items-center justify-center text-[#6a7789]"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div className="flex w-full flex-1 flex-col items-start gap-5 overflow-y-auto p-5">
            <div className="flex w-full items-center gap-3.5">
              {product.photo_url ? (
                <img
                  src={product.photo_url}
                  alt={product.name}
                  className="size-16 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#f0f1f5]">
                  <DynamicLucideIcon name="package" size={24} className="text-[#8f99a7]" />
                </span>
              )}
              <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
                <p className="text-base leading-[normal] font-semibold text-[#20242d]">
                  {product.name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[12.5px] leading-[normal] whitespace-nowrap text-[#8f99a7]">
                    {product.sku}
                  </p>
                  <StatusBadge active={product.active} />
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-[#eceef0]" />

            <div className="flex w-full flex-col items-start gap-3.5 text-xs leading-[1.4]">
              <div className="flex w-full items-center justify-between">
                <p className="text-[#6a7789]">Kategori</p>
                <p className="font-medium text-[#20242d]">{product.category}</p>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-[#6a7789]">Harga Jual</p>
                <p className="font-medium text-[#20242d]">{formatPrice(product.sell_price)}</p>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-[#6a7789]">Stok Tersedia</p>
                <p className="font-medium text-[#20242d]">{product.stock} unit</p>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-[#6a7789]">Ditambahkan pada</p>
                <p className="font-medium text-[#20242d]">{formatDate(product.created_at)}</p>
              </div>
            </div>

            <div className="h-px w-full bg-[#eceef0]" />

            <div className="flex w-full flex-col items-start gap-2 text-xs leading-[1.4]">
              <p className="font-medium text-[#8f99a7]">Deskripsi Produk</p>
              <p className="text-[#20242d]">{product.description}</p>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-2.5 border-t border-[#eceef0] bg-[#fcfcff] px-5 pt-4 pb-5">
            <div className="flex w-full items-start gap-3">
              <button
                type="button"
                onClick={onToggleActive}
                className="flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-[#4e5bd6] bg-[#fdfeff] px-4 py-2"
              >
                <DynamicLucideIcon
                  name={product.active ? 'circle-minus' : 'circle-check'}
                  size={18}
                  className="text-[#4e5bd6]"
                />
                <span className="text-sm font-semibold whitespace-nowrap text-[#4e5bd6]">
                  {product.active ? 'Nonaktifkan' : 'Aktifkan'}
                </span>
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[#4e5bd6] px-4 py-2"
              >
                <DynamicLucideIcon name="pencil" size={18} className="text-[#fdfeff]" />
                <span className="text-sm font-semibold whitespace-nowrap text-[#fdfeff]">
                  Ubah Produk
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={onDelete}
              className="flex h-9 w-full items-center justify-center gap-1 rounded-lg border border-[#d1293d] bg-[#fdfeff] px-4 py-2"
            >
              <DynamicLucideIcon name="trash-2" size={18} className="text-[#d1293d]" />
              <span className="text-sm font-semibold whitespace-nowrap text-[#d1293d]">
                Hapus Produk
              </span>
            </button>
          </div>
        </div>
      )}
    </Drawer>
  )
}
