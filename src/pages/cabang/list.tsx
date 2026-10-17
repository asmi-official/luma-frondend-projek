import Button from "@mui/material/Button";
import { Building2, CircleCheck, CircleX, Store } from "lucide-react";
import PlusIcon from "../../icon/PlusIcon";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDeleteFlexParam,
  useFlexParams,
  type FlexParam,
} from "../../api/flexParams";
import emptyBranchesIllustration from "../../assets/empty-cabang.png";
import ConfirmDeleteModal from "../../components/global/ConfirmDeleteModal";
import CustomConfirmModal from "../../components/global/CustomConfirmModal";
import DashboardLayout from "../../components/global/DashboardLayout";
import EmptyState from "../../components/global/EmptyState";
import FilterDropdown from "../../components/global/FilterDropdown";
import DynamicLucideIcon from "../../icon/DynamicLucideIcon";
import { SummaryCard } from "../../components/cabang/SummaryCard";
import { BranchTable } from "../../components/cabang/BranchTable";
import { DUMMY_BRANCHES } from "./dummyData";

const CABANG_TYPE_PARAM = "BRANCH_OWNER";
const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Nonaktif" },
];

const SCOPE_OPTIONS = [
  { value: "active", label: "Cabang Aktif" },
  { value: "inactive", label: "Cabang Nonaktif" },
];

type StatusFilter = "all" | "active" | "inactive";

function getBranchCode(id: string) {
  return `CBG-${id.replaceAll("-", "").slice(-4).toUpperCase()}`;
}

