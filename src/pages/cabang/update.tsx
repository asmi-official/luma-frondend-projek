import Button from "@mui/material/Button";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useFlexParams, useUpdateFlexParam } from "../../api/flexParams";
import CabangForm from "../../components/cabang/CabangForm";
import DashboardLayout from "../../components/global/DashboardLayout";
import type { CabangFormValues } from "./types";

const CABANG_TYPE_PARAM = "BRANCH_OWNER";

type ServerFieldError = {
  field: string;
  message: string;
};

type ServerErrorResponse = {
  message?: string;
  errors?: ServerFieldError[];
};

const fieldNameMap: Record<string, keyof CabangFormValues> = {
  value_param: "name",
  alamat: "alamat",
  telepon: "telepon",
  email: "email",
  icon: "icon",
  color_icon: "color",
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
  active: false,
};

export default function UpdateCabang() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { control, handleSubmit, reset, setError } = useForm<CabangFormValues>({
    defaultValues: emptyValues,
    shouldUnregister: true,
  });

  const { data, isLoading: isFetching } = useFlexParams({
    filter: [{ key: "type_param", operator: "equal", value: CABANG_TYPE_PARAM }],
    page: 1,
    limit: 100,
  });

  const updateFlexParamMutation = useUpdateFlexParam();

  useEffect(() => {
    if (!id || !data?.data) return;
    const branch = data.data.find((item) => item.id === id);
    if (branch) {
      reset({
        name: branch.value_param ?? "",
        alamat: branch.description ?? "",
        telepon: "",
        email: "",
        username: "",
        namaPengguna: "",
        password: "",
        jamBuka: "",
        jamTutup: "",
        icon: branch.icon ?? "building-2",
        color: branch.color_icon ?? "#4e5bd6",
        active: branch.active,
      });
    }
  }, [id, data, reset]);

  const handleMutationError = (error: unknown) => {
    if (!isAxiosError(error)) return;
    const resData = error.response?.data as ServerErrorResponse | undefined;

    if (resData?.errors?.length) {
      resData.errors.forEach(({ field, message }) => {
        const formField = fieldNameMap[field];
        if (formField) setError(formField, { type: "server", message });
      });
      return;
    }

    if (resData?.message) setError("name", { type: "server", message: resData.message });
  };

  const submit = (values: CabangFormValues) => {
    if (!id) return;
    updateFlexParamMutation.mutate(
      {
        id,
        value_param: values.name,
        description: values.alamat,
        icon: values.icon,
        color_icon: values.color,
        color_bg_icon: `${values.color}1a`,
        active: values.active,
      },
      { onSuccess: () => navigate("/cabang"), onError: handleMutationError },
    );
  };

  return (
    <DashboardLayout pageTitle="Ubah Cabang">
      <form
        onSubmit={handleSubmit(submit)}
        className="flex w-full flex-col gap-4 px-5 pt-4 pb-4 sm:px-7 sm:pt-6"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold leading-[1.2] text-[#20242d]">Ubah Cabang</h1>
            <p className="text-[11px] leading-[1.4] text-[#6a7789]">
              Perbarui detail cabang untuk mengatur operasional dan akses tim.
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
              disabled={updateFlexParamMutation.isPending || isFetching}
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
              {updateFlexParamMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>

        <CabangForm control={control} />
      </form>
    </DashboardLayout>
  );
}
