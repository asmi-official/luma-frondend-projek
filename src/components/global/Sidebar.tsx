import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCompanyDetail } from '../../api/companies'
import { useFlexParams, type FlexParam } from '../../api/flexParams'
import logo from '../../assets/logo.svg'
import { useAuthStore } from '../../store/authStore'
import BoxIcon from '../../icon/BoxIcon'
import BriefcaseBusinessIcon from '../../icon/BriefcaseBusinessIcon'
import Building2Icon from '../../icon/Building2Icon'
import ChartColumnIncreasingIcon from '../../icon/ChartColumnIncreasingIcon'
import ChevronDownIcon from '../../icon/ChevronDownIcon'
import ChevronUpIcon from '../../icon/ChevronUpIcon'
import CloseIcon from '../../icon/CloseIcon'
import CreditCardIcon from '../../icon/CreditCardIcon'
import FolderCogIcon from '../../icon/FolderCogIcon'
import HistoryIcon from '../../icon/HistoryIcon'
import LayoutGridIcon from '../../icon/LayoutGridIcon'
import MessageCircleQuestionIcon from '../../icon/MessageCircleQuestionIcon'
import Package2Icon from '../../icon/Package2Icon'
import PercentIcon from '../../icon/PercentIcon'
import ShoppingCartIcon from '../../icon/ShoppingCartIcon'
import TagsIcon from '../../icon/TagsIcon'
import UsersRoundIcon from '../../icon/UsersRoundIcon'
import WalletIcon from '../../icon/WalletIcon'
import WandSparklesIcon from '../../icon/WandSparklesIcon'

type IconComponent = (props: { size?: number; className?: string }) => React.JSX.Element

const iconByLabel: Record<string, IconComponent> = {
  Dashboard: LayoutGridIcon,
  Kasir: ShoppingCartIcon,
  'Riwayat Transaksi': HistoryIcon,
  Produk: Package2Icon,
  Inventory: BoxIcon,
  Pengeluaran: WalletIcon,
  'Data Master': FolderCogIcon,
  'Luma AI': WandSparklesIcon,
  Laporan: ChartColumnIncreasingIcon,
  Karyawan: BriefcaseBusinessIcon,
  Cabang: Building2Icon,
  'Bantuan & Feedback': MessageCircleQuestionIcon,
  Kategori: TagsIcon,
  'Role Pengguna': UsersRoundIcon,
  'Metode Pembayaran': CreditCardIcon,
  'Event Promo': PercentIcon,
}

const routeByLabel: Record<string, string> = {
  Dashboard: '/',
  Kasir: '/kasir',
  'Riwayat Transaksi': '/riwayat-transaksi',
  Produk: '/product',
  Inventory: '/inventory',
  Pengeluaran: '/pengeluaran',
  'Data Master': '/data-master',
  'Luma AI': '/luma-ai',
  Laporan: '/laporan',
  Karyawan: '/karyawan',
  Cabang: '/cabang',
  'Bantuan & Feedback': '/bantuan',
  Kategori: '/data-master/kategori',
  'Role Pengguna': '/data-master/role-pengguna',
  'Metode Pembayaran': '/data-master/metode-pembayaran',
  'Event Promo': '/data-master/event-promo',
}

function isMenuActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

const defaultIcon = FolderCogIcon

function toRoute(label: string) {
  return (
    routeByLabel[label] ??
    `/${label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}`
  )
}

type MenuNode = {
  id: string
  label: string
  to: string
  icon: IconComponent
  children: MenuNode[]
}

type MenuGroup = {
  id: string
  title: string
  items: MenuNode[]
}

function buildMenuTree(flexParams: FlexParam[]) {
  const childrenByHeaderId = new Map<string, FlexParam[]>()

  for (const row of flexParams) {
    if (row.header_id === null) continue
    const siblings = childrenByHeaderId.get(row.header_id) ?? []
    siblings.push(row)
    childrenByHeaderId.set(row.header_id, siblings)
  }

  const toMenuNode = (row: FlexParam): MenuNode => ({
    id: row.id,
    label: row.value_param,
    to: toRoute(row.value_param),
    icon: iconByLabel[row.value_param] ?? defaultIcon,
    children: (childrenByHeaderId.get(row.id) ?? []).map(toMenuNode),
  })

  // A group section (e.g. "BISNIS") is a root row that has children,
  // distinguishing it from a standalone top-level item (e.g. "Dashboard").
  const groupRows = flexParams.filter(
    (row) => row.header_id === null && childrenByHeaderId.has(row.id),
  )
  const groupIds = new Set(groupRows.map((row) => row.id))

  const standaloneItems: MenuNode[] = flexParams
    .filter((row) => row.header_id === null && !groupIds.has(row.id))
    .map(toMenuNode)

  const groups: MenuGroup[] = groupRows.map((row) => ({
    id: row.id,
    title: row.value_param,
    items: (childrenByHeaderId.get(row.id) ?? []).map(toMenuNode),
  }))

  return { standaloneItems, groups }
}

function MenuLink({ item, isActive }: { item: MenuNode; isActive: boolean }) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      className={`flex h-[38px] w-full items-center gap-2.5 rounded-xl px-3 py-2.5 no-underline transition-colors ${isActive ? 'bg-[#edeffb]' : 'hover:bg-[#f7f8fc]'
        }`}
    >
      <Icon size={18} className={isActive ? 'text-[#4e5bd6]' : 'text-[#6a7789]'} />
      <span className={`text-sm ${isActive ? 'font-medium text-[#4e5bd6]' : 'font-normal text-[#6a7789]'}`}>
        {item.label}
      </span>
    </Link>
  )
}

