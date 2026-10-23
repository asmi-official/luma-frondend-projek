import Button from "@mui/material/Button";
import type { ReactNode } from "react";
import PlusIcon from "../../icon/PlusIcon";

type PageHeaderProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
  children?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
  actionIcon = <PlusIcon size={18} className="text-[#fdfeff]" />,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1 min-w-0">
        <h1 className="text-xl sm:text-2xl font-semibold leading-[1.2] text-[#20242d] truncate">
          {title}
        </h1>
        <p className="text-xs sm:text-sm leading-[1.4] text-[#6a7789]">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        {children}
        {actionLabel && onAction && (
          <Button
            type="button"
            variant="contained"
            onClick={onAction}
            startIcon={actionIcon}
            sx={{
              height: "40px",
              bgcolor: "#4e5bd6",
              color: "#fdfeff",
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { bgcolor: "#3f4bc0", boxShadow: "none" },
            }}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
