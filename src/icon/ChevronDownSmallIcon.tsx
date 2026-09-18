type IconProps = {
  size?: number
  className?: string
}

export default function ChevronDownSmallIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={(size * 8) / 14} viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M0.5 0.84924L6.65 6.99924C6.69489 7.04707 6.74911 7.08519 6.80931 7.11125C6.8695 7.13731 6.9344 7.15076 7 7.15076C7.0656 7.15076 7.1305 7.13731 7.19069 7.11125C7.25089 7.08519 7.30511 7.04707 7.35 6.99924L13.5 0.84924" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
