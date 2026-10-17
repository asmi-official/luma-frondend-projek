import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronDown, Search, Boxes, Gauge, Ban } from "lucide-react";

export type StockStatus = "Tersedia" | "Menipis" | "Habis";

export interface InventoryItem {
  name: string;
  category: string;
  stock: number;
  min: number;
  status: StockStatus;
}

const STATUS_OPTIONS = ["Semua Status", "Tersedia", "Menipis", "Habis"];
const CATEGORY_OPTIONS = [
  "Semua Kategori",
  "Bahan Baku",
  "Kemasan",
  "Perlengkapan",
];

const COLUMNS = [
  { label: "Produk", width: "24.7%" },
  { label: "Kategori", width: "17.4%" },
  { label: "Stok Tersisa", width: "16.5%" },
  { label: "Stok Minimum", width: "16.7%" },
  { label: "Status", width: "24.7%" },
];

const TOTAL_ITEMS = 50;
const PAGE_SIZE = 10;
const PAGES = [1, 2, 3, 4, 5, 6];

function StatCard({
  label,
  value,
  description,
  icon,
  toneClass,
  iconClass,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  toneClass: string;
  iconClass: string;
}) {
  return (
    <div
      className={`flex h-[167px] w-full min-w-0 flex-col gap-4 rounded-[16px] border border-[#eef0f4] border-l-4 p-5 ${toneClass}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full border ${iconClass}`}
        >
          {icon}
        </span>
        <p className="truncate text-sm font-medium text-[#7e8999]">{label}</p>
      </div>
      <p className="text-[28px] font-bold leading-8 text-[#20242d]">{value}</p>
      <p className="truncate text-[11px] leading-4 text-[#9aa5b5]">
        {description}
      </p>
    </div>
  );
}

function FilterSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 cursor-pointer appearance-none rounded-[10px] border border-[#e4e7ec] bg-white pl-4 pr-9 text-[13px] text-[#303641] outline-none focus:border-[#4e5bd6]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7e8999]"
      />
    </div>
  );
}

function StockBadge({ status }: { status: StockStatus }) {
  const style = {
    Tersedia: "border-[#bfe8d0] bg-[#e8f8ef] text-[#2f9c6a]",
    Menipis: "border-[#f5e6a8] bg-[#fffbe6] text-[#c9a227]",
    Habis: "border-[#ffd0d5] bg-[#fff0f1] text-[#d1293d]",
  }[status];
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full border px-3 text-[11px] font-medium ${style}`}
    >
      {status}
    </span>
  );
}

interface BranchInventoryContentProps {
  branchName: string;
  inventory: InventoryItem[];
  onBack: () => void;
}

export function BranchInventoryContent({
  branchName,
  inventory,
  onBack,
}: BranchInventoryContentProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [page, setPage] = useState(1);

  const items = useMemo(
    () =>
      inventory.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) &&
          (status === STATUS_OPTIONS[0] || i.status === status) &&
          (category === CATEGORY_OPTIONS[0] || i.category === category),
      ),
    [inventory, search, status, category],
  );

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, TOTAL_ITEMS);

  return (
    <div className="flex w-full flex-col gap-5 px-4 pb-10 pt-6 sm:px-8">
      {/* Back */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-medium text-[#303641] hover:text-[#4e5bd6]"
        >
          <ChevronLeft size={14} />
          Kembali ke Detail Cabang
        </button>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-8 text-[#20242d]">
          Status Inventory
        </h1>
        <p className="text-sm text-[#9aa5b5]">
          Stok dan inventori di {branchName}.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Produk"
          value={42}
          description="Tercatat di cabang ini"
          icon={<Boxes size={18} />}
          toneClass="border-l-[#cdd3ff] bg-[#fcfcff]"
          iconClass="border-[#d9deff] bg-[#eef0ff] text-[#6270dd]"
        />
        <StatCard
          label="Stok Menipis"
          value={4}
          description="Perlu restock segera"
          icon={<Gauge size={18} />}
          toneClass="border-l-[#9ee7c9] bg-[#fbfffd]"
          iconClass="border-[#c9ecdb] bg-[#e5f8ee] text-[#36b985]"
        />
        <StatCard
          label="Stok Habis"
          value={1}
          description="Tidak tersedia"
          icon={<Ban size={18} />}
          toneClass="border-l-[#e6d6c0] bg-[#fdfcfa]"
          iconClass="border-[#e6d3bd] bg-[#f3e8dc] text-[#a67c52]"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa5b5]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama produk..."
            className="h-11 w-full rounded-[10px] border border-[#e4e7ec] bg-white pl-10 pr-4 text-[13px] text-[#303641] outline-none placeholder:text-[#9aa5b5] focus:border-[#4e5bd6]"
          />
        </div>
        <FilterSelect
          value={status}
          options={STATUS_OPTIONS}
          onChange={setStatus}
        />
        <FilterSelect
          value={category}
          options={CATEGORY_OPTIONS}
          onChange={setCategory}
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden rounded-[12px] border border-[#eceef2] bg-white">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            {COLUMNS.map((col) => (
              <col key={col.label} style={{ width: col.width }} />
            ))}
          </colgroup>
          <thead className="bg-[#fbfbfc]">
            <tr className="border-b border-[#eceef2]">
              {COLUMNS.map((col) => (
                <th
                  key={col.label}
                  className="whitespace-nowrap px-4 py-3 text-xs font-medium leading-4 text-[#7e8999]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-[#8f99a7]"
                >
                  Produk tidak ditemukan.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr
                key={item.name}
                className="h-[58px] border-b border-[#f0f1f5] last:border-b-0 even:bg-[#fafbfc]"
              >
                <td className="truncate px-4 text-[13px] font-semibold text-[#20242d]">
                  {item.name}
                </td>
                <td className="truncate px-4 text-[13px] text-[#8f99a7]">
                  {item.category}
                </td>
                <td className="px-4 text-[13px] text-[#556070]">
                  {item.stock} unit
                </td>
                <td className="px-4 text-[13px] text-[#8f99a7]">
                  {item.min} unit
                </td>
                <td className="px-4">
                  <StockBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#7e8999]">
          Menampilkan {from}–{to} dari {TOTAL_ITEMS} transaksi
        </p>
        <div className="flex items-center gap-1.5 text-xs">
          {PAGES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`flex size-7 items-center justify-center rounded-md font-medium ${
                p === page
                  ? "bg-[#f0f1f5] text-[#556070]"
                  : "text-[#4e5bd6] hover:bg-[#f7f8fc]"
              }`}
            >
              {p}
            </button>
          ))}
          <span className="px-1 text-[#9aa5b5]">...</span>
          <button
            type="button"
            onClick={() =>
              setPage((p) => Math.min(p + 1, TOTAL_ITEMS / PAGE_SIZE))
            }
            className="flex h-7 items-center gap-1 rounded-md px-2 font-medium text-[#4e5bd6] hover:bg-[#f7f8fc]"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}
