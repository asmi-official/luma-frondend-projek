type IconProps = {
  size?: number
  className?: string
}

export default function PlusIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3.75 9H14.25M9 3.75V14.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
