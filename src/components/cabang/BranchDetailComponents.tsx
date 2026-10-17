import type { ReactNode } from "react";
import { StatusBadge } from "../../components/cabang/StatusBadge";
import { Building2, Phone } from "lucide-react";

const CARD =
  "rounded-xl border border-[#eef0f4] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]";

export function IconTile({
  children,
  className = "",
  size = "size-10",
}: {
  children: ReactNode;
  className?: string;
  size?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-[10px] border ${size} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  description,
  icon,
  iconClass,
}: {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  iconClass: string;
}) {
  return (
    <div className={`${CARD} flex min-w-0 flex-col gap-4 p-5`}>
      <div className="flex items-center gap-3">
        <IconTile className={iconClass}>{icon}</IconTile>
        <p className="truncate text-sm font-medium text-[#7e8999]">{label}</p>
      </div>
      <p className="text-[28px] font-bold leading-8 text-[#20242d]">{value}</p>
      <p className="truncate text-xs leading-4 text-[#9aa5b5]">{description}</p>
    </div>
  );
}

export function ListCard({
  title,
  icon,
  iconClass,
  onViewAll,
  children,
}: {
  title: string;
  icon: ReactNode;
  iconClass: string;
  onViewAll?: () => void;
  children: ReactNode;
}) {
  return (
    <div className={`${CARD} flex flex-col p-5`}>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconTile size="size-8" className={`rounded-lg ${iconClass}`}>
            {icon}
          </IconTile>
          <h3 className="text-sm font-semibold text-[#20242d]">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-medium text-[#4e5bd6] hover:underline"
        >
          Lihat Semua
        </button>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export interface BranchHeaderProps {
  name: string;
  code: string;
  address: string;
  phone: string;
  manager: string;
  active: boolean;
}

export function BranchHeader({
  name,
  code,
  address,
  phone,
  manager,
  active,
}: BranchHeaderProps) {
  return (
    <div className={`${CARD} flex flex-col gap-5 p-6`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4e5bd6]">
            <Building2 size={28} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-[#20242d]">{name}</h1>
              <span className="rounded-md bg-[#f2f3f7] px-2 py-0.5 text-xs font-semibold text-[#556070]">
                {code}
              </span>
              <StatusBadge active={active} />
            </div>
            <div className="flex items-center gap-5 text-xs text-[#7e8999] flex-wrap">
              <span className="flex items-center gap-1.5">
                <Building2 size={13} /> {address}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={13} /> {phone}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#f0f1f5] pt-4 text-xs">
        <p className="text-[#7e8999]">
          Dikelola oleh <strong className="text-[#20242d] font-semibold">{manager}</strong>
        </p>
      </div>
    </div>
  );
}
