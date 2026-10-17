import DynamicLucideIcon from '../../icon/DynamicLucideIcon'

const VISIBLE_PAGES = 6

type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const start = Math.max(1, Math.min(page - 2, totalPages - VISIBLE_PAGES + 1))
  const end = Math.min(totalPages, start + VISIBLE_PAGES - 1)
  const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const itemClass = 'flex items-center justify-center gap-1 px-3 py-2 text-[12.5px] whitespace-nowrap'
  const linkClass = `${itemClass} font-medium text-[#4e5bd6] hover:bg-[#f7f8fc]`

  return (
    <div className="flex items-stretch overflow-hidden rounded-[10px] border border-[#ebedf1] bg-white">
      {page > 1 && (
        <button type="button" onClick={() => onChange(page - 1)} className={linkClass}>
          <DynamicLucideIcon name="chevron-left" size={8} />
          Prev
        </button>
      )}

      {pageNumbers.map((pageNumber, i) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onChange(pageNumber)}
          className={`${itemClass} ${i > 0 || page > 1 ? 'border-l border-[#ebedf1]' : ''} ${
            pageNumber === page
              ? 'bg-[#eff0f3] font-semibold text-[#a6abb4]'
              : 'font-medium text-[#4e5bd6] hover:bg-[#f7f8fc]'
          }`}
        >
          {pageNumber}
        </button>
      ))}

      {end < totalPages && (
        <span className={`${itemClass} border-l border-[#ebedf1] font-medium text-[#b7bbc4]`}>…</span>
      )}

      {page < totalPages && (
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          className={`${linkClass} border-l border-[#ebedf1]`}
        >
          Next
          <DynamicLucideIcon name="chevron-right" size={8} />
        </button>
      )}
    </div>
  )
}
