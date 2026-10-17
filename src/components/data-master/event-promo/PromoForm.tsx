import InputAdornment from '@mui/material/InputAdornment'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useState, type ReactNode } from 'react'
import {
  Controller,
  useFormState,
  useWatch,
  type Control,
  type RegisterOptions,
  type UseFormSetValue,
} from 'react-hook-form'
import emptyPromoProducts from '../../../assets/empty-promo-products.png'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import PlusIcon from '../../../icon/PlusIcon'
import RadioSelectedIcon from '../../../icon/RadioSelectedIcon'
import {
  calculatePromoPrice,
  formatLongDate,
  formatPromoBenefit,
  formatPromoPeriod,
} from '../../../pages/data-master/event-promo/format'
import {
  PROMO_DISCOUNT_TYPE_DESCRIPTION,
  PROMO_DISCOUNT_TYPE_TITLE,
  type PromoDiscountType,
  type PromoFormValues,
  type PromoProduct,
} from '../../../pages/data-master/event-promo/types'
import { formatRupiah, formatRupiahWithPrefix, parseRupiah } from '../../../utils/currency'
import DateTimeInput from '../../global/DateTimeInput'
import PromoProductPickerDrawer from './PromoProductPickerDrawer'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    fontSize: '14px',
    '& fieldset': { borderColor: '#e9e9ea' },
    '&:hover fieldset': { borderColor: '#c7c9ce' },
    '&.Mui-focused fieldset': { borderColor: '#4e5bd6' },
  },
  '& .MuiOutlinedInput-input': { padding: '12px' },
  '& .MuiOutlinedInput-root.MuiInputBase-multiline': { padding: '12px' },
  '& .MuiOutlinedInput-input::placeholder': {
    color: '#8f99a7',
    opacity: 1,
  },
}

const DISCOUNT_TYPE_OPTIONS: { value: PromoDiscountType; title: string; description: string }[] = [
  {
    value: 'percentage',
    title: PROMO_DISCOUNT_TYPE_TITLE.percentage,
    description: PROMO_DISCOUNT_TYPE_DESCRIPTION.percentage,
  },
  {
    value: 'fixed',
    title: PROMO_DISCOUNT_TYPE_TITLE.fixed,
    description: PROMO_DISCOUNT_TYPE_DESCRIPTION.fixed,
  },
  {
    value: 'special_price',
    title: PROMO_DISCOUNT_TYPE_TITLE.special_price,
    description: PROMO_DISCOUNT_TYPE_DESCRIPTION.special_price,
  },
]

const DISCOUNT_FIELD_BY_TYPE: Record<PromoDiscountType, { label: string; placeholder: string }> = {
  percentage: { label: 'Diskon', placeholder: 'Masukkan presentase diskon (contoh : 20%)' },
  fixed: { label: 'Diskon', placeholder: 'Masukkan nominal diskon (contoh : 5.000)' },
  special_price: { label: 'Harga Spesial', placeholder: 'Masukkan harga spesial (contoh : 15.000)' },
}

function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <label className="flex items-center gap-1 text-sm leading-[1.4] font-medium text-[#20242d]">
      {label}
      {required && <span className="text-xs text-[#a72131]">*</span>}
    </label>
  )
}

type SectionCardProps = {
  title: string
  description?: string
  children: ReactNode
}

function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-[#e7e9ed] bg-white p-6">
      {description ? (
        <div className="flex w-full flex-col gap-1">
          <p className="text-lg leading-[1.4] font-semibold text-[#20242d]">{title}</p>
          <p className="text-sm leading-[1.4] text-[#8f99a7]">{description}</p>
        </div>
      ) : (
        <p className="text-lg leading-[1.4] font-semibold text-[#20242d]">{title}</p>
      )}
      {children}
    </div>
  )
}

type TextFieldKey = 'name' | 'description' | 'startDate' | 'endDate' | 'startTime' | 'endTime'

type FormFieldProps = {
  control: Control<PromoFormValues>
  name: TextFieldKey
  label: string
  placeholder?: string
  type?: 'text' | 'date' | 'time'
  /** Earliest selectable value for date/time fields */
  min?: string
  required?: boolean
  multiline?: boolean
  rules?: RegisterOptions<PromoFormValues, TextFieldKey>
}

