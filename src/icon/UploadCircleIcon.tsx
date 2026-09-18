type UploadCircleIconProps = {
  size?: number
  className?: string
}

export default function UploadCircleIcon({ size = 18, className }: UploadCircleIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17.7143 17.7143"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g>
        <path
          d="M5 8.85714L8.85714 4.35714L12.7143 8.85714"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.85714 4.35714V13.3571"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.85714 17.2143C13.4727 17.2143 17.2143 13.4727 17.2143 8.85714C17.2143 4.24162 13.4727 0.5 8.85714 0.5C4.24162 0.5 0.5 4.24162 0.5 8.85714C0.5 13.4727 4.24162 17.2143 8.85714 17.2143Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
