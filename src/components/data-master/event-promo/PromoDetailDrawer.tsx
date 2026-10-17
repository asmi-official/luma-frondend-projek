import Drawer from '@mui/material/Drawer'
import type { ReactNode } from 'react'
import type { Promo } from '../../../api/promo'
import CloseIcon from '../../../icon/CloseIcon'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import { calculatePromoPrice, formatPromoPeriod } from '../../../pages/data-master/event-promo/format'
import { PROMO_DISCOUNT_TYPE_TITLE } from '../../../pages/data-master/event-promo/types'
import { formatRupiahWithPrefix } from '../../../utils/currency'
import PromoStatusBadge from './PromoStatusBadge'

/** "09:00:00" -> "09:00" */
function formatTime(time: string) {
  return time.slice(0, 5)
}

function formatDiscountValue(promo: Promo) {
  if (promo.discount_type === 'percentage') return `${Number(promo.discount_value)}%`
  if (promo.discount_type === 'fixed') return formatRupiahWithPrefix(Number(promo.discount_value))
  return 'Harga khusus per produk'
}

function Divider() {
  return <div className="h-px w-full shrink-0 bg-[#e7e9ed]" />
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-3 leading-[1.4]">
      <p className="text-sm font-semibold text-[#20242d]">{title}</p>
      <div className="flex w-full flex-col gap-3.5">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-1 leading-[1.4]">
      <p className="text-xs text-[#8f99a7]">{label}</p>
      <p className="text-sm font-medium text-[#20242d]">{children}</p>
    </div>
  )
}

type PromoDetailDrawerProps = {
  promo: Promo | null
  isDeactivating: boolean
  onClose: () => void
  onDeactivate: () => void
  onEdit: () => void
}

export default function PromoDetailDrawer({
  promo,
  isDeactivating,
  onClose,
  onDeactivate,
  onEdit,
}: PromoDetailDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={promo !== null}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: '420px', maxWidth: '100vw' } } }}
    >
      {promo && <DrawerContent promo={promo} isDeactivating={isDeactivating} onClose={onClose} onDeactivate={onDeactivate} onEdit={onEdit} />}
    </Drawer>
  )
}

function DrawerContent({
  promo,
  isDeactivating,
  onClose,
  onDeactivate,
  onEdit,
}: Omit<PromoDetailDrawerProps, 'promo'> & { promo: Promo }) {
  // Only a running or scheduled promo can be turned off here; bringing one back means editing its dates
  const canDeactivate = promo.status === 'Aktif' || promo.status === 'Terjadwal'
  const isSpecialPrice = promo.discount_type === 'special_price'

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex w-full shrink-0 items-start justify-between border-b border-[#eceef0] px-5 py-[18px]">
        <p className="text-base leading-[1.4] font-semibold text-[#20242d]">Detail Promo</p>
        <button
          type="button"
          onClick={onClose}
          className="flex size-[18px] items-center justify-center text-[#6a7789]"
        >
          <CloseIcon size={18} />
        </button>
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-6 overflow-y-auto px-5 py-6">
        <div className="flex w-full flex-col gap-2">
          <p className="w-full text-[22px] leading-[normal] font-semibold text-[#20242d]">{promo.name}</p>
          <div className="flex w-full flex-wrap items-center gap-3">
            <PromoStatusBadge status={promo.status} />
            <p className="flex items-center gap-1 text-xs leading-[1.4] whitespace-nowrap text-[#8f99a7]">
              {formatPromoPeriod(promo.start_date, promo.end_date)}
              {promo.start_time && promo.end_time && (
                <>
                  <span className="size-[5px] shrink-0 rounded-full bg-[#e9e9ea]" />
                  {formatTime(promo.start_time)} - {formatTime(promo.end_time)}
                </>
              )}
            </p>
          </div>
        </div>

        <Divider />

        <Section title="Informasi Promo">
          <Field label="Nama">{promo.name}</Field>
          <Field label="Deskripsi">{promo.description || '-'}</Field>
        </Section>

        <Divider />

        <Section title="Aturan Promo">
          <Field label="Jenis">{PROMO_DISCOUNT_TYPE_TITLE[promo.discount_type]}</Field>
          <Field label="Nilai">{formatDiscountValue(promo)}</Field>
        </Section>

        <Divider />

        <div className="flex w-full flex-col gap-3 leading-[1.4]">
          <p className="text-sm font-semibold text-[#20242d]">Produk yang dipromosikan</p>
          <div className="flex w-full flex-col gap-3">
            {promo.products.map((product) => {
              const originalPrice = Number(product.sell_price)
              // A special price promo stores each product's own price; the others share the promo's value
              const promoPrice = calculatePromoPrice(
                originalPrice,
                promo.discount_type,
                isSpecialPrice ? Number(product.promo_discount ?? 0) : Number(promo.discount_value),
              )

              return (
                <div key={product.id} className="flex w-full items-center gap-3">
                  {product.photo_url ? (
                    <img src={product.photo_url} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f1f5]">
                      <DynamicLucideIcon name="package" size={18} className="text-[#8f99a7]" />
                    </span>
                  )}

                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="truncate text-sm font-semibold text-[#20242d]">{product.name}</p>
                    <p className="text-xs text-[#8f99a7]">{formatRupiahWithPrefix(originalPrice)}</p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-[#149042]">
                    {formatRupiahWithPrefix(promoPrice)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-start gap-3 border-t border-[#e7e9ed] bg-white px-6 py-4">
        {canDeactivate && (
          <button
            type="button"
            onClick={onDeactivate}
            disabled={isDeactivating}
            className="flex h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border border-[#ef4444] bg-[#fef2f2] px-4 py-2 disabled:opacity-50"
          >
            <DynamicLucideIcon name="circle-minus" size={18} className="text-[#ef4444]" />
            <span className="text-sm leading-[1.4] font-semibold whitespace-nowrap text-[#ef4444]">Nonaktifkan</span>
          </button>
        )}

        <button
          type="button"
          onClick={onEdit}
          disabled={promo.status === 'Selesai'}
          className="flex h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg bg-[#4e5bd6] px-4 py-2 disabled:opacity-50"
        >
          <DynamicLucideIcon name="pencil" size={18} className="text-[#fdfeff]" />
          <span className="text-sm leading-[1.4] font-semibold whitespace-nowrap text-[#fdfeff]">Ubah</span>
        </button>
      </div>
    </div>
  )
}