function FormField({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  min,
  required = false,
  multiline = false,
  rules,
}: FormFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="flex w-full min-w-0 flex-col gap-2">
          <FieldLabel label={label} required={required} />
          {type === 'text' ? (
            <TextField
              {...field}
              placeholder={placeholder}
              fullWidth
              multiline={multiline}
              rows={multiline ? 4 : undefined}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{
                ...inputSx,
                ...(multiline && { '& .MuiOutlinedInput-input': { padding: 0, lineHeight: '18px' } }),
              }}
            />
          ) : (
            <>
              <DateTimeInput
                type={type}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={placeholder}
                min={min}
                hasError={!!fieldState.error}
                formatValue={type === 'date' ? formatLongDate : undefined}
              />
              {fieldState.error && <p className="text-xs text-[#d32f2f]">{fieldState.error.message}</p>}
            </>
          )}
        </div>
      )}
    />
  )
}

function RadioIndicator({ checked }: { checked: boolean }) {
  return checked ? (
    <RadioSelectedIcon size={16} className="shrink-0" />
  ) : (
    <span className="size-4 shrink-0 rounded-full border border-[#cbced2] bg-white" />
  )
}

function ProductInfo({ product }: { product: PromoProduct }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      {product.photoUrl ? (
        <img src={product.photoUrl} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
      ) : (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f1f5]">
          <DynamicLucideIcon name="package" size={18} className="text-[#8f99a7]" />
        </span>
      )}
      <div className="flex min-w-0 flex-col gap-0.5 leading-[1.4]">
        <p className="text-sm font-semibold text-[#20242d]">{product.name}</p>
        <p className="flex items-center gap-[5px] text-xs whitespace-nowrap text-[#8f99a7]">
          {product.category}
          <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
          {formatRupiahWithPrefix(product.price)}
        </p>
      </div>
    </div>
  )
}