function hasActiveDescendant(item: MenuNode, pathname: string): boolean {
  return item.children.some(
    (child) => isMenuActive(pathname, child.to) || hasActiveDescendant(child, pathname),
  )
}

function ExpandableMenuItem({ item, pathname }: { item: MenuNode; pathname: string }) {
  const isChildActive = hasActiveDescendant(item, pathname)
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false)
  const isExpanded = isManuallyExpanded || isChildActive
  const Icon = item.icon

  return (
    <div className="flex w-full flex-col gap-1">
      <button
        type="button"
        onClick={() => setIsManuallyExpanded((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-[10px] p-3 hover:bg-[#f7f8fc]"
      >
        <Icon size={18} className="text-[#6a7789]" />
        <span className="flex-1 text-left text-sm font-normal text-[#6a7789]">{item.label}</span>
        <ChevronDownIcon size={18} className={`text-[#6a7789] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="flex w-full flex-col gap-0.5">
          {item.children.map((child) =>
            child.children.length > 0 ? (
              <div key={child.id} className="pl-3">
                <ExpandableMenuItem item={child} pathname={pathname} />
              </div>
            ) : (
              <SubmenuLink key={child.id} item={child} isActive={isMenuActive(pathname, child.to)} />
            ),
          )}
        </div>
      )}
    </div>
  )
}

function SubmenuLink({ item, isActive }: { item: MenuNode; isActive: boolean }) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      className={`flex w-full items-center gap-4 rounded-lg px-5 py-3 no-underline ${isActive ? 'bg-[#edeffb]' : 'hover:bg-[#f7f8fc]'}`}
    >
      <Icon size={16} className={isActive ? 'text-[#4e5bd6]' : 'text-[#6a7789]'} />
      <span className={`flex-1 text-xs ${isActive ? 'font-medium text-[#4e5bd6]' : 'font-normal text-[#6a7789]'}`}>
        {item.label}
      </span>
    </Link>
  )
}

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()

  const companyId = useAuthStore((state) => state.user?.company_id ?? undefined)
  const { data: companyData } = useCompanyDetail(companyId)
  const companyName = companyData?.data.company_name ?? 'Kopi Kita'
  const companyLabel = companyData?.data.company_cabang ? 'Utama' : 'Cabang'

  const { data } = useFlexParams({
    filter: [
      { key: 'type_param', operator: 'equal', value: 'MENU_APP_LUMA' },
      { key: 'active', operator: 'equal', value: true },
    ],
    limit: 100,
  })

  const { standaloneItems, groups } = buildMenuTree(data?.data ?? [])
  const topItems = standaloneItems.filter((item) => item.label !== 'Bantuan & Feedback')
  const bottomItems = standaloneItems.filter((item) => item.label === 'Bantuan & Feedback')

  useEffect(() => {
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[260px] shrink-0 flex-col border-r border-[#f0f1f5] bg-[#fdfeff] transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex w-full flex-col items-start px-4 pt-6">
          <div className="flex w-full items-center justify-between">
            <img src={logo} alt="Luma" className="h-[39px] w-[90px]" />
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg text-[#6a7789] hover:bg-[#f7f8fc] lg:hidden"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <button
            type="button"
            className="mt-2 flex w-full items-center justify-between rounded-xl bg-[#f7f8fc] px-3 py-2.5"
          >
            <span className="flex flex-col items-start gap-1">
              <span className="text-[11px] font-medium text-[#8f99a7]">Bisnis</span>
              <span className="text-[13px] font-semibold text-[#20242d]">{companyName}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[11px] font-medium text-[#8f99a7]">{companyLabel}</span>
              <ChevronUpIcon size={18} className="rotate-180 text-[#8f99a7]" />
            </span>
          </button>

          <div className="mt-4 h-px w-full bg-[#f0f1f5]" />
        </div>

        <nav className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-4 pb-4">
          {topItems.map((item) => (
            <div key={item.id} className="w-full pt-4">
              {item.children.length > 0 ? (
                <ExpandableMenuItem item={item} pathname={location.pathname} />
              ) : (
                <MenuLink item={item} isActive={isMenuActive(location.pathname, item.to)} />
              )}
            </div>
          ))}

          {groups.map((group) => (
            <div key={group.id} className="w-full pt-4">
              <p className="px-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[1.05px] text-[#b0b7c3]">
                {group.title}
              </p>
              <div className="flex w-full flex-col gap-1">
                {group.items.map((item) =>
                  item.children.length > 0 ? (
                    <ExpandableMenuItem key={item.id} item={item} pathname={location.pathname} />
                  ) : (
                    <MenuLink key={item.id} item={item} isActive={isMenuActive(location.pathname, item.to)} />
                  ),
                )}
              </div>
            </div>
          ))}

          <div className="mt-4 h-px w-full bg-[#f0f1f5]" />

          {bottomItems.map((item) => (
            <div key={item.id} className="w-full pt-4">
              <MenuLink item={item} isActive={isMenuActive(location.pathname, item.to)} />
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
