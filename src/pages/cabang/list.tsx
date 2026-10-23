import { Building2, CircleCheck, CircleX, Store } from "lucide-react";
import { useState } from "react";
import { SuccessToast } from "../../components/global/SuccessToast";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useCabangs,
  useCabangFilterOptions,
  useDeleteCabang,
  useUpdateCabang,
  type Cabang,
} from "../../api/cabang";
import DashboardLayout from "../../components/global/DashboardLayout";
import { SummaryCard } from "../../components/cabang/SummaryCard";
import { BranchTable } from "../../components/cabang/BranchTable";
import ConfirmDeleteModal from "../../components/global/ConfirmDeleteModal";
import CustomConfirmModal from "../../components/global/CustomConfirmModal";
import { formatRupiahWithPrefix } from "../../utils/currency";
import EmptyState from "../../components/global/EmptyState";
import FilterDropdown from "../../components/global/FilterDropdown";
import PageHeader from "../../components/global/PageHeader";
import Pagination from "../../components/global/Pagination";
import DynamicLucideIcon from "../../icon/DynamicLucideIcon";
import emptyBranchesIllustration from "../../assets/empty-cabang.png";

const PAGE_SIZE = 10;

type StatusFilter = "all" | "active" | "inactive";

export default function CabangList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<Cabang | null>(null);
  const [branchToToggleActive, setBranchToToggleActive] =
    useState<Cabang | null>(null);
  const [toastInfo, setToastInfo] = useState<{
    message: string;
    description: string;
  } | null>(
    location.state?.successMessage
      ? {
          message: location.state.successMessage,
          description: location.state.description || "Aksi cabang berhasil dilakukan",
        }
      : null,
  );

  const { data: filterOptions } = useCabangFilterOptions();
  const { data, isLoading, isError } = useCabangs({
    search: search.trim() || undefined,
    filter:
      status === "all"
        ? []
        : [
            {
              key: "active",
              operator: "equal",
              value: status === "active",
            },
          ],
    sort: "created_at",
    order: "desc",
    page,
    limit: PAGE_SIZE,
  });

  const deleteCabangMutation = useDeleteCabang();
  const updateCabangMutation = useUpdateCabang();
  const branches = data?.data ?? [];
  const totalBranches = (data?.total_active ?? 0) + (data?.total_inactive ?? 0);
  const activeBranches = data?.total_active ?? 0;
  const inactiveBranches = data?.total_inactive ?? 0;
  const hasActiveFilters = Boolean(search.trim()) || status !== "all";
  const isEmptyBranchList =
    !isLoading && !isError && branches.length === 0 && !hasActiveFilters;
  const isNoSearchResult =
    !isLoading && !isError && branches.length === 0 && hasActiveFilters;

  const handleConfirmDelete = () => {
    if (!branchToDelete) return;

    deleteCabangMutation.mutate(branchToDelete.id, {
      onSuccess: () => {
        setToastInfo({
          message: "Cabang berhasil dihapus",
          description: "Data cabang telah berhasil dihapus dari sistem",
        });
        setBranchToDelete(null);
        if (branches.length === 1 && page > 1) setPage(page - 1);
      },
    });
  };

  const handleConfirmToggleActive = () => {
    if (!branchToToggleActive) return;
    const wasActive = branchToToggleActive.active;

    updateCabangMutation.mutate(
      { id: branchToToggleActive.id, active: !branchToToggleActive.active },
      {
        onSuccess: () => {
          setToastInfo({
            message: wasActive
              ? "Cabang berhasil dinonaktifkan"
              : "Cabang berhasil diaktifkan",
            description: wasActive
              ? "Status cabang telah diubah menjadi nonaktif"
              : "Status cabang telah diubah menjadi aktif",
          });
          setBranchToToggleActive(null);
        },
      },
    );
  };

  const meta = data?.meta;

  return (
    <DashboardLayout pageTitle="Cabang">
      <div className="flex w-full flex-col gap-4 px-5 pt-4 pb-6 sm:px-7 sm:pt-6">
        {toastInfo && (
          <SuccessToast
            message={toastInfo.message}
            description={toastInfo.description}
            onClose={() => {
              setToastInfo(null);
              window.history.replaceState({}, document.title);
            }}
          />
        )}

        <PageHeader
          title="Cabang"
          description="Kelola cabang dan operasional bisnis Anda di satu tempat."
          actionLabel="Tambah Cabang"
          onAction={() => navigate("/cabang/create")}
        />

        {!isEmptyBranchList && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Total Cabang"
                value={totalBranches}
                description="Tersebar di 8 kota"
                tone="blue"
                icon={<Building2 size={11} />}
              />
              <SummaryCard
                label="Cabang Aktif"
                value={activeBranches}
                description="87% dari seluruh cabang"
                tone="green"
                icon={<CircleCheck size={11} />}
              />
              <SummaryCard
                label="Cabang Nonaktif"
                value={inactiveBranches}
                description="Perlu ditinjau kembali"
                tone="orange"
                icon={<CircleX size={11} />}
              />
              <SummaryCard
                label="Penjualan Bulan Ini"
                value={formatRupiahWithPrefix(
                  branches.reduce((acc, b) => acc + (b.sales_total ?? 0), 0),
                )}
                description="+12% dari bulan lalu"
                tone="purple"
                icon={<Store size={11} />}
              />
            </div>

            <div className="flex w-full items-center gap-3">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e9e9ea] bg-white p-3">
                <DynamicLucideIcon
                  name="search"
                  size={18}
                  className="text-[#8f99a7]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari nama atau kode cabang..."
                  className="w-full text-sm text-[#20242d] placeholder:text-[#8f99a7] focus:outline-none"
                />
              </div>

              <FilterDropdown
                allLabel="Semua Status"
                options={filterOptions?.data.status_options ?? []}
                value={status === "all" ? null : status}
                onChange={(value) => {
                  setStatus((value ?? "all") as StatusFilter);
                  setPage(1);
                }}
              />
            </div>
          </>
        )}

        <div className="min-h-[320px] overflow-visible rounded-lg border border-[#e9ecf1] bg-white">
          {isEmptyBranchList || isNoSearchResult ? (
            <EmptyState
              image={emptyBranchesIllustration}
              title={
                isNoSearchResult ? "Cabang tidak ditemukan" : "Belum ada cabang"
              }
              description={
                isNoSearchResult
                  ? "Coba ubah kata kunci atau filter pencarian Anda."
                  : "Tambahkan cabang pertama untuk mulai mengatur tim dan operasional di setiap lokasi."
              }
            />
          ) : (
            <BranchTable
              isLoading={isLoading}
              isError={isError}
              branches={branches}
              openMenuId={openMenuId}
              onToggleMenu={(id) =>
                setOpenMenuId((current) => (current === id ? null : id))
              }
              onViewDetail={(id) => {
                setOpenMenuId(null);
                navigate(`/cabang/detail/${id}`);
              }}
              onEditBranch={(id) => {
                setOpenMenuId(null);
                navigate(`/cabang/update/${id}`);
              }}
              onToggleActiveBranch={(branch) => {
                setOpenMenuId(null);
                setBranchToToggleActive(branch);
              }}
              onDeleteBranch={(branch) => {
                setOpenMenuId(null);
                setBranchToDelete(branch);
              }}
            />
          )}
        </div>

        {meta && meta.total > 0 && (
          <Pagination
            page={meta.page}
            totalPages={meta.total_pages}
            onChange={setPage}
            rangeStart={Math.min((meta.page - 1) * PAGE_SIZE + 1, meta.total)}
            rangeEnd={Math.min(meta.page * PAGE_SIZE, meta.total)}
            totalItems={meta.total}
            itemLabel="cabang"
          />
        )}
      </div>

      <ConfirmDeleteModal
        open={Boolean(branchToDelete)}
        itemName={branchToDelete?.name ?? ""}
        entityLabel="cabang"
        isLoading={deleteCabangMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBranchToDelete(null)}
      />

      <CustomConfirmModal
        open={Boolean(branchToToggleActive)}
        title={
          branchToToggleActive?.active
            ? "Nonaktifkan cabang ini?"
            : "Aktifkan cabang ini?"
        }
        description={
          <>
            <span className="font-medium">{branchToToggleActive?.name}</span>{" "}
            {branchToToggleActive?.active
              ? "akan dinonaktifkan dan tidak dapat digunakan untuk operasional. Data cabang tetap tersimpan."
              : "akan diaktifkan kembali untuk operasional."}
          </>
        }
        icon={<Building2 size={22} />}
        iconBgClassName="bg-[#fce9ea] text-[#d1293d]"
        confirmText={
          branchToToggleActive?.active ? "Ya, Nonaktifkan" : "Ya, Aktifkan"
        }
        confirmButtonClassName="bg-[#d1293d] hover:bg-[#b5222f] text-[#fdfeff]"
        isLoading={updateCabangMutation.isPending}
        onConfirm={handleConfirmToggleActive}
        onCancel={() => setBranchToToggleActive(null)}
      />
    </DashboardLayout>
  );
}