function ProductsSection({ control }: { control: Control<PromoFormValues> }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  return (
    <Controller
      control={control}
      name="products"
      rules={{ validate: (value) => value.length > 0 || 'Pilih minimal 1 produk' }}
      render={({ field, fieldState }) => (
        <SectionCard
          title="Produk yang Dipromosikan"
          description="Pilih produk yang akan mendapatkan promo ini"
        >
          <p className="text-sm leading-[1.4] font-semibold text-[#4e5bd6]">{field.value.length} Produk</p>

          {field.value.length === 0 ? (
            <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border border-[#ebedf1] bg-white py-6">
              <img src={emptyPromoProducts} alt="" className="h-[200px] w-[300px] object-cover" />
              <div className="flex flex-col items-center gap-2 leading-[1.4]">
                <p className="text-base font-semibold whitespace-nowrap text-[#20242d]">
                  Belum ada produk yang dipilih
                </p>
                <p className="w-[320px] text-center text-xs text-[#6a7789]">
                  Tambahkan produk untuk mendapatkan promo ini
                </p>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[#ebedf1] bg-white">
              {field.value.map((product, index) => (
                <div
                  key={product.id}
                  className={`flex w-full items-center gap-3 px-4 py-3 ${index % 2 === 1 ? 'bg-[#fafafb]' : 'bg-white'}`}
                >
                  <ProductInfo product={product} />
                  <button
                    type="button"
                    onClick={() => field.onChange(field.value.filter((item) => item.id !== product.id))}
                    className="flex size-6 items-center justify-center rounded-md text-[#8f99a7] hover:bg-[#f0f1f5]"
                  >
                    <DynamicLucideIcon name="x" size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {fieldState.error && <p className="text-xs text-[#d32f2f]">{fieldState.error.message}</p>}

          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="flex h-9 w-fit items-center justify-center gap-1 rounded-lg border border-[#4e5bd6] bg-[#fdfeff] px-4 py-2 hover:bg-[#f7f8fc]"
          >
            <PlusIcon size={18} className="text-[#4e5bd6]" />
            <span className="text-sm leading-[1.4] font-semibold whitespace-nowrap text-[#4e5bd6]">
              Tambah Produk
            </span>
          </button>

          <PromoProductPickerDrawer
            open={isPickerOpen}
            selected={field.value}
            onClose={() => setIsPickerOpen(false)}
            onConfirm={(selected) => {
              field.onChange(selected)
              setIsPickerOpen(false)
            }}
          />
        </SectionCard>
      )}
    />
  )
}

type DiscountRulesSectionProps = {
  control: Control<PromoFormValues>
  setValue: UseFormSetValue<PromoFormValues>
}

function SpecialPriceList({ control }: { control: Control<PromoFormValues> }) {
  const products = useWatch({ control, name: 'products' })
  const { errors } = useFormState({ control, name: 'specialPrices' })

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-2 leading-[1.4]">
        <p className="text-xs font-medium text-[#20242d]">Harga Spesial</p>
        <p className="text-sm text-[#8f99a7]">Tentukan harga khusus untuk setiap produk yang dipilih.</p>
      </div>

      {products.length === 0 ? (
        <p className="w-full rounded-xl border border-dashed border-[#ebedf1] py-6 text-center text-sm text-[#8f99a7]">
          Pilih produk terlebih dahulu untuk menentukan harga spesial
        </p>
      ) : (
        <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[#ebedf1] bg-white">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`flex w-full items-center justify-between gap-3 px-4 py-3 ${index % 2 === 1 ? 'bg-[#fafafb]' : 'bg-white'}`}
            >
              <ProductInfo product={product} />

              <Controller
                control={control}
                name={`specialPrices.${product.id}`}
                rules={{
                  validate: (value, formValues) =>
                    formValues.discountType !== 'special_price' || (value ?? 0) > 0 || 'Harga spesial wajib diisi',
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    value={formatRupiah(field.value ?? 0)}
                    onChange={(e) => field.onChange(parseRupiah(e.target.value))}
                    onBlur={field.onBlur}
                    placeholder="0"
                    error={!!fieldState.error}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start" sx={{ color: '#4d5057' }}>
                            Rp
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ ...inputSx, width: '116px', flexShrink: 0 }}
                  />
                )}
              />
            </div>
          ))}
        </div>
      )}

      {errors.specialPrices && (
        <p className="text-xs text-[#d32f2f]">Harga spesial semua produk wajib diisi</p>
      )}
    </div>
  )
}

function PromoPreview({ control }: { control: Control<PromoFormValues> }) {
  const [products, discountType, discountValue, specialPrices] = useWatch({
    control,
    name: ['products', 'discountType', 'discountValue', 'specialPrices'],
  })

  // The value the promo applies to a product: its own special price, or the shared discount
  const getAppliedValue = (product: PromoProduct) =>
    discountType === 'special_price' ? (specialPrices[product.id] ?? 0) : discountValue

  const previewProducts = products.filter((product) => getAppliedValue(product) > 0)
  if (previewProducts.length === 0) return null

  const benefit = formatPromoBenefit(discountType, discountValue)

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-xs leading-[1.4] font-medium text-[#20242d]">Preview Promo</p>

      <div className="flex max-h-[320px] w-full flex-wrap gap-3 overflow-y-auto">
        {previewProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-2 rounded-xl border border-[#c9e8d4] bg-[#e9f6f1] px-4 py-3"
          >
            {product.photoUrl ? (
              <img src={product.photoUrl} alt="" className="size-12 shrink-0 rounded-[10px] object-cover" />
            ) : (
              <span className="flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-white/60">
                <DynamicLucideIcon name="package" size={20} className="text-[#8f99a7]" />
              </span>
            )}

            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-1 whitespace-nowrap">
                <span className="text-sm leading-[1.4] font-semibold text-[#20242d]">{product.name}</span>
                <span className="text-xs leading-[1.4] font-semibold text-[#149042]">
                  <span className="text-[#20242d]">(</span>
                  {benefit}
                  <span className="text-[#20242d]">)</span>
                </span>
              </p>
              <p className="flex items-end gap-1 text-xs leading-[1.4] whitespace-nowrap">
                <span className="text-[#8f99a7] line-through">{formatRupiahWithPrefix(product.price)}</span>
                <DynamicLucideIcon name="arrow-right" size={16} className="text-[#149042]" />
                <span className="font-semibold text-[#149042]">
                  {formatRupiahWithPrefix(calculatePromoPrice(product.price, discountType, getAppliedValue(product)))}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DiscountRulesSection({ control, setValue }: DiscountRulesSectionProps) {
  const discountType = useWatch({ control, name: 'discountType' })
  const isPercentage = discountType === 'percentage'
  const isSpecialPrice = discountType === 'special_price'
  const { label, placeholder } = DISCOUNT_FIELD_BY_TYPE[discountType]

  return (
    <SectionCard
      title="Aturan Promo"
      description="Tentukan keuntungan promo yang akan diterapkan pada produk yang dipilih"
    >
      <div className="flex w-full flex-col gap-2">
        <FieldLabel label="Jenis Promo" required />
        <Controller
          control={control}
          name="discountType"
          render={({ field }) => (
            <div role="radiogroup" className="flex w-full items-start gap-4">
              {DISCOUNT_TYPE_OPTIONS.map((option) => {
                const isSelected = field.value === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      if (isSelected) return
                      field.onChange(option.value)
                      setValue('discountValue', 0)
                    }}
                    className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl border p-4 text-left ${
                      isSelected ? 'border-[#9aa3ff] bg-[#edeffb]' : 'border-[#eceef0] bg-[#fdfeff] hover:bg-[#f7f8fc]'
                    }`}
                  >
                    <RadioIndicator checked={isSelected} />
                    <span className="flex min-w-0 flex-col gap-0.5 leading-[1.4]">
                      <span className="text-sm font-semibold text-[#20242d]">{option.title}</span>
                      <span className="text-xs text-[#8f99a7]">{option.description}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        />
      </div>

      {isSpecialPrice ? (
        <SpecialPriceList control={control} />
      ) : (
        <Controller
          control={control}
          name="discountValue"
          rules={{
            validate: (value, formValues) => {
              if (formValues.discountType === 'special_price') return true
              if (!value || value <= 0) return `${DISCOUNT_FIELD_BY_TYPE[formValues.discountType].label} wajib diisi`
              if (formValues.discountType === 'percentage' && value > 100) return 'Diskon maksimal 100%'
              return true
            },
          }}
          render={({ field, fieldState }) => (
            <div className="flex w-full flex-col gap-2">
              <FieldLabel label={label} required />
              <TextField
                value={isPercentage ? (field.value ? String(field.value) : '') : formatRupiah(field.value)}
                onChange={(e) => field.onChange(parseRupiah(e.target.value))}
                onBlur={field.onBlur}
                placeholder={placeholder}
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{
                  input: isPercentage
                    ? { endAdornment: <InputAdornment position="end">%</InputAdornment> }
                    : { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
                }}
                sx={inputSx}
              />
            </div>
          )}
        />
      )}

      <PromoPreview control={control} />
    </SectionCard>
  )
}

type PeriodSectionProps = {
  control: Control<PromoFormValues>
  originalStartDate?: string
}

function PeriodSection({ control, originalStartDate }: PeriodSectionProps) {
  const minStartDate = new Date().toLocaleDateString('en-CA')
  const [useTime, startDate] = useWatch({ control, name: ['useTime', 'startDate'] })

  // The end date can never be earlier than the start date (or, until a start date is set, the earliest allowed start)
  const minEndDate = startDate || minStartDate

  return (
    <SectionCard title="Periode Promo">
      <div className="flex w-full items-start gap-4">
        <FormField
          control={control}
          name="startDate"
          label="Tanggal Mulai"
          type="date"
          placeholder="DD/MM/YYYY"
          min={minStartDate}
          required
          rules={{
            required: 'Tanggal mulai wajib diisi',
            // A promo that already started keeps its original start date as long as it isn't changed
            validate: (value) =>
              value >= minStartDate || value === originalStartDate || 'Tanggal mulai tidak boleh sebelum hari ini',
            // Re-check the end date whenever the start date changes
            deps: ['endDate'],
          }}
        />
        <FormField
          control={control}
          name="endDate"
          label="Tanggal Berakhir"
          type="date"
          placeholder="DD/MM/YYYY"
          min={minEndDate}
          required
          rules={{
            required: 'Tanggal berakhir wajib diisi',
            validate: (value, formValues) =>
              value >= (formValues.startDate || minStartDate) ||
              (formValues.startDate
                ? 'Tanggal berakhir tidak boleh sebelum tanggal mulai'
                : 'Tanggal berakhir tidak boleh sebelum hari ini'),
          }}
        />
      </div>

      <div className="flex w-full items-center gap-2">
        <Controller
          control={control}
          name="useTime"
          render={({ field }) => (
            <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          )}
        />
        <p className="text-sm leading-[normal] font-medium whitespace-nowrap text-[#20242d]">Atur Jam Promo</p>
      </div>

      {useTime && (
        <div className="flex w-full items-start gap-4">
          <FormField
            control={control}
            name="startTime"
            label="Jam Mulai"
            type="time"
            placeholder="00:00"
            required
            rules={{ validate: (value) => !!value || 'Jam mulai wajib diisi' }}
          />
          <FormField
            control={control}
            name="endTime"
            label="Jam Berakhir"
            type="time"
            placeholder="00:00"
            required
            rules={{
              validate: (value, formValues) => {
                if (!value) return 'Jam berakhir wajib diisi'
                if (formValues.startDate === formValues.endDate && formValues.startTime && value <= formValues.startTime) {
                  return 'Jam berakhir harus setelah jam mulai'
                }
                return true
              },
            }}
          />
        </div>
      )}
    </SectionCard>
  )
}

function SummaryItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-1 leading-[1.4]">
      <p className="text-xs text-[#6a7789]">{label}</p>
      {children}
    </div>
  )
}

function PromoSummarySection({ control }: { control: Control<PromoFormValues> }) {
  const [name, products, discountType, discountValue, startDate, endDate, useTime, startTime, endTime, specialPrices] = useWatch({
    control,
    name: [
      'name',
      'products',
      'discountType',
      'discountValue',
      'startDate',
      'endDate',
      'useTime',
      'startTime',
      'endTime',
      'specialPrices',
    ],
  })

  const hasBenefit =
    discountType === 'special_price'
      ? products.every((product) => (specialPrices[product.id] ?? 0) > 0)
      : discountValue > 0
  const isComplete = name.trim() && products.length > 0 && hasBenefit && startDate && endDate
  if (!isComplete) return null

  const benefit = formatPromoBenefit(discountType, discountValue)
  const timeRange = useTime && startTime && endTime ? `, ${startTime} – ${endTime}` : ''

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-[#dde0f6] bg-[#f2f3fd] p-6">
      <p className="text-lg leading-[1.4] font-semibold text-[#20242d]">Ringkasan Promo</p>

      <div className="flex w-full items-start gap-4">
        <div className="flex w-[185px] shrink-0 flex-col gap-5">
          <SummaryItem label="Nama Promo">
            <p className="text-sm font-semibold text-[#20242d]">{name.trim()}</p>
          </SummaryItem>
          <SummaryItem label="Aturan">
            <p className="text-sm font-semibold text-[#149042]">{benefit}</p>
          </SummaryItem>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <SummaryItem label="Produk">
            <p className="text-sm font-semibold text-[#20242d]">{products.length} Produk</p>
            <p className="text-xs text-[#4d5057]">{products.map((product) => product.name).join(', ')}</p>
          </SummaryItem>
          <SummaryItem label="Periode">
            <p className="text-[15px] leading-[normal] font-semibold text-[#20242d]">
              {formatPromoPeriod(startDate, endDate)}
              {timeRange}
            </p>
          </SummaryItem>
        </div>
      </div>
    </div>
  )
}

type PromoFormProps = {
  control: Control<PromoFormValues>
  setValue: UseFormSetValue<PromoFormValues>
  /** Start date the promo already has (when editing), which stays valid even if it is before today */
  originalStartDate?: string
}

export default function PromoForm({ control, setValue, originalStartDate }: PromoFormProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <SectionCard title="Informasi Promo">
        <FormField
          control={control}
          name="name"
          label="Nama Promo"
          placeholder="Masukkan nama promo (contoh : Weekend Hemat)"
          required
          rules={{ required: 'Nama promo wajib diisi' }}
        />
        <FormField
          control={control}
          name="description"
          label="Deskripsi"
          placeholder="Masukkan deskripsi promo..."
          multiline
        />
      </SectionCard>

      <ProductsSection control={control} />

      <DiscountRulesSection control={control} setValue={setValue} />

      <PeriodSection control={control} originalStartDate={originalStartDate} />

      <PromoSummarySection control={control} />
    </div>
  )
}
