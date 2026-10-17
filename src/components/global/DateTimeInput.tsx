import { useRef } from 'react'
import DynamicLucideIcon from '../../icon/DynamicLucideIcon'

type DateTimeInputProps = {
  type: 'date' | 'time'
  /** ISO date (YYYY-MM-DD) for "date", HH:mm for "time" */
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  /** Earliest selectable value; earlier dates/times are disabled in the picker */
  min?: string
  hasError?: boolean
  /** Turns the stored value into what is shown in the field, e.g. "2026-09-12" -> "12 September 2026" */
  formatValue?: (value: string) => string
}

/** Text-style field that opens the browser's native date/time picker, so the shown format stays consistent. */
export default function DateTimeInput({
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  min,
  hasError = false,
  formatValue,
}: DateTimeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const openPicker = () => {
    try {
      inputRef.current?.showPicker()
    } catch {
      // showPicker is unavailable or blocked; the native input still handles focus and typing
    }
  }

  return (
    <div
      className={`relative flex w-full items-center gap-2 rounded-xl border bg-white p-3 focus-within:border-[#4e5bd6] ${
        hasError ? 'border-[#d32f2f]' : 'border-[#e9e9ea] hover:border-[#c7c9ce]'
      }`}
    >
      <p className={`flex-1 text-sm leading-[1.4] ${value ? 'text-[#20242d]' : 'text-[#8f99a7]'}`}>
        {value ? (formatValue?.(value) ?? value) : placeholder}
      </p>
      <DynamicLucideIcon
        name={type === 'date' ? 'calendar' : 'clock-3'}
        size={18}
        className="shrink-0 text-[#8f99a7]"
      />

      <input
        ref={inputRef}
        type={type}
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onClick={openPicker}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      />
    </div>
  )
}
