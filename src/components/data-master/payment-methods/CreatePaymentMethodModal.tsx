import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useInfiniteFlexParams, type FlexParam } from '../../../api/flexParams'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import CloseIcon from '../../../icon/CloseIcon'
import type {
  PaymentMethod,
  PaymentMethodFormValues,
} from '../../../pages/data-master/payment-methods/types'
import { getPaymentMethodIconStyle } from './paymentMethodIconStyles'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    fontSize: '14px',
    '& fieldset': { borderColor: '#e9e9ea' },
    '&:hover fieldset': { borderColor: '#c7c9ce' },
    '&.Mui-focused fieldset': { borderColor: '#4e5bd6' },
  },
  '& .MuiOutlinedInput-input::placeholder': {
    color: '#8f99a7',
    opacity: 1,
  },
}

function RequiredMark() {
  return <span className="text-[13px] font-semibold text-[#a72131]">*</span>
}

const emptyValues: PaymentMethodFormValues = {
  flexParamId: '',
  name: '',
  description: '',
  icon: '',
}

function toFormValues(method: PaymentMethod): PaymentMethodFormValues {
  return {
    flexParamId: method.id,
    name: method.name,
    description: method.description,
    icon: method.icon,
  }
}

type PaymentMethodOptionSelectProps = {
  value: string
  onSelect: (option: FlexParam) => void
}

function PaymentMethodOptionSelect({ value, onSelect }: PaymentMethodOptionSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const { data } = useInfiniteFlexParams({
    filter: [{ key: 'type_param', operator: 'equal', value: 'PAYMENT_METHODS' }],
    limit: 50,
  })

  const options = data?.pages.flatMap((page) => page.data) ?? []
  const filteredOptions = search.trim()
    ? options.filter((option) => option.value_param.toLowerCase().includes(search.trim().toLowerCase()))
    : options

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
    <div ref={containerRef} className="relative flex w-full flex-col gap-2">
      <label className="flex items-center gap-1 text-sm font-medium text-[#20242d]">
        Nama Metode
        <RequiredMark />
      </label>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-[42px] w-full items-center justify-between rounded-xl border border-[#e9e9ea] px-3.5 text-left text-sm hover:border-[#c7c9ce]"
      >
        <span className={value ? 'text-[#20242d]' : 'text-[#8f99a7]'}>
          {value || 'Pilih metode pembayaran'}
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
              placeholder="Cari nama metode..."
              className="w-full rounded-lg border border-[#e9e9ea] px-3 py-2 text-sm text-[#20242d] placeholder:text-[#8f99a7] focus:border-[#4e5bd6] focus:outline-none"
            />
          </div>

          <div className="flex max-h-[220px] flex-col overflow-y-auto">
            {filteredOptions.length === 0 && (
              <p className="px-3.5 py-3 text-sm text-[#8f99a7]">Tidak ada metode ditemukan</p>
            )}
            {filteredOptions.map((option) => {
              const style = getPaymentMethodIconStyle(option.icon ?? '')
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onSelect(option)
                    setIsOpen(false)
                    setSearch('')
                  }}
                  className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-[#f7f8fc]"
                >
                  <span className="text-sm text-[#20242d]">{option.value_param}</span>
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: style.bg }}
                  >
                    <DynamicLucideIcon name={option.icon ?? 'credit-card'} size={16} style={{ color: style.color }} />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

type CreatePaymentMethodModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (values: PaymentMethodFormValues) => void
  methodToEdit?: PaymentMethod | null
  isSubmitting?: boolean
}

export default function CreatePaymentMethodModal({
  open,
  onClose,
  onSubmit,
  methodToEdit,
  isSubmitting = false,
}: CreatePaymentMethodModalProps) {
  const isEditMode = !!methodToEdit
  const { control, handleSubmit, reset, setValue, watch } = useForm<PaymentMethodFormValues>({
    defaultValues: emptyValues,
  })
  const selectedName = watch('name')

  useEffect(() => {
    if (!open) return
    reset(methodToEdit ? toFormValues(methodToEdit) : emptyValues)
  }, [open, methodToEdit, reset])

  const handleClose = () => {
    reset(emptyValues)
    onClose()
  }

  const submit = (values: PaymentMethodFormValues) => {
    onSubmit(values)
    reset(emptyValues)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      slotProps={{ paper: { sx: { borderRadius: '24px', width: '533px', maxWidth: '533px' } } }}
    >
      <form onSubmit={handleSubmit(submit)} className="flex w-full flex-col items-start">
        <div className="flex w-full items-start gap-3 border-b border-[#f0f1f5] p-6">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: '#edeffb' }}
          >
            <DynamicLucideIcon name="shield" size={20} className="text-[#4e5bd6]" />
          </span>
          <div className="flex flex-1 flex-col items-start">
            <p className="text-lg font-semibold leading-[1.4] text-[#20242d]">
              {isEditMode ? 'Ubah Metode' : 'Tambah Metode'}
            </p>
            <p className="text-sm leading-[1.4] text-[#8f99a7]">
              {isEditMode ? 'Perbarui detail metode pembayaran' : 'Tambahkan metode pembayaran baru'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-[#f7f8fc]"
          >
            <CloseIcon size={18} className="text-[#6a7789]" />
          </button>
        </div>

        <div className="flex w-full flex-col items-start gap-5 p-6">
          <Controller
            control={control}
            name="flexParamId"
            rules={{ required: 'Nama metode wajib dipilih' }}
            render={({ fieldState }) => (
              <div className="flex w-full flex-col gap-1">
                <PaymentMethodOptionSelect
                  value={selectedName}
                  onSelect={(option) => {
                    setValue('flexParamId', option.id, { shouldValidate: true })
                    setValue('name', option.value_param)
                    setValue('description', option.description ?? '')
                    setValue('icon', option.icon ?? '')
                  }}
                />
                {fieldState.error && (
                  <p className="text-xs text-[#d32f2f]">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <div className="flex w-full flex-col gap-2">
                <label className="flex items-center gap-1 text-sm font-medium text-[#20242d]">
                  Deskripsi
                </label>
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Jelaskan metode pembayaran (contoh: Scan QR semua e-wallet & bank)"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={inputSx}
                />
              </div>
            )}
          />
        </div>

        <div className="flex w-full items-center gap-3 border-t border-[#f0f1f5] p-6">
          <button
            type="button"
            onClick={handleClose}
            className="h-10 flex-1 rounded-lg border border-[#4e5bd6] text-sm font-semibold text-[#4e5bd6] hover:bg-[#f7f8fc]"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 flex-1 rounded-lg bg-[#4e5bd6] text-sm font-semibold text-[#fdfeff] hover:bg-[#3f4bc0] disabled:opacity-70"
          >
            {isSubmitting ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Simpan'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
