import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import CloseIcon from "../../icon/CloseIcon";
import DynamicLucideIcon from "../../icon/DynamicLucideIcon";
import { StatusBadge } from "../cabang/StatusBadge";
import { useNavigate } from "react-router-dom";
import type { Employee } from "../../api/karyawan";

type EmployeeDetailDrawerProps = {
  employee: Employee | null;
  onClose: () => void;
  onToggleActive: () => void;
  onEdit: (employee: Employee) => void;
};

const formatLastLogin = (lastLogin: string | null) =>
  lastLogin
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastLogin))
    : "Belum pernah login";

export default function EmployeeDetailDrawer({
  employee,
  onClose,
  onToggleActive,
  onEdit,
}: EmployeeDetailDrawerProps) {
  const navigate = useNavigate();
  return (
    <Drawer
      anchor="right"
      open={employee !== null}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: "420px" } } }}
    >
      {employee && (
        <div className="flex h-full w-full flex-col items-start bg-white">
          {/* Header */}
          <div className="flex w-full items-start justify-between border-b border-[#dadde1] px-5 py-[18px]">
            <p className="text-base leading-[1.4] font-semibold text-[#20242d]">
              Detail Karyawan
            </p>
            <button
              type="button"
              onClick={onClose}
              className="flex size-[18px] items-center justify-center text-[#6a7789]"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          {/* Konten */}
          <div className="flex w-full flex-1 flex-col items-start gap-5 overflow-y-auto p-5 text-xs leading-[1.4]">
            {/* Informasi Karyawan */}
            <div className="flex w-full flex-col gap-3">
              <p className="font-semibold text-[#20242d]">Informasi Karyawan</p>
              <div className="flex w-full flex-col gap-3">
                <div className="flex w-full flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">Nama Lengkap</p>
                  <p className="font-medium text-[#20242d]">{employee.name}</p>
                </div>
                <div className="flex w-full flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">Email</p>
                  <p className="font-medium text-[#20242d]">{employee.email}</p>
                </div>
                <div className="flex w-full flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">Nomor HP</p>
                  <p className="font-medium text-[#20242d]">{employee.phone}</p>
                </div>
                <div className="flex w-full flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">ID Karyawan</p>
                  <p className="font-medium text-[#20242d]">
                    {employee.employeeId}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">Cabang</p>
                  <p className="font-medium text-[#20242d]">
                    {employee.branch ?? "-"}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">Role</p>
                  <p className="font-medium text-[#20242d]">{employee.role}</p>
                </div>
              </div>
            </div>

            <div className="h-px w-full shrink-0 bg-[#E7E9ED]" />

            {/* Akses Luma */}
            <div className="flex w-full flex-col gap-3">
              <p className="font-semibold text-[#20242d]">Akses Luma</p>
              <div className="flex w-full flex-col gap-3">
                <div className="flex w-full flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">Status Akses</p>
                  <div>
                    <StatusBadge active={employee.active} />
                  </div>
                </div>
                <div className="flex w-full flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">Email Login</p>
                  <p className="font-medium text-[#20242d]">{employee.email}</p>
                </div>
                <div className="flex w-full flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">Terakhir Login</p>
                  <p className="font-medium text-[#20242d]">
                    {formatLastLogin(employee.lastLogin)}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">Role</p>
                  <p className="font-medium text-[#20242d]">{employee.role}</p>
                </div>
              </div>
            </div>

            <div className="h-px w-full shrink-0 bg-[#E7E9ED]" />

            {/* Aktivitas Terbaru */}
            <div className="flex w-full flex-col gap-3">
              <p className="font-semibold text-[#20242d]">Aktivitas Terbaru</p>
              <div className="flex w-full flex-col gap-3 text-xs">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">Hari ini, 14:21</p>
                  <p className="text-[#20242d]">
                    Memproses transaksi #TRX-1042
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">Hari ini, 13:54</p>
                  <p className="text-[#20242d]">Melakukan penyesuaian stok</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] text-[#8f99a7]">Hari ini, 08:42</p>
                  <p className="text-[#20242d]">Login ke Luma</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex w-full items-center gap-3 border-t border-[#E7E9ED] bg-[#fcfcff] px-5 py-4">
            <Button
              type="button"
              variant="outlined"
              onClick={onToggleActive}
              disabled={!employee.userId}
              sx={{
                flex: 1,
                height: "40px",
                borderColor: employee.active ? "#d1293d" : "#4e5bd6",
                color: employee.active ? "#d1293d" : "#4e5bd6",
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "13px",
                "&:hover": {
                  bgcolor: employee.active ? "#fef2f2" : "#f0f1fc",
                  borderColor: employee.active ? "#d1293d" : "#4e5bd6",
                },
              }}
            >
              {employee.userId ? (employee.active ? "Nonaktifkan" : "Aktifkan") : "Atur akses di halaman ubah"}
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              sx={{
                flex: 1,
                height: "40px",
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
              Ubah
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
