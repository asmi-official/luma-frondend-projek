import { Package } from "lucide-react";

export interface InventoryItem {
  name: string;
  stock: string;
  status: string;
  tone: string;
}

interface BranchInventoryListProps {
  branchCode: string;
  items: InventoryItem[];
}

export function BranchInventoryList({
  branchCode,
  items,
}: BranchInventoryListProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold text-[#20242d]">
          Status Inventory — {branchCode}
        </h1>
        <p className="text-xs text-[#7e8999]">
          Daftar seluruh stok barang dan inventory di cabang ini.
        </p>
      </div>

      <div className="rounded-xl border border-[#eef0f4] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between border-b border-[#f0f1f5] pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[#eef0ff] text-[#4e5bd6]">
                  <Package size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#20242d]">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#8f99a7]">Tersisa {item.stock}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
