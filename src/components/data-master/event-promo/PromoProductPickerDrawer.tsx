import Drawer from '@mui/material/Drawer'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteProducts, type Product } from '../../../api/product'
import { useProductCategoryOptions } from '../../../api/productCategory'
import CheckIcon from '../../../icon/CheckIcon'
import CloseIcon from '../../../icon/CloseIcon'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import type { PromoProduct } from '../../../pages/data-master/event-promo/types'
import { formatRupiahWithPrefix } from '../../../utils/currency'
import FilterDropdown from '../../global/FilterDropdown'

const PAGE_SIZE = 20

function toPromoProduct(product: Product): PromoProduct {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.sell_price),
    photoUrl: product.photo_url,
  }
}

type PromoProductPickerDrawerProps = {
  open: boolean
  selected: PromoProduct[]
  onClose: () => void
  onConfirm: (selected: PromoProduct[]) => void
}

export default function PromoProductPickerDrawer({
  open,
  selected,
  onClose,
  onConfirm,
}: PromoProductPickerDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: { sx: { width: '560px', maxWidth: '100vw' } },
        backdrop: { sx: { backgroundColor: 'rgba(32, 36, 45, 0.45)', backdropFilter: 'blur(2px)' } },
      }}
    >
      {/* Drawer content mounts on open, so the draft selection always starts from the current value */}
      <PickerContent selected={selected} onClose={onClose} onConfirm={onConfirm} />
    </Drawer>
  )
}

type PickerContentProps = Omit<PromoProductPickerDrawerProps, 'open'>

function PickerContent({ selected, onClose, onConfirm }: PickerContentProps) {
  const [draft, setDraft] = useState<PromoProduct[]>(selected)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const categoryOptions = useProductCategoryOptions()

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteProducts({
    search: search.trim() || undefined,
    filter: [
      { key: 'active', operator: 'equal', value: true },
      ...(categoryId ? [{ key: 'category_id' as const, operator: 'equal' as const, value: categoryId }] : []),
    ],
    sort: 'created_at',
    order: 'desc',
    limit: PAGE_SIZE,
  })

  const products = data?.pages.flatMap((page) => page.data) ?? []

  // Load the next page whenever the end of the list scrolls into view (also covers a first page that doesn't fill the box)
  useEffect(() => {
    const root = scrollRef.current
    const sentinel = sentinelRef.current
    if (!root || !sentinel || !hasNextPage || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage()
      },
      { root, rootMargin: '120px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, products.length])

  // Selection is kept as snapshots, so it survives search/filter changes that hide a selected product
  const toggleProduct = (product: Product) => {
    setDraft((current) =>
      current.some((item) => item.id === product.id)
        ? current.filter((item) => item.id !== product.id)
        : [...current, toPromoProduct(product)],
    )
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex w-full shrink-0 items-start justify-between border-b border-[#dadde1] px-5 py-[18px]">
        <p className="text-base leading-[1.4] font-semibold text-[#20242d]">Pilih Produk</p>
        <button
          type="button"
          onClick={onClose}
          className="flex size-[18px] items-center justify-center text-[#6a7789]"
        >
          <CloseIcon size={18} />
        </button>
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-5 p-5">
        <div className="flex w-full shrink-0 items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e9e9ea] bg-white p-3">
            <DynamicLucideIcon name="search" size={18} className="text-[#8f99a7]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama produk..."
              className="w-full text-sm text-[#20242d] placeholder:text-[#8f99a7] focus:outline-none"
            />
          </div>

          <FilterDropdown
            allLabel="Semua Kategori"
            searchPlaceholder="Cari kategori..."
            options={categoryOptions}
            value={categoryId}
            onChange={setCategoryId}
          />
        </div>

        <div
          ref={scrollRef}
          className="min-h-0 w-full flex-1 overflow-auto rounded-xl border border-[#ebedf1] bg-white"
        >
          {isLoading && <p className="w-full py-10 text-center text-sm text-[#8f99a7]">Memuat produk...</p>}

          {!isLoading && products.length === 0 && (
            <p className="w-full py-10 text-center text-sm text-[#8f99a7]">Tidak ada produk ditemukan</p>
          )}

          {products.map((product) => {
            const isSelected = draft.some((item) => item.id === product.id)
            return (
              <label
                key={product.id}
                className={`flex w-full cursor-pointer items-center gap-3 border-b border-[#e5e5e5] px-4 py-3 ${
                  isSelected ? 'bg-[#eef0ff]' : 'bg-white hover:bg-[#fafafb]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleProduct(product)}
                  className="peer sr-only"
                />
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded peer-focus-visible:ring-2 peer-focus-visible:ring-[#4e5bd6]/40 ${
                    isSelected ? 'bg-[#4e5bd6] text-white' : 'border border-[#e9e9e9] bg-white'
                  }`}
                >
                  {isSelected && <CheckIcon size={11} />}
                </span>

                {product.photo_url ? (
                  <img src={product.photo_url} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f1f5]">
                    <DynamicLucideIcon name="package" size={18} className="text-[#8f99a7]" />
                  </span>
                )}

                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm leading-[1.4] font-semibold text-[#20242d]">{product.name}</span>
                  <span className="flex items-center gap-[5px] text-xs leading-[1.4] whitespace-nowrap text-[#8f99a7]">
                    {product.category}
                    <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
                    {formatRupiahWithPrefix(product.sell_price)}
                  </span>
                </span>
              </label>
            )
          })}

          <div ref={sentinelRef} className="h-px w-full" />

          {isFetchingNextPage && (
            <p className="w-full py-3 text-center text-xs text-[#8f99a7]">Memuat produk lainnya...</p>
          )}
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-between border-t border-[#dadde1] bg-white px-5 py-4">
        <p className="text-sm leading-[1.4] font-semibold whitespace-nowrap text-[#4e5bd6]">
          {draft.length} produk dipilih
        </p>

        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 items-center justify-center rounded-lg border border-[#4e5bd6] bg-[#fdfeff] px-4 py-2 text-sm leading-[1.4] font-semibold whitespace-nowrap text-[#4e5bd6] hover:bg-[#f7f8fc]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(draft)}
            className="flex h-9 items-center justify-center rounded-lg bg-[#4e5bd6] px-4 py-2 text-sm leading-[1.4] font-semibold whitespace-nowrap text-[#fdfeff] hover:bg-[#3f4bc0]"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  )
}
