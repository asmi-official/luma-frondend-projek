import type { AccessLevel } from '../../../pages/data-master/role-management/types'

const styleByLevel: Record<AccessLevel, { bg: string; text: string; label: string }> = {
  Penuh: { bg: '#eef0ff', text: '#5965d8', label: 'Akses Penuh' },
  Tinggi: { bg: '#eaf8f2', text: '#20a878', label: 'Akses Tinggi' },
  Menengah: { bg: '#fff4e8', text: '#d88932', label: 'Akses Menengah' },
  Dasar: { bg: '#fff0f3', text: '#d85f70', label: 'Akses Dasar' },
}

type AccessLevelBadgeProps = {
  level: AccessLevel
}

export default function AccessLevelBadge({ level }: AccessLevelBadgeProps) {
  const style = styleByLevel[level]
  return (
    <span
      className="rounded-full px-2.5 py-1 text-xs font-medium leading-[1.4] whitespace-nowrap"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  )
}
