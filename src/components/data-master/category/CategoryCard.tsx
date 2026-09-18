import { useEffect, useRef, useState } from 'react'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import EllipsisVerticalIcon from '../../../icon/EllipsisVerticalIcon'
import type { Category } from '../../../pages/data-master/category/types'
import StatusBadge from './StatusBadge'

type CategoryCardProps = {
  category: Category
  onEdit?: () => void
  onDelete?: () => void
}

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
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
      style={{ borderColor: `${category.colorIcon}33` }}
    >
      <div className="flex w-full items-start justify-between">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${category.colorIcon}1a` }}
        >
          <DynamicLucideIcon name={category.icon} size={18} style={{ color: category.colorIcon }} />
        </span>

        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex size-8 items-center justify-center rounded-lg hover:bg-[#f7f8fc]"
          >
            <EllipsisVerticalIcon size={18} className="text-[#4d5057]" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-9 z-10 flex w-44 flex-col overflow-hidden rounded-lg border border-[#f0f1f5] bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  onEdit?.()
                }}
                className="flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-[#20242d] hover:bg-[#f7f8fc]"
              >
                <DynamicLucideIcon name="pencil" size={14} className="text-[#6a7789]" />
                Ubah Kategori
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
                Hapus Kategori
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="pt-3 text-base font-semibold leading-[1.4] text-[#20242d]">{category.name}</p>
      <p className="pt-1 text-xs leading-[1.4] text-[#8f99a7]">{category.description}</p>

      <div className="flex w-full items-center justify-between border-t border-[#f0f1f5] pt-4 mt-4">
        <p className="text-xs leading-[1.4] text-[#6a7789]">{category.itemCount} item</p>
        <StatusBadge active={category.active} />
      </div>
    </div>
  )
}
