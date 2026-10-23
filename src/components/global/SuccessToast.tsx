import DynamicLucideIcon from "../../icon/DynamicLucideIcon";
import { useEffect } from "react";

type SuccessToastProps = {
  message: string;
  description?: string;
  onClose: () => void;
};

export function SuccessToast({
  message,
  description = "Karyawan baru telah ditambahkan",
  onClose,
}: SuccessToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="absolute right-7 top-6 z-50 flex w-[360px] min-h-[57px] items-start justify-between rounded-xl border border-[#d3dcf3] bg-white p-4 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
      <div className="flex items-start gap-3 pr-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E9F6F1] text-[#19875A]">
          <DynamicLucideIcon name="check" size={16} />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold text-[#20242D]">{message}</p>
          <p className="text-xs text-[#8F99A7] leading-relaxed">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-[#8f99a7] hover:text-[#20242d] shrink-0"
      >
        <DynamicLucideIcon name="x" size={16} />
      </button>
    </div>
  );
}
