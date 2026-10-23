import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/global/DashboardLayout";
import { FormSection } from "../../components/global/FormSection";
import KaryawanForm from "../../components/karyawan/KaryawanForm";
import { useCabangs } from "../../api/cabang";
import { useCreateKaryawan } from "../../api/karyawan";
import type { KaryawanFormValues } from "./types";

export default function KaryawanCreate() {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<KaryawanFormValues>({
    defaultValues: {
      namaLengkap: "",
      email: "",
      nomorHp: "",
      idKaryawan: "",
      cabangId: "",
      role: "",
      loginAccess: false,
      username: "",
      password: "",
    },
  });
  const { data: cabangsData } = useCabangs({
    sort: "name",
    order: "asc",
    limit: 100,
  });
  const createKaryawanMutation = useCreateKaryawan();
  const branchOptions = (cabangsData?.data ?? [])
    .filter((cabang) => cabang.active)
    .map((cabang) => ({ label: cabang.name, value: cabang.id }));

  const onSubmit = (values: KaryawanFormValues) => {
    createKaryawanMutation.mutate(
      {
        namaLengkap: values.namaLengkap,
        email: values.email,
        nomorHp: values.nomorHp,
        idKaryawan: values.idKaryawan.trim() || undefined,
        cabangId: values.cabangId,
        role: values.role,
        loginAccess: values.loginAccess,
        ...(values.loginAccess && {
          username: values.username?.trim() || undefined,
          password: values.password || undefined,
        }),
      },
      {
        onSuccess: () => {
          navigate("/karyawan", {
            state: { successMessage: "Karyawan berhasil ditambahkan" },
          });
        },
      },
    );
  };

  return (
    <DashboardLayout pageTitle="Tambah Karyawan">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6 px-5 pt-4 pb-10 sm:px-7 sm:pt-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl font-semibold leading-[1.2] text-[#20242d]">
              Tambah Karyawan
            </h1>
            <p className="text-xs sm:text-sm leading-[1.4] text-[#6a7789]">
              Tambahkan karyawan dan atur akses mereka ke Luma.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate("/karyawan")}
              sx={{
                height: "36px",
                borderColor: "#e6e9ef",
                color: "#20242d",
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "13px",
                "&:hover": { borderColor: "#c7cdd8", bgcolor: "#f8fafc" },
              }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createKaryawanMutation.isPending}
              sx={{
                height: "36px",
                bgcolor: "#4e5bd6",
                color: "#fdfeff",
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "13px",
                boxShadow: "none",
                "&:hover": { bgcolor: "#3f4bc0", boxShadow: "none" },
              }}
            >
              {createKaryawanMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>

        <FormSection className="w-full">
          <KaryawanForm control={control} branchOptions={branchOptions} />
        </FormSection>
      </form>
    </DashboardLayout>
  );
}
