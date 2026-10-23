import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import CloseIcon from "../../icon/CloseIcon";
import WandSparklesIcon from "../../icon/WandSparklesIcon";
import DynamicLucideIcon from "../../icon/DynamicLucideIcon";
import { Eye, EyeOff } from "lucide-react";
import type { Employee } from "../../api/karyawan";

type ResetPasswordModalProps = {
  employee: Employee | null;
  onClose: () => void;
  onSuccess: (password: string) => void;
  isLoading?: boolean;
};

export default function ResetPasswordModal({
  employee,
  onClose,
  onSuccess,
  isLoading = false,
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (employee) return;
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  }, [employee]);

  if (!employee) return null;

  const handleSubmit = () => {
    if (newPassword.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }
    setError(null);
    onSuccess(newPassword);
  };

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
      <div className="flex w-full flex-col items-start gap-5 p-6">
        <div className="flex w-full items-start justify-between">
          <div className="flex items-center gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4e5bd6]">
              <WandSparklesIcon size={22} className="text-[#4e5bd6]" />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-base font-semibold text-[#20242d]">
                Reset Password
              </p>
              <p className="text-xs text-[#8f99a7]">
                Atur ulang password pengguna dengan mudah dan aman
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

        {error && <p className="-mt-2 text-xs text-[#d1293d]">{error}</p>}

        <p className="text-xs leading-[1.5] text-[#6a7789]">
          Atur password baru untuk akun <span className="font-semibold text-[#20242d]">{employee.name}</span>. Password lama tidak bisa digunakan setelah ini.
        </p>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-1.5">
            <label className="flex items-center gap-1 text-xs font-medium text-[#20242d]">
              Password Baru <span className="text-[#d1293d]">*</span>
            </label>
            <TextField
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password baru"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: "13px",
                  "& fieldset": { borderColor: "#e9e9ea" },
                  "&:hover fieldset": { borderColor: "#c7c9ce" },
                  "&.Mui-focused fieldset": { borderColor: "#4e5bd6" },
                },
                "& .MuiOutlinedInput-input": { padding: "12px 14px" },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <DynamicLucideIcon name="lock" size={16} className="text-[#8f99a7]" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNew((prev) => !prev)}
                        edge="end"
                        size="small"
                        sx={{ color: "#8f99a7" }}
                      >
                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <span className="text-[11px] text-[#8f99a7]">Minimal 8 karakter</span>
          </div>

          <div className="flex w-full flex-col gap-1.5">
            <label className="flex items-center gap-1 text-xs font-medium text-[#20242d]">
              Konfirmasi Password <span className="text-[#d1293d]">*</span>
            </label>
            <TextField
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: "13px",
                  "& fieldset": { borderColor: "#e9e9ea" },
                  "&:hover fieldset": { borderColor: "#c7c9ce" },
                  "&.Mui-focused fieldset": { borderColor: "#4e5bd6" },
                },
                "& .MuiOutlinedInput-input": { padding: "12px 14px" },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <DynamicLucideIcon name="lock" size={16} className="text-[#8f99a7]" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirm((prev) => !prev)}
                        edge="end"
                        size="small"
                        sx={{ color: "#8f99a7" }}
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outlined"
            onClick={onClose}
            disabled={isLoading}
            sx={{
              flex: 1,
              height: "44px",
              borderColor: "#4e5bd6",
              color: "#4e5bd6",
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "14px",
              "&:hover": { bgcolor: "#f0f1fc", borderColor: "#4e5bd6" },
            }}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{
              flex: 1,
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
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
