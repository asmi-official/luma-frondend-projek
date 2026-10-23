import Button from "@mui/material/Button";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useCabangs } from "../../api/cabang";
import { useKaryawanDetail, useUpdateKaryawan } from "../../api/karyawan";
import DashboardLayout from "../../components/global/DashboardLayout";
import { FormSection } from "../../components/global/FormSection";
import KaryawanForm from "../../components/karyawan/KaryawanForm";
import type { KaryawanFormValues } from "./types";

export default function KaryawanUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { control, handleSubmit, reset } = useForm<KaryawanFormValues>({
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
  const { data: employeeDetail } = useKaryawanDetail(id);
  const { data: cabangsData } = useCabangs({
    sort: "name",
    order: "asc",
    limit: 100,
  });
  const updateKaryawanMutation = useUpdateKaryawan();
  const branchOptions = (cabangsData?.data ?? [])
    .filter((cabang) => cabang.active)
    .map((cabang) => ({ label: cabang.name, value: cabang.id }));

  useEffect(() => {
    const employee = employeeDetail?.data;
    if (!employee) return;

    reset({
      namaLengkap: employee.namaLengkap,
      email: employee.email,
      nomorHp: employee.nomorHp,
      idKaryawan: employee.idKaryawan,
      cabangId: employee.cabangId,
      role: employee.role,
      loginAccess: employee.loginAccess,
      username: "",
      password: "",
    });
  }, [employeeDetail, reset]);

  const onSubmit = (values: KaryawanFormValues) => {
    if (!id) return;

    updateKaryawanMutation.mutate(
      {
        id,
        namaLengkap: values.namaLengkap,
        email: values.email,
        nomorHp: values.nomorHp,
        idKaryawan: values.idKaryawan,
        cabangId: values.cabangId,
        role: values.role,
        loginAccess: values.loginAccess,
        ...(values.username?.trim() && { username: values.username.trim() }),
        ...(values.password && { password: values.password }),
      },
      {
        onSuccess: () => {
          navigate("/karyawan", {
            state: {
              successMessage: "Karyawan berhasil diubah",
              description: "Perubahan karyawan telah disimpan",
            },
          });
        },
      },
    );
  };

  return (
    <DashboardLayout pageTitle="Ubah Karyawan">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6 px-5 pt-4 pb-10 sm:px-7 sm:pt-6"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl font-semibold leading-[1.2] text-[#20242d]">
              Ubah Karyawan
            </h1>
            <p className="text-xs sm:text-sm leading-[1.4] text-[#6a7789]">
              Perbarui informasi dan akses karyawan.
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
              disabled={updateKaryawanMutation.isPending || !employeeDetail}
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
              {updateKaryawanMutation.isPending ? "Menyimpan..." : "Ubah"}
            </Button>
          </div>
        </div>

        <FormSection className="w-full">
          <KaryawanForm
            control={control}
            branchOptions={branchOptions}
            isUpdate={true}
          />
        </FormSection>
      </form>
    </DashboardLayout>
  );
}
