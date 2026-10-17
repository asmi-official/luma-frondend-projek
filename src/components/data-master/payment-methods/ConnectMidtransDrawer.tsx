import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import CloseIcon from '../../../icon/CloseIcon'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'

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
  return <span className="text-[12px] font-semibold text-[#a72131]">*</span>
}

type MidtransFormValues = {
  merchantId: string
  clientKey: string
  serverKey: string
}

const emptyValues: MidtransFormValues = {
  merchantId: '',
  clientKey: '',
  serverKey: '',
}

const TUTORIAL_STEPS = [
  {
    title: 'Login ke Midtrans',
    description: 'Masuk ke Midtrans Merchant Administration Portal menggunakan akun Anda.',
    action: { label: 'Buka Midtrans', href: 'https://midtrans.com' },
  },
  {
    title: 'Pilih Environment',
    description: 'Buka Settings, lalu pilih Access Keys.',
  },
  {
    title: 'Pastikan Environment Production',
    description: 'Pastikan Anda berada pada environment Production sebelum menyalin credential.',
  },
  {
    title: 'Salin credential',
    description: 'Salin Merchant ID, Client Key, dan Server Key ke form koneksi Luma.',
  },
  {
    title: 'Jaga Server Key',
    description: 'Server Key merupakan credential rahasia. Jangan membagikannya kepada pihak lain.',
  },
]

export type { MidtransFormValues }

type ConnectMidtransDrawerProps = {
  open: boolean
  onClose: () => void
  onSubmit: (values: MidtransFormValues) => void
  isSubmitting?: boolean
  serverError?: string | null
  existingData?: { merchantId: string; clientKey: string } | null
}

export default function ConnectMidtransDrawer({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  serverError,
  existingData,
}: ConnectMidtransDrawerProps) {
  const isEditMode = !!existingData
  const [isServerKeyVisible, setIsServerKeyVisible] = useState(false)
  const { control, handleSubmit, reset } = useForm<MidtransFormValues>({
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (!open) return
    reset(existingData ? { ...existingData, serverKey: '' } : emptyValues)
  }, [open, existingData, reset])

  const handleClose = () => {
    reset(emptyValues)
    onClose()
  }

  const submit = (values: MidtransFormValues) => {
    onSubmit(values)
    reset(emptyValues)
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      slotProps={{ paper: { sx: { width: '420px' } } }}
    >
      <form
        onSubmit={handleSubmit(submit)}
        className="flex h-full w-full flex-col items-start bg-white"
      >
        <div className="flex w-full items-start justify-between border-b border-[#eceef0] px-5 py-[18px]">
          <p className="text-base leading-[1.4] font-semibold text-[#20242d]">
            {isEditMode ? 'Perbarui Midtrans' : 'Hubungkan Midtrans'}
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="flex size-[18px] shrink-0 items-center justify-center text-[#6a7789]"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="flex w-full flex-1 flex-col items-start gap-6 overflow-y-auto px-5 py-6">
          {serverError && (
            <div className="flex w-full items-start gap-2 rounded-xl border border-[#ffecf0] bg-[#fce9ea] px-3.5 py-3">
              <DynamicLucideIcon name="triangle-alert" size={16} className="mt-0.5 shrink-0 text-[#d1293d]" />
              <p className="text-xs text-[#d1293d]">{serverError}</p>
            </div>
          )}

          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full flex-col items-start gap-1">
              <p className="text-sm font-semibold text-[#20242d]">Access Key</p>
              <p className="text-xs text-[#8f99a7]">
                Masukkan credential dari Midtrans Merchant Administration Portal.
              </p>
            </div>

            <Controller
              control={control}
              name="merchantId"
              rules={{ required: 'Merchant ID wajib diisi' }}
              render={({ field, fieldState }) => (
                <div className="flex w-full flex-col gap-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-[#20242d]">
                    Merchant ID
                    <RequiredMark />
                  </label>
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Masukkan Merchant ID"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message ?? 'Merchant ID dapat ditemukan di halaman Access Keys Midtrans'}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <DynamicLucideIcon name="store" size={18} className="text-[#8f99a7]" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={inputSx}
                  />
                </div>
              )}
            />

            <Controller
              control={control}
              name="clientKey"
              rules={{ required: 'Client Key wajib diisi' }}
              render={({ field, fieldState }) => (
                <div className="flex w-full flex-col gap-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-[#20242d]">
                    Client Key
                    <RequiredMark />
                  </label>
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Masukkan Client Key"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message ?? 'Digunakan untuk kebutuhan integrasi sisi client'}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <DynamicLucideIcon name="shield" size={18} className="text-[#8f99a7]" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={inputSx}
                  />
                </div>
              )}
            />

            <Controller
              control={control}
              name="serverKey"
              rules={{ required: 'Server Key wajib diisi' }}
              render={({ field, fieldState }) => (
                <div className="flex w-full flex-col gap-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-[#20242d]">
                    Server Key
                    <RequiredMark />
                  </label>
                  <TextField
                    {...field}
                    fullWidth
                    type={isServerKeyVisible ? 'text' : 'password'}
                    placeholder="Masukkan Server Key"
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error?.message ??
                      'Server Key bersifat rahasia. Jangan bagikan credential ini kepada orang lain'
                    }
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <DynamicLucideIcon name="shield" size={18} className="text-[#8f99a7]" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setIsServerKeyVisible((prev) => !prev)}
                              edge="end"
                              size="small"
                            >
                              <DynamicLucideIcon
                                name={isServerKeyVisible ? 'eye' : 'eye-off'}
                                size={18}
                                className="text-[#8f99a7]"
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={inputSx}
                  />
                </div>
              )}
            />
          </div>

          <div className="h-px w-full bg-[#e7e9ed]" />

          <div className="flex w-full flex-col items-start gap-3">
            <p className="w-full text-base font-semibold text-[#20242d]">
              Cara Mendapatkan Access Key Midtrans
            </p>

            <div className="flex w-full flex-col items-start gap-4">
              {TUTORIAL_STEPS.map((step, index) => (
                <div key={step.title} className="flex w-full items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#edeffb] text-xs font-semibold text-[#4e5bd6]">
                    {index + 1}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                    <p className="text-sm font-semibold text-[#20242d]">{step.title}</p>
                    <p className="text-xs text-[#8f99a7]">{step.description}</p>
                    {step.action && (
                      <a
                        href={step.action.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-0.5 text-xs font-semibold text-[#4e5bd6]"
                      >
                        {step.action.label}
                        <DynamicLucideIcon name="arrow-up-right" size={16} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://docs.midtrans.com"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center gap-2 rounded-xl bg-[#f7f8fc] px-4 py-2"
            >
              <span className="flex-1 text-xs font-semibold text-[#4e5bd6]">
                Pelajari selengkapnya di dokumentasi Midtrans
              </span>
              <DynamicLucideIcon name="arrow-up-right" size={16} className="text-[#4e5bd6]" />
            </a>
          </div>
        </div>

        <div className="flex w-full items-start gap-3 border-t border-[#e7e9ed] px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="h-9 flex-1 rounded-lg border border-[#4e5bd6] text-sm font-semibold text-[#4e5bd6] hover:bg-[#f7f8fc]"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-9 flex-1 rounded-lg bg-[#4e5bd6] text-sm font-semibold text-[#fdfeff] hover:bg-[#3f4bc0] disabled:opacity-70"
          >
            {isSubmitting
              ? isEditMode
                ? 'Menyimpan...'
                : 'Menghubungkan...'
              : isEditMode
                ? 'Simpan Perubahan'
                : 'Hubungkan'}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
