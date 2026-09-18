type IconProps = {
  size?: number
  className?: string
}

export default function ChevronUpIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M13.5 11.25L9 6.75L4.5 11.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
