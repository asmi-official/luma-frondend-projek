const COLOR_OPTIONS = [
  '#4e5bd6',
  '#1fa971',
  '#fe9a00',
  '#d1293d',
  '#7c3aed',
  '#0891b2',
  '#db2777',
  '#059669',
  '#ea580c',
  '#6b7280',
]

type ColorPickerProps = {
  value: string
  onChange: (color: string) => void
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-[#6a7789]">Pilih Warna</label>
      <div className="flex flex-wrap items-center gap-2">
        {COLOR_OPTIONS.map((color) => {
          const isActive = value === color
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`flex size-7 items-center justify-center rounded-lg border-2 ${
                isActive ? '' : 'border-transparent'
              }`}
              style={isActive ? { borderColor: color, backgroundColor: `${color}1a` } : undefined}
            >
              <span className="size-3.5 rounded" style={{ backgroundColor: color }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
