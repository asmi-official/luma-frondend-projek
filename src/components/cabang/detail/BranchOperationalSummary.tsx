import { Store, ShoppingBag, TrendingDown, Package } from "lucide-react";
import { StatCard } from "../BranchDetailComponents";
import { formatRupiahWithPrefix } from "../../../utils/currency";
import type { Cabang } from "../../../api/cabang";

export function BranchOperationalSummary({ branch }: { branch: Cabang }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Penjualan Hari Ini"
        value={formatRupiahWithPrefix(branch.sales_total ?? 0)}
        description="0 transaksi"
        icon={<Store size={18} />}
        iconClass="bg-[#eef0ff] text-[#4e5bd6] border-[#cdd3ff]"
      />
      <StatCard
        label="Transaksi Hari Ini"
        value={String(branch.transaction_count ?? 0)}
        description="Rata-rata Rp 0"
        icon={<ShoppingBag size={18} />}
        iconClass="bg-[#eef0ff] text-[#4e5bd6] border-[#cdd3ff]"
      />
      <StatCard
        label="Pengeluaran Hari Ini"
        value={formatRupiahWithPrefix(branch.expense_total ?? 0)}
        description="0 pencatatan"
        icon={<TrendingDown size={18} />}
        iconClass="bg-[#fce9ea] text-[#d1293d] border-[#ffd1b7]"
      />
      <StatCard
        label="Stok Menipis"
        value="0 item"
        description="Perlu restock segera"
        icon={<Package size={18} />}
        iconClass="bg-[#fef6e7] text-[#f59e0b] border-[#fde68a]"
      />
    </div>
  );
}
