import InputAdornment from '@mui/material/InputAdornment'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Control, FieldValues, Path, RegisterOptions, UseFormSetValue } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useFlexParams } from '../../api/flexParams'
import DynamicLucideIcon from '../../icon/DynamicLucideIcon'
import type { ProductFormValues } from '../../pages/product/types'
import { formatRupiah, parseRupiah } from '../../utils/currency'
import ProductPhotoUpload from './ProductPhotoUpload'

const CATEGORY_TYPE_PARAM = 'CATEGORY_OWNER'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    fontSize: '14px',
    '& fieldset': { borderColor: '#e9e9ea' },
    '&:hover fieldset': { borderColor: '#c7c9ce' },
    '&.Mui-focused fieldset': { borderColor: '#4e5bd6' },
    '&.Mui-disabled fieldset': { borderColor: '#e5e8eb' },
  },
  '& .MuiOutlinedInput-input::placeholder': {
    color: '#8f99a7',
    opacity: 1,
  },
}

function RequiredMark() {
  return <span className="text-[13px] font-semibold text-[#a72131]">*</span>
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-5">
      <p className="text-[15px] font-semibold text-[#20242d]">{title}</p>
      {children}
    </div>
  )
}

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
  multiline?: boolean
  rows?: number
  rules?: RegisterOptions<T, Path<T>>
}

function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  multiline = false,
  rows,
  rules,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="flex w-full flex-col gap-1.5">
          <label className="flex items-center gap-[3px] text-[13px] font-medium text-[#20242d]">
            {label}
            {required && <RequiredMark />}
          </label>
          <TextField
            {...field}
            type={type}
            placeholder={placeholder}
            fullWidth
            disabled={disabled}
            multiline={multiline}
            rows={rows}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            sx={{
              ...inputSx,
              ...(disabled && {
                '& .MuiOutlinedInput-root': {
                  ...inputSx['& .MuiOutlinedInput-root'],
                  backgroundColor: '#f6f7f8',
                },
              }),
            }}
          />
        </div>
      )}
    />
  )
}

