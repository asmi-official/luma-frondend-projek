type IconProps = {
  size?: number
  className?: string
}

export default function Package2Icon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9 2.25V6.75M2.29051 6.75989H15.7103M12.57 2.25004C12.8495 2.24809 13.1241 2.3243 13.3626 2.47008C13.6012 2.61585 13.7942 2.82538 13.92 3.07504L15.5925 6.43429C15.696 6.64186 15.7499 6.87061 15.75 7.10254V14.25C15.75 14.6479 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6479 2.25 14.25V7.10404C2.25002 6.87129 2.30419 6.64173 2.40825 6.43354L4.0875 3.07504C4.21272 2.82653 4.40461 2.61775 4.6417 2.47206C4.87878 2.32636 5.15172 2.24949 5.43 2.25004H12.57Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
