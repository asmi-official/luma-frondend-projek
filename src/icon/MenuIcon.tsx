type IconProps = {
  size?: number
  className?: string
}

export default function MenuIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2.25 4.5H15.75M2.25 9H15.75M2.25 13.5H15.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