function CategorySelect({
  value,
  onSelect,
}: {
  value: string
  onSelect: (categoryId: string, categoryName: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const { data } = useFlexParams({
    filter: [{ key: 'type_param', operator: 'equal', value: CATEGORY_TYPE_PARAM }],
    limit: 100,
  })

  const categoryOptions = data?.data ?? []
  const selectedOption = categoryOptions.find((option) => option.id === value)
  const filteredOptions = search.trim()
    ? categoryOptions.filter((option) =>
        option.value_param.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : categoryOptions

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative flex w-full flex-col gap-1.5">
      <label className="flex items-center gap-[3px] text-[13px] font-medium text-[#20242d]">
        Kategori
        <RequiredMark />
      </label>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-[55px] w-full items-center justify-between rounded-xl border border-[#e9e9ea] px-3.5 text-left text-sm hover:border-[#c7c9ce]"
      >
        <span className={selectedOption ? 'text-[#20242d]' : 'text-[#8f99a7]'}>
          {selectedOption?.value_param ?? 'Pilih Kategori'}
        </span>
        <DynamicLucideIcon name="chevron-down" size={16} className="text-[#8f99a7]" />
      </button>

      {isOpen && (
        <div className="absolute top-full z-10 mt-1 flex w-full flex-col overflow-hidden rounded-xl border border-[#e9e9ea] bg-white shadow-lg">
          <div className="border-b border-[#f0f1f5] p-2">
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kategori..."
              className="w-full rounded-lg border border-[#e9e9ea] px-3 py-2 text-sm text-[#20242d] placeholder:text-[#8f99a7] focus:border-[#4e5bd6] focus:outline-none"
            />
          </div>

          <div className="flex max-h-[220px] flex-col overflow-y-auto">
            {filteredOptions.length === 0 && (
              <p className="px-3.5 py-3 text-sm text-[#8f99a7]">Tidak ada kategori ditemukan</p>
            )}
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onSelect(option.id, option.value_param)
                  setIsOpen(false)
                  setSearch('')
                }}
                className="flex w-full items-center px-3.5 py-2.5 text-left text-sm text-[#20242d] hover:bg-[#f7f8fc]"
              >
                {option.value_param}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryField({
  control,
  setValue,
}: {
  control: Control<ProductFormValues>
  setValue: UseFormSetValue<ProductFormValues>
}) {
  return (
    <Controller
      control={control}
      name="category_id"
      rules={{ required: 'Kategori wajib diisi' }}
      render={({ field, fieldState }) => (
        <div className="flex w-full flex-col gap-1.5">
          <CategorySelect
            value={field.value}
            onSelect={(categoryId, categoryName) => {
              field.onChange(categoryId)
              setValue('category', categoryName)
            }}
          />
          {fieldState.error && (
            <p className="text-xs text-[#d32f2f]">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

type CurrencyFieldProps = {
  control: Control<ProductFormValues>
  name: 'cost_price' | 'sell_price'
  label: string
  required?: boolean
  rules?: RegisterOptions<ProductFormValues, 'cost_price' | 'sell_price'>
}

function CurrencyField({ control, name, label, required = false, rules }: CurrencyFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="flex w-full flex-col gap-1.5">
          <label className="flex items-center gap-[3px] text-[13px] font-medium text-[#20242d]">
            {label}
            {required && <RequiredMark />}
          </label>
          <TextField
            value={formatRupiah(field.value)}
            onChange={(e) => field.onChange(parseRupiah(e.target.value))}
            onBlur={field.onBlur}
            placeholder="0"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
              },
            }}
            sx={inputSx}
          />
        </div>
      )}
    />
  )
}

type ProductFormProps = {
  control: Control<ProductFormValues>
  setValue: UseFormSetValue<ProductFormValues>
  existingPhotoUrl?: string | null
}

export default function ProductForm({ control, setValue, existingPhotoUrl }: ProductFormProps) {
  return (
    <div className="flex w-full items-start gap-5">
      <div className="flex flex-1 min-w-0 flex-col gap-5">
        <SectionCard title="Informasi Dasar">
          <FormField
            control={control}
            name="name"
            label="Nama Produk"
            placeholder="Contoh: Kopi Americano"
            required
            rules={{ required: 'Nama produk wajib diisi' }}
          />

          <div className="flex items-start gap-3.5">
            <FormField
              control={control}
              name="sku"
              label="SKU"
              placeholder="SKU dibuat otomatis oleh sistem"
              disabled
            />
            <CategoryField control={control} setValue={setValue} />
          </div>

          <FormField
            control={control}
            name="description"
            label="Deskripsi Produk"
            placeholder="Tuliskan deskripsi singkat mengenai produk ini agar pelanggan dan tim lebih mudah memahaminya..."
            required
            multiline
            rows={3}
            rules={{ required: 'Deskripsi produk wajib diisi' }}
          />
        </SectionCard>

        <SectionCard title="Harga & Stok">
          <div className="flex items-start gap-3.5">
            <CurrencyField
              control={control}
              name="cost_price"
              label="Harga Beli (Modal)"
              required
              rules={{
                required: 'Harga beli wajib diisi',
                min: { value: 1, message: 'Harga beli wajib diisi' },
              }}
            />
            <CurrencyField
              control={control}
              name="sell_price"
              label="Harga Jual"
              required
              rules={{
                required: 'Harga jual wajib diisi',
                min: { value: 1, message: 'Harga jual wajib diisi' },
              }}
            />
          </div>

          <div className="flex items-start gap-3.5">
            <FormField
              control={control}
              name="stock"
              label="Stok Awal"
              placeholder="0"
              type="number"
              required
              rules={{
                required: 'Stok awal wajib diisi',
                min: { value: 0, message: 'Stok awal tidak boleh negatif' },
              }}
            />
            <FormField
              control={control}
              name="unit"
              label="Satuan"
              placeholder="pcs / porsi / gelas"
              required
              rules={{ required: 'Satuan wajib diisi' }}
            />
          </div>
        </SectionCard>
      </div>

      <div className="flex w-[340px] shrink-0 flex-col gap-5">
        <SectionCard title="Foto Produk">
          <ProductPhotoUpload control={control} existingPhotoUrl={existingPhotoUrl} />
        </SectionCard>

        <SectionCard title="Status Produk">
          <div className="flex w-full items-start justify-center gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-[13.5px] font-medium text-[#20242d]">Aktifkan Produk</p>
              <p className="text-xs leading-[1.4] text-[#8f99a7]">
                Produk akan langsung tersedia untuk dijual di Kasir setelah disimpan.
              </p>
            </div>
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
