import Dialog from "@mui/material/Dialog";
import type { ReactNode } from "react";

interface CustomConfirmModalProps {
  open: boolean;
  title: string;
  description: ReactNode;
  icon?: ReactNode;
  iconBgClassName?: string;
  cancelText?: string;
  confirmText?: string;
  confirmButtonClassName?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CustomConfirmModal({
  open,
  title,
  description,
  icon,
  iconBgClassName = "bg-[#fce9ea] text-[#d1293d]",
  cancelText = "Batal",
  confirmText = "Ya, Hapus",
  cancelButtonClassName = "border-[#d1293d] text-[#d1293d] hover:bg-[#fef2f2]",
  confirmButtonClassName = "bg-[#d1293d] hover:bg-[#b5222f] text-[#fdfeff]",
  isLoading = false,
  onConfirm,
  onCancel,
}: CustomConfirmModalProps & { cancelButtonClassName?: string }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            width: "420px",
            maxWidth: "420px",
            padding: "8px",
          },
        },
      }}
    >
      <div className="flex w-full flex-col items-start gap-5 p-6">
        {icon && (
          <span className={`flex size-12 items-center justify-center rounded-full ${iconBgClassName}`}>
            {icon}
          </span>
        )}

        <div className="flex w-full flex-col items-start gap-2">
          <p className="text-base font-semibold leading-[1.4] text-[#20242d]">
            {title}
          </p>
          <div className="text-xs leading-[1.4] text-[#797c81]">
            {description}
          </div>
        </div>

        <div className="flex w-full items-start gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`h-10 flex-1 rounded-xl border text-sm font-semibold disabled:opacity-70 ${cancelButtonClassName}`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`h-10 flex-1 rounded-xl text-sm font-semibold shadow-sm disabled:opacity-70 ${confirmButtonClassName}`}
          >
            {isLoading ? "Memproses..." : confirmText}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