export default function CabangList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [scope, setScope] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [hiddenDummyIds, setHiddenDummyIds] = useState<string[]>([]);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<FlexParam | null>(null);
  const [branchToToggleActive, setBranchToToggleActive] = useState<FlexParam | null>(null);

  const selectedStatus = scope === "all" ? status : scope;
  const filters = useMemo(() => {
    const values: Array<{
      key: "type_param" | "value_param" | "active";
      operator: "equal" | "like";
      value: string | boolean;
    }> = [{ key: "type_param", operator: "equal", value: CABANG_TYPE_PARAM }];

    if (search.trim())
      values.push({
        key: "value_param",
        operator: "like",
        value: search.trim(),
      });
    if (selectedStatus !== "all")
      values.push({
        key: "active",
        operator: "equal",
        value: selectedStatus === "active",
      });
    return values;
  }, [search, selectedStatus]);

  const { data, isLoading, isError } = useFlexParams({
    filter: filters,
    page,
    limit: PAGE_SIZE,
    sort: "created_at",
    order: "desc",
  });
  const { data: totalData, isLoading: isTotalLoading } = useFlexParams({
    filter: [
      { key: "type_param", operator: "equal", value: CABANG_TYPE_PARAM },
    ],
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

  const hasActiveFilters = search.trim() || selectedStatus !== "all";
  const remainingDummyBranches = useMemo(
    () =>
      DUMMY_BRANCHES.filter((branch) => !hiddenDummyIds.includes(branch.id)),
    [hiddenDummyIds],
  );
  const isUsingDummyData = !isTotalLoading && totalData?.meta.total === 0;
  const filteredDummyBranches = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return remainingDummyBranches.filter((branch) => {
      if (keyword && !branch.value_param.toLowerCase().includes(keyword))
        return false;
      if (selectedStatus === "active" && !branch.active) return false;
      if (selectedStatus === "inactive" && branch.active) return false;
      return true;
    });
  }, [remainingDummyBranches, search, selectedStatus]);
  const dummyTotalPages = Math.max(
    1,
    Math.ceil(filteredDummyBranches.length / PAGE_SIZE),
  );
  const dummyPage = Math.min(page, dummyTotalPages);
  const dummyPageBranches = filteredDummyBranches.slice(
    (dummyPage - 1) * PAGE_SIZE,
    dummyPage * PAGE_SIZE,
  );
  const dummyMeta = {
    page: dummyPage,
    limit: PAGE_SIZE,
    total: filteredDummyBranches.length,
    total_pages: dummyTotalPages,
  };
  const branches = isUsingDummyData ? dummyPageBranches : (data?.data ?? []);
  const meta = isUsingDummyData ? dummyMeta : data?.meta;
  const hasBranches = branches.length > 0;
  const totalBranches = isUsingDummyData
    ? remainingDummyBranches.length
    : (totalData?.meta.total ?? 0);
  const activeBranches = isUsingDummyData
    ? remainingDummyBranches.filter((branch) => branch.active).length
    : (activeData?.meta.total ?? 0);
  const inactiveBranches = isUsingDummyData
    ? remainingDummyBranches.filter((branch) => !branch.active).length
    : (inactiveData?.meta.total ?? 0);
  const isEmptyBranchList = isUsingDummyData
    ? remainingDummyBranches.length === 0
    : !isTotalLoading && totalData?.meta.total === 0;
  const isNoSearchResult =
    !isLoading && !isError && !hasBranches && !isEmptyBranchList;

  const handleConfirmToggleActive = () => {
    if (!branchToToggleActive) return;
    setBranchToToggleActive(null);
  };

  const handleConfirmDelete = () => {
    if (!branchToDelete) return;
    if (branchToDelete.id.startsWith("dummy-cabang-")) {
      setHiddenDummyIds((ids) => [...ids, branchToDelete.id]);
      setBranchToDelete(null);
      return;
    }
    deleteFlexParamMutation.mutate(branchToDelete.id, {
      onSuccess: () => setBranchToDelete(null),
    });
  };

  return (
    <DashboardLayout pageTitle="Cabang">
      <div className="flex w-full flex-col gap-4 px-5 pt-4 pb-6 sm:px-7 sm:pt-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold leading-[1.2] text-[#20242d]">
              Cabang
            </h1>
            <p className="text-sm leading-[1.4] text-[#6a7789]">
              Kelola cabang dan operasional bisnis Anda di satu tempat.
            </p>
          </div>

          <Button
            type="button"
            variant="contained"
            onClick={() => navigate("/cabang/create")}
            startIcon={<PlusIcon size={18} className="text-[#fdfeff]" />}
            sx={{
              height: "40px",
              bgcolor: "#4e5bd6",
              color: "#fdfeff",
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { bgcolor: "#3f4bc0", boxShadow: "none" },
            }}
          >
            Tambah Cabang
          </Button>
        </div>

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
                value="Rp 428,5jt"
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
                options={STATUS_OPTIONS}
                value={status === "all" ? null : status}
                onChange={(value) => {
                  setStatus((value ?? "all") as StatusFilter);
                  setPage(1);
                }}
              />

              <FilterDropdown
                allLabel="Semua Cabang"
                options={SCOPE_OPTIONS}
                value={scope === "all" ? null : scope}
                onChange={(value) => {
                  setScope((value ?? "all") as StatusFilter);
                  setPage(1);
                }}
              />
            </div>
          </>
        )}

        <div className="overflow-hidden rounded-lg border border-[#e9ecf1] bg-white">
          {isEmptyBranchList || isNoSearchResult ? (
            <EmptyState
              image={emptyBranchesIllustration}
              title={
                isNoSearchResult || hasActiveFilters
                  ? "Cabang tidak ditemukan"
                  : "Belum ada cabang"
              }
              description={
                isNoSearchResult || hasActiveFilters
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
              onToggleActiveBranch={(branch) => {
                setOpenMenuId(null);
                setBranchToToggleActive(branch);
              }}
              onDeleteBranch={(branch) => {
                setOpenMenuId(null);
                setBranchToDelete(branch);
              }}
              getBranchCode={getBranchCode}
            />
          )}
        </div>

        {meta && meta.total > 0 && (
          <div className="flex items-center justify-between gap-3 text-[8px] text-[#8f99a7]">
            <p>
              Menampilkan {Math.min((page - 1) * PAGE_SIZE + 1, meta.total)}–
              {Math.min(page * PAGE_SIZE, meta.total)} dari {meta.total} cabang
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded px-2 py-1 disabled:opacity-40"
              >
                Sebelumnya
              </button>
              {Array.from(
                { length: Math.min(meta.total_pages, 5) },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`size-5 rounded ${page === pageNumber ? "bg-[#eef0ff] font-semibold text-[#4e5bd6]" : "hover:bg-[#f5f6fa]"}`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                disabled={page === meta.total_pages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded px-2 py-1 disabled:opacity-40"
              >
                Berikutnya
              </button>
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

      <CustomConfirmModal
        open={Boolean(branchToToggleActive)}
        title={branchToToggleActive?.active ? "Nonaktifkan cabang ini?" : "Aktifkan cabang ini?"}
        description={
          <>
            <span className="font-medium">{branchToToggleActive?.value_param}</span>{" "}
            {branchToToggleActive?.active
              ? "akan dinonaktifkan dan tidak dapat digunakan untuk operasional. Data cabang tetap tersimpan."
              : "akan diaktifkan kembali untuk operasional."}
          </>
        }
        icon={<Building2 size={22} />}
        iconBgClassName="bg-[#fce9ea] text-[#d1293d]"
        confirmText={branchToToggleActive?.active ? "Ya, Nonaktifkan" : "Ya, Aktifkan"}
        confirmButtonClassName="bg-[#d1293d] hover:bg-[#b5222f] text-[#fdfeff]"
        onConfirm={handleConfirmToggleActive}
        onCancel={() => setBranchToToggleActive(null)}
      />
    </DashboardLayout>
  );
}
