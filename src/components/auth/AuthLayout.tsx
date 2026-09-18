import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SecurityIcon from '@mui/icons-material/Security'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import type { ReactNode } from 'react'
import promoImage from '../../assets/images-login-register.png'

type PromoBadge = {
  icon: ReactNode
  label: string
}

type AuthLayoutProps = {
  eyebrow: string
  title: string
  description: string
  formTitle: string
  formSubtitle: string
  children: ReactNode
}

const badges: PromoBadge[] = [
  { icon: <AutoAwesomeIcon sx={{ fontSize: 13 }} />, label: 'AI Insight Otomatis' },
  { icon: <SecurityIcon sx={{ fontSize: 13 }} />, label: 'Keamanan Tingkat Tinggi' },
  { icon: <PeopleAltIcon sx={{ fontSize: 13 }} />, label: '1.000+ Pebisnis Aktif' },
]

export default function AuthLayout({
  eyebrow,
  title,
  description,
  formTitle,
  formSubtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-start bg-[#fdfeff] p-6">
      <div className="relative hidden aspect-697/976 h-[calc(100vh-48px)] shrink-0 overflow-hidden rounded-2xl lg:block">
        <img
          src={promoImage}
          alt="Ilustrasi ringkasan bisnis Luma"
          className="absolute inset-0 h-full w-full object-contain"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col p-9">
          <p className="text-[11px] font-semibold uppercase tracking-[1.2px] text-white/60">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-[420px] text-[34px] font-semibold leading-[1.18] text-white">
            {title}
          </h1>
          <p className="mt-2.5 max-w-[420px] text-[14.5px] leading-[1.6] text-white/65">
            {description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.14] px-3 py-1.5 text-white backdrop-blur-sm"
              >
                {badge.icon}
                <span className="text-xs font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-48px)] flex-1 items-center justify-center rounded-2xl bg-white p-5 lg:rounded-l-none">
        <div className="w-full max-w-[511px]">
          <div className="pb-8">
            <h2 className="text-[28px] font-semibold leading-[1.2] text-[#17213a]">
              {formTitle}
            </h2>
            <p className="mt-2 text-base text-[#7b8499]">{formSubtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
