import { useProfile } from '../../api/auth'
import BellIcon from '../../icon/BellIcon'
import ChevronDownSmallIcon from '../../icon/ChevronDownSmallIcon'
import MenuIcon from '../../icon/MenuIcon'

type TopbarProps = {
  pageTitle: string
  onMenuClick: () => void
}

export default function Topbar({ pageTitle, onMenuClick }: TopbarProps) {
  const { data } = useProfile()
  const userName = data?.data.full_name ?? ''
  const userRole = data?.data.role ?? ''

  return (
    <header className="flex w-full items-center justify-between border-b border-[#f0f1f5] bg-white px-4 py-2 lg:px-7">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="mr-1 flex size-9 items-center justify-center rounded-lg text-[#6a7789] hover:bg-[#f7f8fc] lg:hidden"
        >
          <MenuIcon size={20} />
        </button>
        <span className="text-[13px] font-medium text-[#8f99a7]">Luma</span>
        <span className="text-base text-[#d0d5dc]">/</span>
        <span className="text-[13px] font-semibold text-[#20242d]">{pageTitle}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-lg bg-[#f7f8fc]"
        >
          <BellIcon size={18} className="text-[#6a7789]" />
        </button>

        <button type="button" className="flex items-center gap-2.5 rounded-xl px-3 py-1.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#d9ddfc]">
            <span className="text-[13px] font-bold text-[#4e5bd6]">
              {userName ? userName.charAt(0).toUpperCase() : ''}
            </span>
          </span>
          <span className="flex flex-col items-start text-left">
            <span className="text-[13px] font-semibold leading-[1.25] text-[#20242d]">{userName}</span>
            <span className="text-[11px] leading-[1.25] text-[#8f99a7]">{userRole}</span>
          </span>
          <ChevronDownSmallIcon size={14} className="text-[#8f99a7]" />
        </button>
      </div>
    </header>
  )
}
