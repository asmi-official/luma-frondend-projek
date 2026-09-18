type IconProps = {
  size?: number
  className?: string
}

export default function ChartCombinedIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9 12V15.75M12 10.5V15.75M15 7.5V15.75M16.5 2.25L10.0155 8.7345C9.98067 8.76942 9.93928 8.79713 9.89372 8.81603C9.84817 8.83494 9.79933 8.84467 9.75 8.84467C9.70067 8.84467 9.65183 8.83494 9.60628 8.81603C9.56072 8.79713 9.51933 8.76942 9.4845 8.7345L7.0155 6.2655C6.94518 6.1952 6.84981 6.1557 6.75037 6.1557C6.65094 6.1557 6.55557 6.1952 6.48525 6.2655L1.5 11.25M3 13.5V15.75M6 10.5V15.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
