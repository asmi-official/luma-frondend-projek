import { Clock3 } from "lucide-react";
import type { Control } from "react-hook-form";
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

const timeOptions: CustomFormOption[] = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  const minute = index % 2 === 0 ? "00" : "30";
  const value = `${hour}:${minute}`;
  return { label: value, value };
});

function createSections(options?: CabangFormProps["options"]): CustomFormSection<CabangFormValues>[] {
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
      kind: "select",
      name: "jamBuka",
      label: "Jam Operasional (Buka)",
      required: true,
      placeholder: "Pilih jam operasional (buka)",
      options: timeOptions,
      selectIcon: Clock3,
      rules: { required: "Jam buka wajib diisi" },
    },
    {
      id: "closing-time",
      kind: "select",
      name: "jamTutup",
      label: "Jam Operasional (Tutup)",
      required: true,
      placeholder: "Pilih jam operasional (tutup)",
      options: timeOptions,
      selectIcon: Clock3,
      rules: { required: "Jam tutup wajib diisi" },
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
  return <CustomForm control={control} sections={createSections(options)} />;
}
