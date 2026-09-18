import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import EllipsisVerticalIcon from '../../../icon/EllipsisVerticalIcon'
import UsersRoundIcon from '../../../icon/UsersRoundIcon'
import type { Role } from '../../../pages/data-master/role-management/types'
import AccessLevelBadge from './AccessLevelBadge'

type RoleCardProps = {
  role: Role
  icon: ReactNode
  iconBg: string
  borderColor: string
  onEdit?: () => void
  onDelete?: () => void
}

export default function RoleCard({ role, icon, iconBg, borderColor, onEdit, onDelete }: RoleCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  return (
    <div
      className="flex flex-col items-start rounded-2xl border bg-white p-4"
      style={{ borderColor }}
    >
      <div className="flex w-full items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: iconBg }}>
          {icon}
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold leading-[1.4] text-[#20242d]">{role.name}</p>
            <AccessLevelBadge level={role.accessLevel} />
          </div>
          <p className="pt-0.5 text-xs leading-[1.4] text-[#8f99a7]">{role.description}</p>
        </div>

        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex size-8 items-center justify-center rounded-lg hover:bg-[#f7f8fc]"
          >
            <EllipsisVerticalIcon size={18} className="text-[#4d5057]" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-9 z-10 flex w-40 flex-col overflow-hidden rounded-lg border border-[#f0f1f5] bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  onEdit?.()
                }}
                className="flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-[#20242d] hover:bg-[#f7f8fc]"
              >
                <DynamicLucideIcon name="pencil" size={14} className="text-[#6a7789]" />
                Ubah Role
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  onDelete?.()
                }}
                className="flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-[#d1293d] hover:bg-[#fef2f2]"
              >
                <DynamicLucideIcon name="trash-2" size={14} className="text-[#d1293d]" />
                Hapus Role
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-1.5 pt-4">
        {role.permissions.map((permission) => (
          <span
            key={permission}
            className="rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-medium leading-[1.4] whitespace-nowrap text-[#8f99a7]"
          >
            {permission}
          </span>
        ))}
      </div>

      <div className="flex w-full items-center gap-2 border-t border-[#f0f1f5] pt-4 mt-4">
        <UsersRoundIcon size={14} className="text-[#8f99a7]" />
        <p className="text-xs leading-[1.4] text-[#8f99a7]">{role.userCount} pengguna</p>
      </div>
    </div>
  )
}
