import type { ReactNode } from 'react'

type StatCardProps = {
  icon: ReactNode
  iconBg: string
  borderColor: string
  value: number
  label: string
}

export default function StatCard({ icon, iconBg, borderColor, value, label }: StatCardProps) {
  return (
    <div
      className="flex flex-1 items-center gap-3 rounded-2xl border-l-4 bg-white p-4"
      style={{ borderLeftColor: borderColor }}
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <div className="flex flex-col items-start">
        <p className="text-xl font-semibold leading-[1.4] text-[#20242d]">{value}</p>
        <p className="pt-0.5 text-xs leading-[1.4] text-[#8f99a7]">{label}</p>
      </div>
    </div>
  )
}
