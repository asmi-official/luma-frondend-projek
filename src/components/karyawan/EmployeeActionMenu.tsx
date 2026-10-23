import ShieldIcon from "../../icon/ShieldIcon";
import ActionMenu, { type ActionMenuItem } from "../global/ActionMenu";
import type { Employee } from "../../api/karyawan";
import DynamicLucideIcon from "../../icon/DynamicLucideIcon";

type EmployeeActionMenuProps = {
  employee: Employee;
  isOpen: boolean;
  onToggle: () => void;
  onViewDetail: () => void;
  onManageAccess: () => void;
  onDelete: () => void;
};

export function EmployeeActionMenu({
  employee,
  isOpen,
  onToggle,
  onViewDetail,
  onManageAccess,
  onDelete,
}: EmployeeActionMenuProps) {
  const items: ActionMenuItem[] = [
    {
      label: "Lihat Detail",
      icon: <DynamicLucideIcon name="eye" size={14} className="text-[#8f99a7]" />,
      onClick: onViewDetail,
    },
    {
      label: "Kelola Akses",
      icon: <ShieldIcon size={14} className="text-[#8f99a7]" />,
      onClick: onManageAccess,
    },
    {
      label: "Hapus Karyawan",
      icon: <DynamicLucideIcon name="trash-2" size={14} className="text-[#d1293d]" />,
      onClick: onDelete,
      destructive: true,
    },
  ];

  return (
    <ActionMenu
      isOpen={isOpen}
      onToggle={onToggle}
      items={items}
      ariaLabel={`Aksi untuk ${employee.name}`}
    />
  );
}
