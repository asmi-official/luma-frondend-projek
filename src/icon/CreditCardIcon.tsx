type IconProps = {
  size?: number
  className?: string
}

export default function CreditCardIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M1.33333 6.66667H14.6667M2.66667 3.33333H13.3333C14.0697 3.33333 14.6667 3.93029 14.6667 4.66667V11.3333C14.6667 12.0697 14.0697 12.6667 13.3333 12.6667H2.66667C1.93029 12.6667 1.33333 12.0697 1.33333 11.3333V4.66667C1.33333 3.93029 1.93029 3.33333 2.66667 3.33333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
