import type { ReactNode } from 'react'

type AccentSummaryCardProps = {
  label: string
  value: string
  /** Small text shown next to the value, e.g. "Produk" */
  unit?: string
  description: string
  /** Colour of the card's left accent border */
  accentColor: string
  /** Background of the icon tile */
  iconBg: string
  icon: ReactNode
}

export default function AccentSummaryCard({
  label,
  value,
  unit,
  description,
  accentColor,
  iconBg,
  icon,
}: AccentSummaryCardProps) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl border-l-4 bg-white p-4"
      style={{ borderLeftColor: accentColor }}
    >
      <div className="flex w-full items-center justify-between">
        <p className="text-sm leading-[1.4] font-medium whitespace-nowrap text-[#6a7789]">{label}</p>
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </span>
      </div>

      <div className="flex w-full flex-col gap-1">
        <p className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="text-2xl leading-[1.2] font-semibold text-[#20242d]">{value}</span>
          {unit && <span className="text-sm leading-[1.4] font-medium text-[#8f99a7]">{unit}</span>}
        </p>
        <p className="text-xs leading-[1.4] whitespace-nowrap text-[#8f99a7]">{description}</p>
      </div>
    </div>
  )
}
