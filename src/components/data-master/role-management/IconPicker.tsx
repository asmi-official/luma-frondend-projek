import { iconNames } from 'lucide-react/dynamic'
import { useMemo, useState } from 'react'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'

type IconPickerProps = {
  value: string
  onChange: (iconName: string) => void
  color: string
}

export default function IconPicker({ value, onChange, color }: IconPickerProps) {
  const [search, setSearch] = useState('')

  const filteredIcons = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return iconNames.slice(0, 120)
    return iconNames.filter((name) => name.includes(query)).slice(0, 120)
  }, [search])

  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-xs font-medium text-[#4d5057]">Pilih Ikon</label>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari ikon..."
        className="w-full rounded-xl border border-[#e9e9ea] p-3 text-sm text-[#20242d] placeholder:text-[#797c81] focus:border-[#4e5bd6] focus:outline-none"
      />

      <div className="grid max-h-[156px] grid-cols-8 gap-1.5 overflow-y-auto">
        {filteredIcons.map((name) => {
          const isActive = value === name
          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              className={`flex size-9 items-center justify-center rounded-[10px] border-2 ${
                isActive ? 'border-[#4e5bd6] bg-[#edeffb]' : 'border-transparent bg-[#f7f8fc]'
              }`}
              style={isActive ? { color } : undefined}
            >
              <DynamicLucideIcon name={name} size={16} className={isActive ? '' : 'text-[#6a7789]'} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
