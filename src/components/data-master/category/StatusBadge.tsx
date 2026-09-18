type StatusBadgeProps = {
  active: boolean
}

export default function StatusBadge({ active }: StatusBadgeProps) {
  const style = active
    ? { bg: '#e7f4ec', border: '#c8e9d4', text: '#149042', label: 'Aktif' }
    : { bg: '#f6f7f8', border: '#e5e8eb', text: '#8f99a7', label: 'Nonaktif' }

  return (
    <span
      className="rounded-xl border px-3 py-1 text-xs font-medium leading-[1.4] whitespace-nowrap"
      style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
    >
      {style.label}
    </span>
  )
}
