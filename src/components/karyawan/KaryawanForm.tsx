import type { Control } from "react-hook-form";
import CustomForm, { type CustomFormSection } from "../global/CustomForm";
import type { KaryawanFormValues } from "../../pages/karyawan/types";

type KaryawanFormProps = {
  control: Control<KaryawanFormValues>;
  branchOptions?: Array<{ label: string; value: string }>;
  roleOptions?: Array<{ label: string; value: string }>;
  isUpdate?: boolean;
};

function createSections(
  branchOptions: Array<{ label: string; value: string }> = [],
  roleOptions: Array<{ label: string; value: string }> = [
    { label: "Manager", value: "Manager" },
    { label: "Kasir", value: "Kasir" },
  ],
  isUpdate: boolean = false
): CustomFormSection<KaryawanFormValues>[] {
  const informationFields: CustomFormSection<KaryawanFormValues>["fields"] = [
    {
      id: "name",
      kind: "text",
      name: "namaLengkap",
      label: "Nama Lengkap",
      required: true,
      placeholder: "Masukkan nama lengkap",
      rules: { required: "Nama lengkap wajib diisi" },
    },
    {
      id: "email",
      kind: "email",
      name: "email",
      label: "Email",
      required: true,
      placeholder: "nama@email.com",
      rules: {
        required: "Email wajib diisi",
        pattern: { value: /^\S+@\S+\.\S+$/, message: "Format email tidak valid" },
      },
    },
    {
      id: "phone",
      kind: "text",
      name: "nomorHp",
      label: "Nomor HP",
      required: true,
      placeholder: "08xxxxxxxxxx",
      rules: { required: "Nomor HP wajib diisi" },
    },
    {
      id: "employee-id",
      kind: isUpdate ? "text" : "static",
      name: isUpdate ? "idKaryawan" : undefined,
      label: "ID Karyawan",
      value: isUpdate ? undefined : "",
      placeholder: isUpdate ? "Masukkan ID karyawan" : "ID karyawan dibuat otomatis oleh sistem",
      disabled: isUpdate ? false : true,
      rules: isUpdate ? { required: "ID Karyawan wajib diisi" } : undefined,
    } as any,
    {
      id: "branch",
      kind: "select",
      name: "cabangId",
      label: "Cabang",
      required: true,
      placeholder: "Pilih cabang",
      options: branchOptions,
      rules: { required: "Cabang wajib diisi" },
    },
    {
      id: "role",
      kind: "select",
      name: "role",
      label: "Role",
      required: true,
      placeholder: "Pilih role karyawan",
      options: roleOptions,
      rules: { required: "Role wajib diisi" },
    },
  ];

  return [
    {
      id: "information",
      title: "Informasi Karyawan",
      columns: 2,
      fields: informationFields,
    },
    {
      id: "access",
      title: "Akses Luma",
      description: "Atur apakah karyawan dapat masuk dan menggunakan Luma.",
      columns: 1,
      divider: true,
      fields: [
        {
          id: "login-access",
          kind: "switch",
          name: "loginAccess",
          switchLabel: "Aktifkan akses login",
          fullWidth: true,
        },
        {
          id: "username",
          kind: "text",
          name: "username",
          label: "Username",
          required: !isUpdate,
          placeholder: isUpdate ? "Kosongkan jika tidak diubah" : "Masukkan username",
          fullWidth: true,
          visible: (values) => values.loginAccess,
          helperText: isUpdate ? "Kosongkan untuk mempertahankan username saat ini." : undefined,
          rules: isUpdate ? undefined : { required: "Username wajib diisi" },
        },
        {
          id: "email-login",
          kind: "static",
          label: "Email Login",
          value: (values) => values.email || "",
          placeholder: "budi@gmail.com",
          disabled: true,
          fullWidth: true,
          helperText: "Email login akan mengikuti email karyawan diatas.",
          visible: (values) => values.loginAccess,
        },
        {
          id: "password",
          kind: "password",
          name: "password",
          label: "Password",
          required: !isUpdate,
          placeholder: isUpdate ? "Kosongkan jika tidak diubah" : "Masukkan password",
          fullWidth: true,
          visible: (values) => values.loginAccess,
          helperText: isUpdate ? "Kosongkan untuk mempertahankan password saat ini." : undefined,
          rules: isUpdate ? undefined : { required: "Password wajib diisi" },
        },
      ],
    },
  ];
}

export default function KaryawanForm({
  control,
  branchOptions = [],
  roleOptions,
  isUpdate = false,
}: KaryawanFormProps) {
  return (
    <CustomForm
      control={control}
      sections={createSections(branchOptions, roleOptions, isUpdate)}
    />
  );
}
