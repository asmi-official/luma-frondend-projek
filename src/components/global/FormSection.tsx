import type { ReactNode } from "react";

type FormSectionProps = {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  contentClassName?: string;
};

type FormFieldProps = {
  children: ReactNode;
  label: ReactNode;
  required?: boolean;
  helperText?: ReactNode;
  className?: string;
};

export function FormSection({
  children,
  title,
  description,
  className = "",
  contentClassName = "",
}: FormSectionProps) {
  return (
    <section className={`w-full rounded-[10px] border border-[#e8ebf0] bg-white px-5 py-5 ${className}`}>
      {(title || description) && (
        <div>
          {title && <h2 className="text-[13px] font-semibold text-[#20242d]">{title}</h2>}
          {description && <p className="mt-1 text-[10px] text-[#8b96a6]">{description}</p>}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}

export function FormField({
  children,
  label,
  required = false,
  helperText,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label className="flex items-center gap-1 text-[11px] font-medium text-[#20242d]">
        {label}
        {required && <span className="text-[11px] font-semibold text-[#db4550]">*</span>}
      </label>
      {children}
      {helperText && <p className="text-[9px] text-[#9aa5b5]">{helperText}</p>}
    </div>
  );
}
