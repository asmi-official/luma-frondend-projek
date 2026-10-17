type IconProps = {
  size?: number
  className?: string
}

export default function CheckIcon({ size = 11, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9.16667 2.75L4.125 7.79167L1.83333 5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
