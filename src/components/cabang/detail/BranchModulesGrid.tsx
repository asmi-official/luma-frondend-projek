import { ShoppingBag, TrendingDown, Package } from "lucide-react";

export function BranchModulesGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Transaksi */}
      <div className="flex flex-col justify-between rounded-xl border border-[#eef0f4] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#eef0ff] text-[#4e5bd6]">
              <ShoppingBag size={16} />
            </span>
            <h3 className="text-sm font-semibold text-[#20242d]">Transaksi</h3>
          </div>
          <span className="text-xs font-medium text-[#4e5bd6]">Lihat Semua</span>
        </div>
        <div className="py-10 text-center text-xs text-[#8f99a7]">
          Belum ada data transaksi
        </div>
        <div />
      </div>

      {/* Pengeluaran */}
      <div className="flex flex-col justify-between rounded-xl border border-[#eef0f4] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#fce9ea] text-[#d1293d]">
              <TrendingDown size={16} />
            </span>
            <h3 className="text-sm font-semibold text-[#20242d]">Pengeluaran</h3>
          </div>
          <span className="text-xs font-medium text-[#4e5bd6]">Lihat Semua</span>
        </div>
        <div className="py-10 text-center text-xs text-[#8f99a7]">
          Belum ada data pengeluaran
        </div>
        <div />
      </div>

      {/* Status Inventory */}
      <div className="flex flex-col justify-between rounded-xl border border-[#eef0f4] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#fef6e7] text-[#f59e0b]">
              <Package size={16} />
            </span>
            <h3 className="text-sm font-semibold text-[#20242d]">Status Inventory</h3>
          </div>
          <span className="text-xs font-medium text-[#4e5bd6]">Lihat Semua</span>
        </div>
        <div className="py-10 text-center text-xs text-[#8f99a7]">
          Belum ada data inventory
        </div>
        <div />
      </div>
    </div>
  );
}
