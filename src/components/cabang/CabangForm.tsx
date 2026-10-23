import { Clock3 } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import DateTimeInput from "../global/DateTimeInput";
import CustomForm, { type CustomFormOption, type CustomFormSection } from "../global/CustomForm";
import type { CabangFormValues } from "../../pages/cabang/types";

type CabangFormProps = {
  control: Control<CabangFormValues>;
  options?: {
    showBranchCode?: boolean;
    showManagerAccess?: boolean;
    managerRole?: string;
  };
};

const timeOptions: CustomFormOption[] = [];

function createSections(control: Control<CabangFormValues>, options?: CabangFormProps["options"]): CustomFormSection<CabangFormValues>[] {
  const showBranchCode = options?.showBranchCode ?? true;
  const showManagerAccess = options?.showManagerAccess ?? true;
  const managerRole = options?.managerRole ?? "Manager";

  const informationFields: CustomFormSection<CabangFormValues>["fields"] = [
    {
      id: "name",
      kind: "text",
      name: "name",
      label: "Nama Cabang",
      required: true,
      placeholder: "Masukkan nama cabang",
      rules: { required: "Nama cabang wajib diisi" },
    },
    ...(showBranchCode ? [{
      id: "code",
      kind: "static" as const,
      label: "Kode Cabang",
      value: "",
      placeholder: "Kode cabang dibuat otomatis oleh sistem",
      disabled: true,
    }] : []),
    {
      id: "address",
      kind: "text",
      name: "alamat",
      label: "Alamat",
      required: true,
      placeholder: "Masukkan alamat cabang",
      rules: { required: "Alamat wajib diisi" },
    },
    {
      id: "phone",
      kind: "text",
      name: "telepon",
      label: "Nomor Telepon / WhatsApp",
      required: true,
      placeholder: "08xxxxxxxxxx",
      rules: { required: "Nomor telepon wajib diisi" },
    },
    {
      id: "opening-time",
      kind: "render",
      name: "jamBuka" as any,
      render: (values) => (
        <Controller
          control={control}
          name="jamBuka"
          rules={{ required: "Jam buka wajib diisi" }}
          render={({ field, fieldState }) => (
            <div className="flex w-full flex-col gap-1.5">
              <label className="flex items-center gap-[3px] text-[11px] font-medium text-[#20242d]">
                Jam Operasional (Buka) <span className="text-[11px] text-[#a72131]">*</span>
              </label>
              <DateTimeInput
                type="time"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Pilih jam operasional (buka)"
                hasError={!!fieldState.error}
              />
              {fieldState.error && <p className="text-[10px] text-[#d32f2f]">{fieldState.error.message}</p>}
            </div>
          )}
        />
      ),
    },
    {
      id: "closing-time",
      kind: "render",
      name: "jamTutup" as any,
      render: (values) => (
        <Controller
          control={control}
          name="jamTutup"
          rules={{ required: "Jam tutup wajib diisi" }}
          render={({ field, fieldState }) => (
            <div className="flex w-full flex-col gap-1.5">
              <label className="flex items-center gap-[3px] text-[11px] font-medium text-[#20242d]">
                Jam Operasional (Tutup) <span className="text-[11px] text-[#a72131]">*</span>
              </label>
              <DateTimeInput
                type="time"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Pilih jam operasional (tutup)"
                hasError={!!fieldState.error}
              />
              {fieldState.error && <p className="text-[10px] text-[#d32f2f]">{fieldState.error.message}</p>}
            </div>
          )}
        />
      ),
    },
  ];

  const sections: CustomFormSection<CabangFormValues>[] = [
    { id: "information", title: "Informasi Cabang", columns: 2, fields: informationFields },
  ];

  if (showManagerAccess) {
    sections.push({
      id: "access",
      title: "Akses Cabang",
      description: "Atur yang bertanggung jawab mengelola cabang ini.",
      columns: 2,
      divider: true,
      fields: [
        { id: "manager-access", kind: "switch", name: "active", switchLabel: "Aktifkan akun pengelola", fullWidth: true },
        {
          id: "username",
          kind: "text",
          name: "username",
          label: "Username",
          required: true,
          placeholder: "Masukkan username",
          visible: (values) => values.active,
          rules: { required: "Username wajib diisi" },
        },
        {
          id: "user-name",
          kind: "text",
          name: "namaPengguna",
          label: "Nama Pengguna",
          required: true,
          placeholder: "Masukkan nama pengguna",
          visible: (values) => values.active,
          rules: { required: "Nama pengguna wajib diisi" },
        },
        {
          id: "email",
          kind: "email",
          name: "email",
          label: "Email",
          required: true,
          placeholder: "nama@email.com",
          visible: (values) => values.active,
          rules: { required: "Email wajib diisi", pattern: { value: /^\S+@\S+\.\S+$/, message: "Format email tidak valid" } },
        },
        {
          id: "password",
          kind: "password",
          name: "password",
          label: "Password",
          required: true,
          placeholder: "Masukkan password",
          visible: (values) => values.active,
          rules: { required: "Password wajib diisi" },
        },
        {
          id: "role",
          kind: "static",
          label: "Role",
          required: true,
          value: managerRole,
          visible: (values) => values.active,
        },
        {
          id: "branch",
          kind: "static",
          label: "Cabang",
          value: (values) => values.name,
          placeholder: "Mengikuti nama cabang",
          disabled: true,
          helperText: "Otomatis mengikuti cabang yang sedang dibuat.",
          visible: (values) => values.active,
        },
      ],
    });
  }

  return sections;
}

export default function CabangForm({ control, options }: CabangFormProps) {
  return <CustomForm control={control} sections={createSections(control, options)} />;
}
