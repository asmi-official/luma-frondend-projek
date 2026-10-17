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
      className={`flex h-[167px] w-full min-w-0 flex-col gap-4 rounded-[16px] border border-[#eef0f4] border-l-4 p-5 ${toneStyle}`}
    >
      {/* Header: icon + label */}
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-current/20 bg-current/10 [&>svg]:size-[18px]">
          {icon}
        </span>
        <p className="truncate text-sm font-medium text-[#7e8999]">{label}</p>
      </div>

      {/* Value */}
      <p className="text-[28px] font-bold leading-8 text-[#20242d]">{value}</p>

      {/* Description */}
      <p className="truncate text-[11px] leading-4 text-[#9aa5b5]">
        {description}
      </p>
    </div>
  );
}
