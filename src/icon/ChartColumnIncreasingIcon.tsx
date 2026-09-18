type IconProps = {
  size?: number
  className?: string
}

export default function ChartColumnIncreasingIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3.75 15.75V11.25M9 15.75V6.75M14.25 15.75V2.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
