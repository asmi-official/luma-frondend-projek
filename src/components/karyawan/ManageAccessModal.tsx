import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import CloseIcon from "../../icon/CloseIcon";
import FolderCogIcon from "../../icon/FolderCogIcon";
import type { Employee } from "../../api/karyawan";

type ManageAccessModalProps = {
  employee: Employee | null;
  onClose: () => void;
  onResetPassword: () => void;
};

const formatLastLogin = (lastLogin: string | null) =>
  lastLogin
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastLogin))
    : "Belum pernah login";

export default function ManageAccessModal({
  employee,
  onClose,
  onResetPassword,
}: ManageAccessModalProps) {
  if (!employee) return null;

  return (
    <Dialog
      open={employee !== null}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            width: "560px",
            maxWidth: "560px",
            padding: "8px",
          },
        },
      }}
    >
      <div className="flex w-full flex-col items-start gap-6 p-6">
        <div className="flex w-full items-start justify-between">
          <div className="flex items-center gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4e5bd6]">
              <FolderCogIcon size={22} className="text-[#4e5bd6]" />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-base font-semibold text-[#20242d]">
                Kelola Akses Luma
              </p>
              <p className="text-xs text-[#8f99a7]">
                Atur dan kelola hak akses pengguna di Luma
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg text-[#8f99a7] hover:bg-[#f0f1f5] hover:text-[#20242d]"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="flex w-full flex-col divide-y divide-[#eceef0]">
          <div className="flex items-center justify-between py-3.5 text-xs">
            <span className="text-[#8f99a7]">Nama Karyawan</span>
            <span className="font-semibold text-[#20242d]">{employee.name}</span>
          </div>
          <div className="flex items-center justify-between py-3.5 text-xs">
            <span className="text-[#8f99a7]">Role</span>
            <span className="font-semibold text-[#20242d]">{employee.role}</span>
          </div>
          <div className="flex items-center justify-between py-3.5 text-xs">
            <span className="text-[#8f99a7]">ID Karyawan</span>
            <span className="font-semibold text-[#20242d]">{employee.employeeId}</span>
          </div>
          <div className="flex items-center justify-between py-3.5 text-xs">
            <span className="text-[#8f99a7]">Email Login</span>
            <span className="font-semibold text-[#20242d]">{employee.email}</span>
          </div>
          <div className="flex items-center justify-between py-3.5 text-xs">
            <span className="text-[#8f99a7]">Terakhir Login</span>
            <span className="font-semibold text-[#20242d]">{formatLastLogin(employee.lastLogin)}</span>
          </div>
        </div>

        <div className="flex w-full pt-2">
          <Button
            type="button"
            variant="contained"
            onClick={onResetPassword}
            disabled={!employee.userId}
            fullWidth
            sx={{
              height: "44px",
              bgcolor: "#4e5bd6",
              color: "#fdfeff",
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow: "none",
              "&:hover": { bgcolor: "#3f4bc0", boxShadow: "none" },
            }}
          >
            {employee.userId ? "Reset Password" : "Akses login belum dibuat"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
