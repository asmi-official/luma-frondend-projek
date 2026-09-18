import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import type { ReactNode } from 'react'
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { ProductFormValues } from '../../pages/product/types'
import { formatRupiah, parseRupiah } from '../../utils/currency'
import ProductPhotoUpload from './ProductPhotoUpload'

const CATEGORY_OPTIONS = ['Minuman', 'Makanan', 'Snack', 'Lainnya']

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

function CategoryField({ control }: { control: Control<ProductFormValues> }) {
  return (
    <Controller
      control={control}
      name="category"
      rules={{ required: 'Kategori wajib diisi' }}
      render={({ field, fieldState }) => (
        <div className="flex w-full flex-col gap-1.5">
          <label className="flex items-center gap-[3px] text-[13px] font-medium text-[#20242d]">
            Kategori
            <RequiredMark />
          </label>
          <TextField
            {...field}
            select
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            slotProps={{
              select: {
                displayEmpty: true,
                renderValue: (v) => (
                  <span className={v ? 'text-[#20242d]' : 'text-[#8f99a7]'}>
                    {(v as string) || 'Pilih Kategori'}
                  </span>
                ),
              },
            }}
            sx={inputSx}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
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
}

export default function ProductForm({ control }: ProductFormProps) {
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
            <CategoryField control={control} />
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
          <ProductPhotoUpload control={control} />
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
