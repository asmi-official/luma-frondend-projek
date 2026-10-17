type IconProps = {
  size?: number
  className?: string
}

export default function RadioSelectedIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="white" />
      <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="#4E5BD6" />
      <circle cx="8" cy="8" r="3" fill="#4A54C4" />
    </svg>
  )
}
