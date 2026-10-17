import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { Eye, EyeOff } from "lucide-react";
import { useState, type ElementType, type ReactNode } from "react";
import { Controller, useWatch, type Control, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import { FormField, FormSection } from "./FormSection";

export type CustomFormOption = {
  label: string;
  value: string;
};

type BaseField<TValues extends FieldValues> = {
  id: string;
  label?: string;
  required?: boolean;
  helperText?: ReactNode;
  fullWidth?: boolean;
  visible?: (values: TValues) => boolean;
};

type InputField<TValues extends FieldValues> = BaseField<TValues> & {
  kind: "text" | "email" | "password" | "select";
  name: Path<TValues>;
  placeholder?: string;
  disabled?: boolean | ((values: TValues) => boolean);
  rules?: RegisterOptions<TValues, Path<TValues>>;
  options?: CustomFormOption[];
  selectIcon?: ElementType;
};

type SwitchField<TValues extends FieldValues> = BaseField<TValues> & {
  kind: "switch";
  name: Path<TValues>;
  switchLabel: string;
};

type StaticField<TValues extends FieldValues> = BaseField<TValues> & {
  kind: "static";
  value: string | ((values: TValues) => string);
  placeholder?: string;
  disabled?: boolean;
};

type RenderField<TValues extends FieldValues> = BaseField<TValues> & {
  kind: "render";
  render: (values: TValues) => ReactNode;
};

export type CustomFormField<TValues extends FieldValues> =
  | InputField<TValues>
  | SwitchField<TValues>
  | StaticField<TValues>
  | RenderField<TValues>;

export type CustomFormSection<TValues extends FieldValues> = {
  id: string;
  title: string;
  description?: string;
  columns?: 1 | 2;
  divider?: boolean;
  fields: Array<CustomFormField<TValues>>;
};

type CustomFormProps<TValues extends FieldValues> = {
  control: Control<TValues>;
  sections: Array<CustomFormSection<TValues>>;
  className?: string;
};

const inputSx = {
  "& .MuiInputLabel-root": { display: "none" },
  "& .MuiOutlinedInput-root": {
    height: "32px",
    borderRadius: "9px",
    fontSize: "11px",
    color: "#20242d",
    backgroundColor: "#ffffff",
    "& fieldset": { borderColor: "#e6e9ef" },
    "&:hover fieldset": { borderColor: "#c7cdd8" },
    "&.Mui-focused fieldset": { borderColor: "#4e5bd6" },
  },
  "& .MuiOutlinedInput-input::placeholder": { color: "#9aa5b5", opacity: 1 },
  "& .MuiOutlinedInput-input": { padding: "8px 10px" },
};

function FieldControl<TValues extends FieldValues>({
  field,
  control,
  values,
}: {
  field: CustomFormField<TValues>;
  control: Control<TValues>;
  values: TValues;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const fullWidthClass = field.fullWidth ? "md:col-span-2" : "";

  if (field.visible && !field.visible(values)) return null;

  if (field.kind === "render") {
    return <div className={fullWidthClass}>{field.render(values)}</div>;
  }

  if (field.kind === "switch") {
    return (
      <div className={`flex items-center gap-2 ${fullWidthClass}`}>
        <Controller
          control={control}
          name={field.name}
          render={({ field: controllerField }) => (
            <Switch
              size="small"
              checked={Boolean(controllerField.value)}
              onChange={(event) => controllerField.onChange(event.target.checked)}
              sx={{
                width: 29,
                height: 18,
                padding: 0,
                "& .MuiSwitch-switchBase": {
                  padding: "3px",
                  "&.Mui-checked": {
                    color: "#fff",
                    transform: "translateX(11px)",
                    "+ .MuiSwitch-track": { backgroundColor: "#4e5bd6", opacity: 1 },
                  },
                },
                "& .MuiSwitch-thumb": { width: 12, height: 12 },
                "& .MuiSwitch-track": { borderRadius: 9, backgroundColor: "#c8ccd3", opacity: 1 },
              }}
            />
          )}
        />
        <span className="text-[11px] font-medium text-[#20242d]">{field.switchLabel}</span>
      </div>
    );
  }

  if (field.kind === "static") {
    const value = typeof field.value === "function" ? field.value(values) : field.value;
    return (
      <FormField label={field.label ?? ""} required={field.required} helperText={field.helperText} className={fullWidthClass}>
        <TextField
          fullWidth
          disabled={field.disabled}
          value={value}
          placeholder={field.placeholder}
          slotProps={{ input: { readOnly: !field.disabled } }}
          sx={{
            ...inputSx,
            "& .MuiOutlinedInput-root.Mui-disabled": { backgroundColor: "#f4f5f7" },
            "& .MuiOutlinedInput-input.Mui-disabled": { WebkitTextFillColor: "#9aa5b5" },
          }}
        />
      </FormField>
    );
  }

  const disabled = typeof field.disabled === "function" ? field.disabled(values) : field.disabled;
  return (
    <Controller
      control={control}
      name={field.name}
      rules={field.rules}
      render={({ field: controllerField, fieldState }) => (
        <FormField label={field.label ?? ""} required={field.required} helperText={field.helperText} className={fullWidthClass}>
          <TextField
            {...controllerField}
            select={field.kind === "select"}
            fullWidth
            disabled={disabled}
            type={field.kind === "password" ? (showPassword ? "text" : "password") : field.kind === "email" ? "email" : "text"}
            placeholder={field.placeholder}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            sx={{
              ...inputSx,
              ...(field.kind === "select" ? { "& .MuiSelect-icon": { color: "#8d98a8", right: "9px", width: "14px" } } : {}),
            }}
            slotProps={{
              select: field.kind === "select" ? {
                displayEmpty: true,
                IconComponent: field.selectIcon,
                renderValue: (selected: unknown) => selected ? String(selected) : <span className="text-[#9aa5b5]">{field.placeholder}</span>,
              } : undefined,
              input: field.kind === "password" ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} edge="end" onClick={() => setShowPassword((visible) => !visible)} size="small" sx={{ color: "#9aa5b5", mr: "-4px" }}>
                      {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    </IconButton>
                  </InputAdornment>
                ),
              } : undefined,
            }}
          >
            {field.kind === "select" && field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value} sx={{ fontSize: "12px" }}>{option.label}</MenuItem>
            ))}
          </TextField>
        </FormField>
      )}
    />
  );
}

export default function CustomForm<TValues extends FieldValues>({ control, sections, className = "" }: CustomFormProps<TValues>) {
  const values = useWatch({ control }) as TValues;

  return (
    <FormSection className={className} contentClassName="flex flex-col gap-4">
      {sections.map((section) => (
        <div key={section.id} className={section.divider ? "mt-1 border-t border-[#edf0f3] pt-5" : ""}>
          <h2 className="text-[13px] font-semibold text-[#20242d]">{section.title}</h2>
          {section.description && <p className="mt-1 text-[10px] text-[#8b96a6]">{section.description}</p>}
          <div className={`mt-4 grid grid-cols-1 gap-x-4 gap-y-5 ${section.columns === 1 ? "" : "md:grid-cols-2"}`}>
            {section.fields.map((field) => <FieldControl key={field.id} field={field} control={control} values={values} />)}
          </div>
        </div>
      ))}
    </FormSection>
  );
}
