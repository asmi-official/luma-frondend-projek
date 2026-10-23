import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { formatRupiahWithPrefix } from "../../../utils/currency";

export function BranchFinancialActivity() {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-[#eef0f4] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-[#20242d]">
          Aktivitas Keuangan
        </h2>
        <p className="text-xs text-[#7e8999]">
          Ringkasan arus kas cabang ini bulan berjalan.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-xl border border-[#eef0f4] bg-[#fafafa] p-4">
          <div className="flex items-center gap-2 text-[#36b985]">
            <ArrowUpRight size={16} />
            <span className="text-xs font-medium text-[#7e8999]">Pemasukan</span>
          </div>
          <p className="text-xl font-bold text-[#20242d]">
            {formatRupiahWithPrefix(0)}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-[#eef0f4] bg-[#fafafa] p-4">
          <div className="flex items-center gap-2 text-[#d1293d]">
            <ArrowDownRight size={16} />
            <span className="text-xs font-medium text-[#7e8999]">Pengeluaran</span>
          </div>
          <p className="text-xl font-bold text-[#20242d]">
            {formatRupiahWithPrefix(0)}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-[#eef0f4] bg-[#fafafa] p-4">
          <div className="flex items-center gap-2 text-[#4e5bd6]">
            <Wallet size={16} />
            <span className="text-xs font-medium text-[#7e8999]">Arus Bersih</span>
          </div>
          <p className="text-xl font-bold text-[#20242d]">
            {formatRupiahWithPrefix(0)}
          </p>
        </div>
      </div>
    </section>
  );
}
