import Button from "@mui/material/Button";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateCabang } from "../../api/cabang";
import CabangForm from "../../components/cabang/CabangForm";
import DashboardLayout from "../../components/global/DashboardLayout";
import type { CabangFormValues } from "./types";

type ServerFieldError = {
  field: string;
  message: string;
};

type ServerErrorResponse = {
  message?: string;
  errors?: ServerFieldError[];
};

const fieldNameMap: Record<string, keyof CabangFormValues> = {
  name: "name",
  address: "alamat",
  phone: "telepon",
  email: "email",
  manager_name: "namaPengguna",
  active: "active",
};

const emptyValues: CabangFormValues = {
  name: "",
  alamat: "",
  telepon: "",
  email: "",
  username: "",
  namaPengguna: "",
  password: "",
  jamBuka: "",
  jamTutup: "",
  icon: "building-2",
  color: "#4e5bd6",
  active: true,
};

export default function CreateCabang() {
  const navigate = useNavigate();
  const { control, handleSubmit, setError } = useForm<CabangFormValues>({
    defaultValues: emptyValues,
    shouldUnregister: true,
  });
  const createCabangMutation = useCreateCabang();

  const handleMutationError = (error: unknown) => {
    if (!isAxiosError(error)) return;
    const data = error.response?.data as ServerErrorResponse | undefined;

    if (data?.errors?.length) {
      data.errors.forEach(({ field, message }) => {
        const formField = fieldNameMap[field];
        if (formField) setError(formField, { type: "server", message });
      });
      return;
    }

    if (data?.message) setError("name", { type: "server", message: data.message });
  };

  const submit = (values: CabangFormValues) => {
    createCabangMutation.mutate(
      {
        name: values.name,
        address: values.alamat,
        phone: values.telepon,
        email: values.email.trim() || null,
        manager_name: values.namaPengguna.trim() || null,
        icon: values.icon,
        color_icon: values.color,
        color_bg_icon: `${values.color}1a`,
        active: values.active,
      },
      {
        onSuccess: () =>
          navigate("/cabang", {
              state: {
                successMessage: "Cabang berhasil ditambahkan",
                description: "Cabang baru telah ditambahkan",
              },
          }),
        onError: handleMutationError,
      },
    );
  };

  return (
    <DashboardLayout pageTitle="Tambah Cabang">
      <form
        onSubmit={handleSubmit(submit)}
        className="flex w-full flex-col gap-4 px-5 pt-4 pb-4 sm:px-7 sm:pt-6"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold leading-[1.2] text-[#20242d]">
              Tambah Cabang
            </h1>
            <p className="text-[11px] leading-[1.4] text-[#6a7789]">
              Tambahkan cabang untuk mengatur operasional dan akses tim di lokasi baru.
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2">
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate("/cabang")}
              sx={{
                minWidth: "47px",
                height: "29px",
                fontSize: "11px",
                textTransform: "none",
                borderRadius: "6px",
                borderColor: "#4e5bd6",
                color: "#4e5bd6",
                fontWeight: 600,
                "&:hover": { borderColor: "#4e5bd6", backgroundColor: "#f7f8fc" },
              }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createCabangMutation.isPending}
              sx={{
                minWidth: "61px",
                height: "29px",
                fontSize: "11px",
                bgcolor: "#4e5bd6",
                color: "#fdfeff",
                textTransform: "none",
                borderRadius: "6px",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": { bgcolor: "#3f4bc0", boxShadow: "none" },
              }}
            >
              {createCabangMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>

        <CabangForm control={control} />
      </form>
    </DashboardLayout>
  );
}
