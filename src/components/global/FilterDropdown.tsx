import { useEffect, useRef, useState } from 'react'
import DynamicLucideIcon from '../../icon/DynamicLucideIcon'

export type FilterDropdownOption<T extends string> = {
  value: T
  label: string
}

type FilterDropdownProps<T extends string> = {
  allLabel: string
  options: FilterDropdownOption<T>[]
  value: T | null
  onChange: (value: T | null) => void
  /** When set, a search box is shown above the options. */
  searchPlaceholder?: string
}

export default function FilterDropdown<T extends string>({
  allLabel,
  options,
  value,
  onChange,
  searchPlaceholder,
}: FilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.value === value)
  const keyword = search.trim().toLowerCase()
  const filteredOptions = keyword
    ? options.filter((option) => option.label.toLowerCase().includes(keyword))
    : options

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (next: T | null) => {
    onChange(next)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div ref={containerRef} className="relative flex shrink-0 items-stretch">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-full items-center gap-1 rounded-lg border border-[#ebebeb] bg-white px-3 py-2 text-sm whitespace-nowrap text-[#4d5057]"
      >
        {selectedOption?.label ?? allLabel}
        <DynamicLucideIcon name="chevron-down" size={16} className="text-[#8f99a7]" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-10 mt-1 flex w-[200px] flex-col overflow-hidden rounded-xl border border-[#e9e9ea] bg-white shadow-lg">
          {searchPlaceholder && (
            <div className="border-b border-[#f0f1f5] p-2">
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-[#e9e9ea] px-3 py-2 text-sm text-[#20242d] placeholder:text-[#8f99a7] focus:border-[#4e5bd6] focus:outline-none"
              />
            </div>
          )}

          <div className="flex max-h-[220px] flex-col overflow-y-auto p-1">
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f7f8fc] ${
                value === null ? 'font-medium text-[#4e5bd6]' : 'text-[#20242d]'
              }`}
            >
              {allLabel}
            </button>

            {filteredOptions.length === 0 && (
              <p className="px-3 py-2 text-sm text-[#8f99a7]">Tidak ada hasil ditemukan</p>
            )}

            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f7f8fc] ${
                  value === option.value ? 'font-medium text-[#4e5bd6]' : 'text-[#20242d]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
