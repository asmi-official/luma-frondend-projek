import { useEffect, useRef, type ReactNode } from "react";
import { MoreVertical } from "lucide-react";

export type ActionMenuItem = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  destructive?: boolean;
};

type ActionMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  items: ActionMenuItem[];
  ariaLabel?: string;
};

export default function ActionMenu({
  isOpen,
  onToggle,
  items,
  ariaLabel = "Menu Aksi",
}: ActionMenuProps) {
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
    <div className="relative inline-block" ref={isOpen ? menuRef : null}>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onToggle}
        className="rounded p-1 text-[#8791a0] hover:bg-[#f2f3f7]"
      >
        <MoreVertical size={13} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-50 flex w-44 flex-col overflow-hidden rounded-xl border border-[#f0f1f5] bg-white py-1.5 shadow-lg text-[11px]">
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onToggle();
                item.onClick();
              }}
              className={`flex items-center gap-2.5 px-3.5 py-2 text-left font-medium ${
                item.destructive
                  ? "text-[#d1293d] hover:bg-[#fef2f2]"
                  : "text-[#556070] hover:bg-[#f7f8fc]"
              }`}
            >
              <span className={item.destructive ? "text-[#d1293d]" : "text-[#8f99a7]"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
