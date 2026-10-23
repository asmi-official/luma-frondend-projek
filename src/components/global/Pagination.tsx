type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  rangeStart?: number;
  rangeEnd?: number;
  totalItems?: number;
  itemLabel?: string;
};

export default function Pagination({
  page,
  totalPages,
  onChange,
  rangeStart,
  rangeEnd,
  totalItems,
  itemLabel = "produk",
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-4 pt-2">
      <p className="text-[13px] text-[#6a7789]">
        {rangeStart !== undefined && rangeEnd !== undefined && totalItems !== undefined
          ? `Menampilkan ${rangeStart}–${rangeEnd} dari ${totalItems} ${itemLabel}`
          : ""}
      </p>

      <div className="flex items-center overflow-hidden rounded-[10px] border border-[#ebedf1] bg-white">
        {pages.map((p, i) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`flex items-center justify-center px-3.5 py-2 text-xs font-medium transition-colors ${
              i > 0 ? "border-l border-[#ebedf1]" : ""
            } ${
              p === page
                ? "bg-[#eff0f3] font-semibold text-[#8f99a7]"
                : "text-[#4e5bd6] hover:bg-[#f7f8fc]"
            }`}
          >
            {p}
          </button>
        ))}

        {page < totalPages && (
          <button
            type="button"
            onClick={() => onChange(page + 1)}
            className="flex items-center gap-1 px-3.5 py-2 text-xs font-medium text-[#4e5bd6] hover:bg-[#f7f8fc] border-l border-[#ebedf1]"
          >
            Next
            <span className="text-[10px]">›</span>
          </button>
        )}
      </div>
    </div>
  );
}
