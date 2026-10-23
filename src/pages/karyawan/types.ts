/** Nilai form tambah dan ubah karyawan, sesuai payload API /karyawan. */
export type KaryawanFormValues = {
  namaLengkap: string;
  email: string;
  nomorHp: string;
  idKaryawan: string;
  cabangId: string;
  role: string;
  loginAccess: boolean;
  username?: string;
  password?: string;
};
