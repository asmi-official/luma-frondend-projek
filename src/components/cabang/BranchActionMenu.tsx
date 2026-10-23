import type { Cabang } from "../../api/cabang";
import ActionMenu, { type ActionMenuItem } from "../global/ActionMenu";
import { Eye, Ban, Pencil, Trash2 } from "lucide-react";

interface BranchActionMenuProps {
  branch: Cabang;
  isOpen: boolean;
  onToggle: () => void;
  onViewDetail: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

export function BranchActionMenu({
  branch,
  isOpen,
  onToggle,
  onViewDetail,
  onEdit,
  onToggleActive,
  onDelete,
}: BranchActionMenuProps) {
  const items: ActionMenuItem[] = [
    {
      label: "Lihat Detail",
      icon: <Eye size={14} className="text-[#8f99a7]" />,
      onClick: onViewDetail,
    },
    {
      label: branch.active ? "Nonaktifkan" : "Aktifkan",
      icon: <Ban size={14} className="text-[#8f99a7]" />,
      onClick: onToggleActive,
    },
    {
      label: "Hapus Cabang",
      icon: <Trash2 size={14} className="text-[#d1293d]" />,
      onClick: onDelete,
      destructive: true,
    },
  ];

  return (
    <ActionMenu
      isOpen={isOpen}
      onToggle={onToggle}
      items={items}
      ariaLabel={`Aksi untuk ${branch.name}`}
    />
  );
}
