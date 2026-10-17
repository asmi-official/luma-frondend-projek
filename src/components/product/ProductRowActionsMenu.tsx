import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import DynamicLucideIcon from '../../icon/DynamicLucideIcon'
import EllipsisVerticalIcon from '../../icon/EllipsisVerticalIcon'

type ProductRowActionsMenuProps = {
  onEdit: () => void
  onViewDetail: () => void
  onViewSalesAnalytics: () => void
  onDelete: () => void
}

const MENU_WIDTH = 200

export default function ProductRowActionsMenu({
  onEdit,
  onViewDetail,
  onViewSalesAnalytics,
  onDelete,
}: ProductRowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function updatePosition() {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - MENU_WIDTH,
      })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (action: () => void) => {
    setIsOpen(false)
    action()
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex size-6 items-center justify-center rounded-md text-[#8f99a7] hover:bg-[#f0f1f5]"
      >
        <EllipsisVerticalIcon size={18} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: menuPosition.top, left: menuPosition.left, width: MENU_WIDTH }}
            className="fixed z-50 flex flex-col items-start gap-0.5 rounded-xl border border-[#eceef0] bg-white p-2 shadow-lg"
          >
            <button
              type="button"
              onClick={() => handleSelect(onEdit)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[#f7f8fc]"
            >
              <DynamicLucideIcon name="pencil" size={16} className="text-[#20242d]" />
              <span className="text-[13px] whitespace-nowrap text-[#20242d]">Ubah Produk</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect(onViewDetail)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[#f7f8fc]"
            >
              <DynamicLucideIcon name="eye" size={16} className="text-[#20242d]" />
              <span className="text-[13px] whitespace-nowrap text-[#20242d]">Lihat Detail</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect(onViewSalesAnalytics)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[#f7f8fc]"
            >
              <DynamicLucideIcon name="bar-chart" size={16} className="text-[#20242d]" />
              <span className="text-[13px] whitespace-nowrap text-[#20242d]">Analitik Penjualan</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect(onDelete)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[#f7f8fc]"
            >
              <DynamicLucideIcon name="trash-2" size={16} className="text-[#d1293d]" />
              <span className="text-[13px] whitespace-nowrap text-[#d1293d]">Hapus Produk</span>
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}
