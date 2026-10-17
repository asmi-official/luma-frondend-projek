import Drawer from '@mui/material/Drawer'
import type { Product } from '../../api/product'
import CloseIcon from '../../icon/CloseIcon'
import DynamicLucideIcon from '../../icon/DynamicLucideIcon'

const DAY_LABELS = ['S', 'S', 'R', 'K', 'J', 'S', 'M']

type SalesAnalytics = {
  totalSold: number
  soldGrowthPercent: number
  revenue: number
  revenueGrowthPercent: number
  dailyTrend: number[]
  peakDayIndex: number
  rank: number
  category: string
}

function hashSeed(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return hash
}

function formatCompactRupiah(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1).replace('.', ',')}jt`
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)}rb`
  }
  return `Rp ${value}`
}

function getSalesAnalytics(product: Product): SalesAnalytics {
  const seed = hashSeed(product.id)
  const sellPrice = Number(product.sell_price) || 1

  const totalSold = 40 + (seed % 280)
  const soldGrowthPercent = -10 + (seed % 36)
  const revenue = totalSold * sellPrice
  const revenueGrowthPercent = -10 + ((seed >> 3) % 36)

  const dailyTrend = DAY_LABELS.map((_, index) => {
    const variance = (seed >> (index * 2)) % 70
    return 20 + variance
  })
  const peakDayIndex = dailyTrend.indexOf(Math.max(...dailyTrend))

  const rank = 1 + (seed % 5)

  return {
    totalSold,
    soldGrowthPercent,
    revenue,
    revenueGrowthPercent,
    dailyTrend,
    peakDayIndex,
    rank,
    category: product.category,
  }
}

type ProductSalesAnalyticsDrawerProps = {
  product: Product | null
  onClose: () => void
}

export default function ProductSalesAnalyticsDrawer({
  product,
  onClose,
}: ProductSalesAnalyticsDrawerProps) {
  const analytics = product ? getSalesAnalytics(product) : null
  const maxTrendValue = analytics ? Math.max(...analytics.dailyTrend) : 1

  return (
    <Drawer
      anchor="right"
      open={product !== null}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: '440px' } } }}
    >
      {product && analytics && (
        <div className="flex h-full w-full flex-col items-start bg-white">
          <div className="flex w-full items-start justify-between border-b border-[#eceef0] px-5 py-[18px]">
            <div className="flex flex-col items-start gap-0.5">
              <p className="text-base leading-[1.4] font-semibold text-[#20242d]">
                Analitik Penjualan
              </p>
              <p className="text-xs leading-[1.4] text-[#8f99a7]">
                {product.name} - 30 hari terakhir
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-[18px] shrink-0 items-center justify-center text-[#6a7789]"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div className="flex w-full flex-col items-start gap-[22px] p-5">
            <div className="flex w-full items-start gap-3">
              <div className="flex flex-1 min-w-0 flex-col items-start gap-1 rounded-[10px] bg-[#f6f7f9] px-3.5 py-3">
                <p className="text-xs text-[#a6a7ab]">Terjual</p>
                <p className="text-base font-semibold text-[#20242d]">{analytics.totalSold} unit</p>
                <p className="text-xs font-medium text-[#1fa971]">
                  {analytics.soldGrowthPercent >= 0 ? '+' : ''}
                  {analytics.soldGrowthPercent}% vs bulan lalu
                </p>
              </div>
              <div className="flex flex-1 min-w-0 flex-col items-start gap-1 rounded-[10px] bg-[#f6f7f9] px-3.5 py-3">
                <p className="text-xs text-[#a6a7ab]">Pendapatan</p>
                <p className="text-base font-semibold text-[#20242d]">
                  {formatCompactRupiah(analytics.revenue)}
                </p>
                <p className="text-xs font-medium text-[#1fa971]">
                  {analytics.revenueGrowthPercent >= 0 ? '+' : ''}
                  {analytics.revenueGrowthPercent}% vs bulan lalu
                </p>
              </div>
            </div>

            <p className="text-sm font-semibold whitespace-nowrap text-[#20242d]">
              Tren Penjualan Harian
            </p>

            <div className="flex h-[120px] w-full items-end gap-2 pt-2.5">
              {analytics.dailyTrend.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center justify-end gap-1.5">
                  <div
                    className={`w-5 rounded ${index === analytics.peakDayIndex ? 'bg-[#4e5bd6]' : 'bg-[#edeffb]'}`}
                    style={{ height: `${(value / maxTrendValue) * 100}px` }}
                  />
                  <p className="text-[11px] whitespace-nowrap text-[#8f99a7]">
                    {DAY_LABELS[index]}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex w-full items-center gap-2.5 rounded-[10px] bg-[#e9f6f1] px-3.5 py-3">
              <DynamicLucideIcon name="star" size={18} className="text-[#1fa971]" />
              <p className="flex-1 text-xs font-medium text-[#1fa971]">
                Produk terlaris ke-{analytics.rank} di kategori {analytics.category} bulan ini
              </p>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  )
}
