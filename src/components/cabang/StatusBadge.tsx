export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-medium ${active ? "bg-[#e5f8ee] text-[#2fa673]" : "bg-[#f3f4f6] text-[#8f99a7]"}`}
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}
