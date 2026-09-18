type IconProps = {
  size?: number
  className?: string
}

export default function ChevronDownIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
