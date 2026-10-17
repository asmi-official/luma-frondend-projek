import { useEffect, useRef } from "react";
import { MoreVertical, Eye, Ban, Trash2 } from "lucide-react";
import type { FlexParam } from "../../api/flexParams";

interface BranchActionMenuProps {
  branch: FlexParam;
  isOpen: boolean;
  onToggle: () => void;
  onViewDetail?: () => void;
  onToggleActive?: () => void;
  onDelete: () => void;
}

export function BranchActionMenu({
  branch,
  isOpen,
  onToggle,
  onViewDetail,
  onToggleActive,
  onDelete,
}: BranchActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="inline-block" ref={isOpen ? menuRef : null}>
      <button
        type="button"
        aria-label={`Aksi untuk ${branch.value_param}`}
        onClick={onToggle}
        className="rounded p-1 text-[#8791a0] hover:bg-[#f2f3f7]"
      >
        <MoreVertical size={13} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-20 flex w-40 flex-col overflow-hidden rounded-xl border border-[#f0f1f5] bg-white py-1.5 shadow-lg text-[11px]">
          <button
            type="button"
            onClick={onViewDetail}
            className="flex items-center gap-2.5 px-3.5 py-2 text-left font-medium text-[#556070] hover:bg-[#f7f8fc]"
          >
            <Eye size={14} className="text-[#8f99a7]" />
            Lihat Detail
          </button>
          <button
            type="button"
            onClick={onToggleActive}
            className="flex items-center gap-2.5 px-3.5 py-2 text-left font-medium text-[#556070] hover:bg-[#f7f8fc]"
          >
            <Ban size={14} className="text-[#8f99a7]" />
            {branch.active ? "Nonaktifkan" : "Aktifkan"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-2.5 px-3.5 py-2 text-left font-medium text-[#d1293d] hover:bg-[#fef2f2]"
          >
            <Trash2 size={14} className="text-[#d1293d]" />
            Hapus Cabang
          </button>
        </div>
      )}
    </div>
  );
}
