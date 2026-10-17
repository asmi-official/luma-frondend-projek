import Button from "@mui/material/Button";
import { Building2, ChevronDown, CircleCheck, CircleX, MoreVertical, Plus, Search, Store } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteFlexParam, useFlexParams, type FlexParam } from "../../api/flexParams";
import emptyBranchesIllustration from "../../assets/empty-branches.svg";
import ConfirmDeleteModal from "../../components/global/ConfirmDeleteModal";
import DashboardLayout from "../../components/global/DashboardLayout";
import EmptyState from "../../components/global/EmptyState";

const CABANG_TYPE_PARAM = "BRANCH_OWNER";
const PAGE_SIZE = 10;

type StatusFilter = "all" | "active" | "inactive";

function getBranchCode(id: string) {
  return `CBG-${id.replaceAll("-", "").slice(-4).toUpperCase()}`;
}

function SummaryCard({
  label,
  value,
  description,
  tone,
  icon,
}: {
  label: string;
  value: string | number;
  description: string;
  tone: "blue" | "green" | "orange" | "purple";
  icon: React.ReactNode;
}) {
  const toneStyle = {
    blue: "border-l-[#cdd3ff] bg-[#fcfcff] text-[#6270dd]",
    green: "border-l-[#9ee7c9] bg-[#fbfffd] text-[#36b985]",
    orange: "border-l-[#ffd1b7] bg-[#fffdfc] text-[#ef9362]",
    purple: "border-l-[#e2caff] bg-[#fefcff] text-[#aa75e8]",
  }[tone];

  return (
    <div className={`min-w-0 rounded-lg border border-[#eef0f4] border-l-2 px-3 py-2.5 ${toneStyle}`}>
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-md bg-current/10">{icon}</span>
        <p className="truncate text-[9px] font-medium text-[#7e8999]">{label}</p>
      </div>
      <p className="mt-2 text-[19px] font-semibold leading-none text-[#20242d]">{value}</p>
      <p className="mt-2 truncate text-[8px] text-[#9aa5b5]">{description}</p>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-medium ${active ? "bg-[#e5f8ee] text-[#2fa673]" : "bg-[#f3f4f6] text-[#8f99a7]"}`}
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }, (_, index) => (
        <tr key={index} className="border-b border-[#f0f1f5]">
          {Array.from({ length: 7 }, (_, cellIndex) => (
            <td key={cellIndex} className="px-3 py-3">
              <div className="h-2.5 animate-pulse rounded bg-[#f0f2f6]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function CabangList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [scope, setScope] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<FlexParam | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const selectedStatus = scope === "all" ? status : scope;
  const filters = useMemo(() => {
    const values: Array<{ key: "type_param" | "value_param" | "active"; operator: "equal" | "like"; value: string | boolean }> = [
      { key: "type_param", operator: "equal", value: CABANG_TYPE_PARAM },
    ];

    if (search.trim()) values.push({ key: "value_param", operator: "like", value: search.trim() });
    if (selectedStatus !== "all") values.push({ key: "active", operator: "equal", value: selectedStatus === "active" });
    return values;
  }, [search, selectedStatus]);

  const { data, isLoading, isError } = useFlexParams({ filter: filters, page, limit: PAGE_SIZE, sort: "created_at", order: "desc" });
  const { data: totalData, isLoading: isTotalLoading } = useFlexParams({
    filter: [{ key: "type_param", operator: "equal", value: CABANG_TYPE_PARAM }],
    page: 1,
    limit: 1,
  });
  const { data: activeData } = useFlexParams({
    filter: [
      { key: "type_param", operator: "equal", value: CABANG_TYPE_PARAM },
      { key: "active", operator: "equal", value: true },
    ],
    page: 1,
    limit: 1,
  });
  const { data: inactiveData } = useFlexParams({
    filter: [
      { key: "type_param", operator: "equal", value: CABANG_TYPE_PARAM },
      { key: "active", operator: "equal", value: false },
    ],
    page: 1,
    limit: 1,
  });

  const deleteFlexParamMutation = useDeleteFlexParam();

  const branches = data?.data ?? [];
  const meta = data?.meta;
  const hasBranches = branches.length > 0;
  const hasActiveFilters = search.trim() || selectedStatus !== "all";
  const isEmptyBranchList = !isTotalLoading && totalData?.meta.total === 0;
  const isNoSearchResult = !isLoading && !isError && !hasBranches && !isEmptyBranchList;

  const changeStatus = (value: StatusFilter) => {
    setStatus(value);
    setScope("all");
    setPage(1);
  };

  const changeScope = (value: StatusFilter) => {
    setScope(value);
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!branchToDelete) return;
    deleteFlexParamMutation.mutate(branchToDelete.id, {
      onSuccess: () => setBranchToDelete(null),
    });
  };

  return (
    <DashboardLayout pageTitle="Cabang">
      <div className="flex w-full flex-col gap-4 px-5 pt-4 pb-6 sm:px-7 sm:pt-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold leading-[1.2] text-[#20242d]">Cabang</h1>
            <p className="text-[11px] leading-[1.4] text-[#6a7789]">Kelola cabang dan operasional bisnis Anda di satu tempat.</p>
          </div>

          <Button
            type="button"
            variant="contained"
            onClick={() => navigate("/cabang/create")}
            startIcon={<Plus size={14} />}
            sx={{
              height: "29px", fontSize: "11px", bgcolor: "#4e5bd6", color: "#fdfeff", textTransform: "none",
              borderRadius: "6px", fontWeight: 600, boxShadow: "none", "&:hover": { bgcolor: "#3f4bc0", boxShadow: "none" },
            }}
          >
            Tambah Cabang
          </Button>
        </div>

        {!isEmptyBranchList && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Total Cabang" value={totalData?.meta.total ?? 0} description="Terdaftar di sistem" tone="blue" icon={<Building2 size={11} />} />
              <SummaryCard label="Cabang Aktif" value={activeData?.meta.total ?? 0} description="Siap digunakan" tone="green" icon={<CircleCheck size={11} />} />
              <SummaryCard label="Cabang Nonaktif" value={inactiveData?.meta.total ?? 0} description="Perlu ditinjau kembali" tone="orange" icon={<CircleX size={11} />} />
              <SummaryCard label="Penjualan Bulan Ini" value="Rp 0" description="Data penjualan belum tersedia" tone="purple" icon={<Store size={11} />} />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative flex min-w-0 flex-1 items-center">
                <Search size={13} className="pointer-events-none absolute left-3 text-[#9aa5b5]" />
                <input
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                  placeholder="Cari nama atau kode cabang..."
                  className="h-8 w-full rounded-md border border-[#e6e9ef] bg-white pl-8 pr-3 text-[10px] text-[#20242d] outline-none placeholder:text-[#9aa5b5] focus:border-[#4e5bd6]"
                />
              </label>
              <label className="relative">
                <select
                  value={status}
                  onChange={(event) => changeStatus(event.target.value as StatusFilter)}
                  className="h-8 min-w-[108px] appearance-none rounded-md border border-[#e6e9ef] bg-white px-3 pr-7 text-[10px] text-[#657083] outline-none focus:border-[#4e5bd6]"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-2 top-2.5 text-[#8f99a7]" />
              </label>
              <label className="relative">
                <select
                  value={scope}
                  onChange={(event) => changeScope(event.target.value as StatusFilter)}
                  className="h-8 min-w-[110px] appearance-none rounded-md border border-[#e6e9ef] bg-white px-3 pr-7 text-[10px] text-[#657083] outline-none focus:border-[#4e5bd6]"
                >
                  <option value="all">Semua Cabang</option>
                  <option value="active">Cabang Aktif</option>
                  <option value="inactive">Cabang Nonaktif</option>
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-2 top-2.5 text-[#8f99a7]" />
              </label>
            </div>
          </>
        )}

        <div className="overflow-hidden rounded-lg border border-[#e9ecf1] bg-white">
          {isEmptyBranchList || isNoSearchResult ? (
            <EmptyState
              image={emptyBranchesIllustration}
              title={isNoSearchResult || hasActiveFilters ? "Cabang tidak ditemukan" : "Belum ada cabang"}
              description={isNoSearchResult || hasActiveFilters ? "Coba ubah kata kunci atau filter pencarian Anda." : "Tambahkan cabang pertama untuk mulai mengatur tim dan operasional di setiap lokasi."}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full border-collapse text-left">
                <thead className="bg-[#fbfbfc]">
                  <tr className="border-b border-[#eceef2]">
                    {['Cabang', 'Penanggung Jawab', 'Penjualan', 'Transaksi', 'Pengeluaran', 'Status', 'Aksi'].map((header) => (
                      <th key={header} className="whitespace-nowrap px-3 py-2.5 text-[8px] font-medium text-[#7e8999]">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading && <LoadingRows />}
                  {isError && (
                    <tr><td colSpan={7} className="px-3 py-12 text-center text-xs text-[#8f99a7]">Data cabang gagal dimuat. Silakan coba lagi.</td></tr>
                  )}
                  {!isLoading && !isError && branches.map((branch: FlexParam) => (
                    <tr key={branch.id} className="border-b border-[#f0f1f5] last:border-b-0 hover:bg-[#fcfcff]">
                      <td className="px-3 py-2.5">
                        <p className="text-[9px] font-semibold text-[#303641]">{branch.value_param}</p>
                        <p className="mt-0.5 text-[7px] text-[#9aa5b5]">{getBranchCode(branch.id)}</p>
                      </td>
                      <td className="px-3 py-2.5 text-[8px] text-[#556070]">—</td>
                      <td className="px-3 py-2.5 text-[8px] text-[#556070]">—</td>
                      <td className="px-3 py-2.5 text-[8px] text-[#556070]">—</td>
                      <td className="px-3 py-2.5 text-[8px] text-[#556070]">—</td>
                      <td className="px-3 py-2.5"><StatusBadge active={branch.active} /></td>
                      <td className="px-3 py-2.5 relative">
                        <div className="inline-block" ref={openMenuId === branch.id ? menuRef : null}>
                          <button
                            type="button"
                            aria-label={`Aksi untuk ${branch.value_param}`}
                            onClick={() => setOpenMenuId((current) => (current === branch.id ? null : branch.id))}
                            className="rounded p-1 text-[#8791a0] hover:bg-[#f2f3f7]"
                          >
                            <MoreVertical size={13} />
                          </button>

                          {openMenuId === branch.id && (
                            <div className="absolute right-0 top-8 z-20 flex w-40 flex-col overflow-hidden rounded-lg border border-[#f0f1f5] bg-white py-1 shadow-lg text-[10px]">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  navigate(`/cabang/update/${branch.id}`);
                                }}
                                className="px-3 py-2 text-left font-medium text-[#20242d] hover:bg-[#f7f8fc]"
                              >
                                Ubah Cabang
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setBranchToDelete(branch);
                                }}
                                className="px-3 py-2 text-left font-medium text-[#d1293d] hover:bg-[#fef2f2]"
                              >
                                Hapus Cabang
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {meta && meta.total > 0 && (
          <div className="flex items-center justify-between gap-3 text-[8px] text-[#8f99a7]">
            <p>Menampilkan {Math.min((page - 1) * PAGE_SIZE + 1, meta.total)}–{Math.min(page * PAGE_SIZE, meta.total)} dari {meta.total} cabang</p>
            <div className="flex items-center gap-1">
              <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded px-2 py-1 disabled:opacity-40">Sebelumnya</button>
              {Array.from({ length: Math.min(meta.total_pages, 5) }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`size-5 rounded ${page === pageNumber ? "bg-[#eef0ff] font-semibold text-[#4e5bd6]" : "hover:bg-[#f5f6fa]"}`}
                >
                  {pageNumber}
                </button>
              ))}
              <button type="button" disabled={page === meta.total_pages} onClick={() => setPage((current) => current + 1)} className="rounded px-2 py-1 disabled:opacity-40">Berikutnya</button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={Boolean(branchToDelete)}
        itemName={branchToDelete?.value_param ?? ""}
        isLoading={deleteFlexParamMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBranchToDelete(null)}
      />
    </DashboardLayout>
  );
}
