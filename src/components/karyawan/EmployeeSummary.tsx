type EmployeeSummaryProps = {
  total: number;
  active: number;
  inactive: number;
};

export function EmployeeSummary({ total, active, inactive }: EmployeeSummaryProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <p className="text-[13px] leading-[1.4] font-medium whitespace-nowrap text-[#4e5bd6]">
        {total} Karyawan
      </p>
      <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
      <p className="text-[13px] leading-[1.4] whitespace-nowrap text-[#1fa971]">
        {active} Aktif
      </p>
      <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
      <p className="text-[13px] leading-[1.4] whitespace-nowrap text-[#94a3b8]">
        {inactive} Nonaktif
      </p>
    </div>
  );
}
