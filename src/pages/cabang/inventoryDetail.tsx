import { ChevronLeft, PackageOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCabangDetail } from "../../api/cabang";
import DashboardLayout from "../../components/global/DashboardLayout";

export default function DetailInventory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cabangDetail, isLoading } = useCabangDetail(id);

  return (
    <DashboardLayout pageTitle="Status Inventory">
      <div className="flex w-full flex-col gap-6 px-6 pt-5 pb-12 sm:px-8 sm:pt-6">
        <button
          type="button"
          onClick={() => navigate(`/cabang/detail/${id ?? ""}`)}
          className="flex w-fit items-center gap-1.5 text-xs font-semibold text-[#4e5bd6] hover:underline"
        >
          <ChevronLeft size={16} />
          Kembali ke Detail Cabang
        </button>

        <section className="rounded-xl border border-[#eef0f4] bg-white px-6 py-12 text-center">
          <PackageOpen size={32} className="mx-auto text-[#4e5bd6]" />
          <h1 className="mt-4 text-lg font-semibold text-[#20242d]">
            Status Inventory {cabangDetail?.data.name ? `— ${cabangDetail.data.name}` : ""}
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#6a7789]">
            {isLoading
              ? "Memuat detail cabang..."
              : "Data inventory belum tersedia dari API. Tidak ada data contoh yang ditampilkan."}
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
