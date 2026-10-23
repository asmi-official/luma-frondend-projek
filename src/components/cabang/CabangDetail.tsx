import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCabangDetail } from "../../api/cabang";
import { BranchHeader } from "../../components/cabang/BranchDetailComponents";
import DashboardLayout from "../../components/global/DashboardLayout";
import { BranchOperationalSummary } from "../../components/cabang/detail/BranchOperationalSummary";
import { BranchFinancialActivity } from "../../components/cabang/detail/BranchFinancialActivity";
import { BranchModulesGrid } from "../../components/cabang/detail/BranchModulesGrid";
import { BranchUsersSection } from "../../components/cabang/detail/BranchUsersSection";

export default function DetailCabang() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cabangDetail, isLoading, isError } = useCabangDetail(id);
  const branch = cabangDetail?.data;

  return (
    <DashboardLayout pageTitle="Detail Cabang">
      <div className="flex w-full flex-col gap-6 px-6 pt-5 pb-12 sm:px-8 sm:pt-6">
        <button
          type="button"
          onClick={() => navigate("/cabang")}
          className="flex w-fit items-center gap-1.5 text-xs font-semibold text-[#4e5bd6] hover:underline"
        >
          <ChevronLeft size={16} />
          Kembali ke List Cabang
        </button>

        {isLoading && (
          <div className="rounded-xl border border-[#eef0f4] bg-white px-6 py-12 text-center text-sm text-[#8f99a7]">
            Memuat detail cabang...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-[#f8d7da] bg-[#fffafa] px-6 py-12 text-center text-sm text-[#d1293d]">
            Detail cabang gagal dimuat. Silakan coba lagi.
          </div>
        )}

        {branch && (
          <>
            <BranchHeader
              name={branch.name}
              code={branch.code}
              address={branch.address ?? "Alamat belum diatur"}
              phone={branch.phone ?? "-"}
              manager={branch.manager_name ?? branch.created_by ?? "-"}
              active={branch.active}
            />

            <BranchOperationalSummary branch={branch} />

            <BranchFinancialActivity />

            <BranchModulesGrid />

            {/* Aktivitas Terbaru */}
            <section className="flex flex-col gap-4 rounded-xl border border-[#eef0f4] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
              <h2 className="text-base font-semibold text-[#20242d]">
                Aktivitas Terbaru
              </h2>
              <div className="py-8 text-center text-xs text-[#8f99a7]">
                Belum ada aktivitas tercatat
              </div>
            </section>

            <BranchUsersSection branch={branch} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
