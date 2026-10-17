import React from "react";

export interface SummaryCardProps {
  label: string;
  value: string | number;
  description: string;
  tone: "blue" | "green" | "orange" | "purple";
  icon: React.ReactNode;
}

export function SummaryCard({
  label,
  value,
  description,
  tone,
  icon,
}: SummaryCardProps) {
  const toneStyle = {
    blue: "border-l-[#cdd3ff] bg-[#fcfcff] text-[#6270dd]",
    green: "border-l-[#9ee7c9] bg-[#fbfffd] text-[#36b985]",
    orange: "border-l-[#ffd1b7] bg-[#fffdfc] text-[#ef9362]",
    purple: "border-l-[#e2caff] bg-[#fefcff] text-[#aa75e8]",
  }[tone];

  return (
    <div
      className={`min-w-0 rounded-[16px] border border-[#eef0f4] border-l-[4px] p-4 sm:px-3 sm:py-2.5 sm:rounded-lg sm:border-l-2 ${toneStyle}`}
    >
      <div className="flex items-center gap-2.5 sm:gap-2">
        <span className="flex size-7 sm:size-5 items-center justify-center rounded-md bg-current/10">
          {icon}
        </span>
        <p className="truncate text-xs sm:text-[9px] font-medium text-[#7e8999]">
          {label}
        </p>
      </div>
      <p className="mt-3 sm:mt-2 text-2xl sm:text-[19px] font-semibold leading-none text-[#20242d]">
        {value}
      </p>
      <p className="mt-3 sm:mt-2 truncate text-[10px] sm:text-[8px] text-[#9aa5b5]">
        {description}
      </p>
    </div>
  );
}
