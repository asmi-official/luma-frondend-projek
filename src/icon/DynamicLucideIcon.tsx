import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import type { CSSProperties } from 'react'

type DynamicLucideIconProps = {
  name: string
  size?: number
  className?: string
  style?: CSSProperties
}

export default function DynamicLucideIcon({ name, size = 18, className, style }: DynamicLucideIconProps) {
  return <DynamicIcon name={name as IconName} size={size} className={className} style={style} />
}
