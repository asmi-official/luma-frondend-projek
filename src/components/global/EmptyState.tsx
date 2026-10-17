import type { ReactNode } from "react";

type EmptyStateProps = {
  image: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export default function EmptyState({ image, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center px-6 py-10 text-center">
      <img src={image} alt="" className="h-[142px] w-[200px] object-contain" />
      <h2 className="mt-3 text-sm font-semibold text-[#20242d]">{title}</h2>
      <p className="mt-1 max-w-sm text-xs leading-5 text-[#8b96a6]">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
