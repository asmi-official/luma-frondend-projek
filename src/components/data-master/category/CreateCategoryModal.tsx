import Dialog from '@mui/material/Dialog'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { isAxiosError } from 'axios'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useCreateFlexParam, useUpdateFlexParam } from '../../../api/flexParams'
import CloseIcon from '../../../icon/CloseIcon'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import type { Category, CategoryFormValues } from '../../../pages/data-master/category/types'
import ColorPicker from '../role-management/ColorPicker'
import IconPicker from '../role-management/IconPicker'

const CATEGORY_TYPE_PARAM = 'CATEGORY_OWNER'

type ServerFieldError = {
  field: string
  message: string
}

type ServerErrorResponse = {
  message?: string
  errors?: ServerFieldError[]
}

const fieldNameMap: Record<string, keyof CategoryFormValues> = {
  value_param: 'name',
  description: 'description',
  icon: 'icon',
  color_icon: 'color',
  active: 'active',
}

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

const emptyValues: CategoryFormValues = {
  name: '',
  description: '',
  icon: 'tags',
  color: '#4e5bd6',
  active: true,
}

function toFormValues(category: Category): CategoryFormValues {
  return {
    name: category.name,
    description: category.description,
    icon: category.icon,
    color: category.colorIcon,
    active: category.active,
  }
}

type CreateCategoryModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (values: CategoryFormValues) => void
  categoryToEdit?: Category | null
  isSubmitting?: boolean
}

export default function CreateCategoryModal({
  open,
  onClose,
  onSubmit,
  categoryToEdit,
  isSubmitting = false,
}: CreateCategoryModalProps) {
  const isEditMode = !!categoryToEdit
  const { control, handleSubmit, watch, reset, setError } = useForm<CategoryFormValues>({
    defaultValues: emptyValues,
  })

  const icon = watch('icon')
  const color = watch('color')

  const createFlexParamMutation = useCreateFlexParam()
  const updateFlexParamMutation = useUpdateFlexParam()
  const isPending = isSubmitting || createFlexParamMutation.isPending || updateFlexParamMutation.isPending

  useEffect(() => {
    if (!open) return
    reset(categoryToEdit ? toFormValues(categoryToEdit) : emptyValues)
  }, [open, categoryToEdit, reset])

  const handleClose = () => {
    reset(emptyValues)
    onClose()
  }

  const handleMutationError = (error: unknown) => {
    if (!isAxiosError(error)) return
    const data = error.response?.data as ServerErrorResponse | undefined

    if (data?.errors?.length) {
      data.errors.forEach(({ field, message }) => {
        const formField = fieldNameMap[field]
        if (formField) {
          setError(formField, { type: 'server', message })
        }
      })
      return
    }

    if (data?.message) {
      setError('name', { type: 'server', message: data.message })
    }
  }

  const submit = (values: CategoryFormValues) => {
    const onSuccess = () => {
      onSubmit(values)
      reset(emptyValues)
    }

    if (isEditMode) {
      updateFlexParamMutation.mutate(
        {
          id: categoryToEdit.id,
          value_param: values.name,
          description: values.description,
          icon: values.icon,
          color_icon: values.color,
          color_bg_icon: `${values.color}1a`,
          active: values.active,
        },
        { onSuccess, onError: handleMutationError },
      )
      return
    }

    createFlexParamMutation.mutate(
      {
        type_param: CATEGORY_TYPE_PARAM,
        value_param: values.name,
        description: values.description,
        icon: values.icon,
        color_icon: values.color,
        color_bg_icon: `${values.color}1a`,
        active: values.active,
      },
      { onSuccess, onError: handleMutationError },
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      slotProps={{ paper: { sx: { borderRadius: '24px', width: '599px', maxWidth: '599px' } } }}
    >
      <form onSubmit={handleSubmit(submit)} className="flex w-full flex-col items-start">
        <div className="flex w-full items-start gap-3 border-b border-[#f0f1f5] p-6">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: '#edeffb' }}
          >
            <DynamicLucideIcon name="tags" size={20} className="text-[#4e5bd6]" />
          </span>
          <div className="flex flex-1 flex-col items-start">
            <p className="text-lg font-semibold leading-[1.4] text-[#20242d]">
              {isEditMode ? 'Ubah Kategori' : 'Tambah Kategori'}
            </p>
            <p className="text-sm leading-[1.4] text-[#8f99a7]">
              {isEditMode ? 'Perbarui detail kategori' : 'Tambahkan kategori baru untuk katalog Anda'}
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

        <div className="flex max-h-[70vh] w-full flex-col items-start gap-5 overflow-y-auto p-6">
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Nama kategori wajib diisi' }}
            render={({ field, fieldState }) => (
              <div className="flex w-full flex-col gap-2">
                <label className="flex items-center gap-1 text-sm font-medium text-[#20242d]">
                  Nama Kategori
                  <RequiredMark />
                </label>
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Masukkan nama kategori (contoh: Kopi)"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={inputSx}
                />
              </div>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <div className="flex w-full flex-col gap-2">
                <label className="text-sm font-medium text-[#20242d]">Deskripsi</label>
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Jelaskan cakupan kategori ini (contoh: Espresso, latte, dan seduhan)"
                  sx={inputSx}
                />
              </div>
            )}
          />

          <div className="flex w-full flex-col gap-2">
            <label className="text-xs font-medium text-[#20242d]">Ikon & Warna</label>
            <div className="flex w-full items-start gap-4">
              <div className="flex shrink-0 flex-col items-center gap-2">
                <span
                  className="flex size-14 items-center justify-center rounded-2xl border-[0.667px] border-[#eceef0]"
                  style={{ backgroundColor: `${color}1a` }}
                >
                  <DynamicLucideIcon name={icon} size={22} style={{ color }} />
                </span>
                <p className="text-[10px] font-medium text-[#8f99a7]">Preview</p>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                <Controller
                  control={control}
                  name="color"
                  render={({ field }) => <ColorPicker value={field.value} onChange={field.onChange} />}
                />
                <Controller
                  control={control}
                  name="icon"
                  render={({ field }) => (
                    <IconPicker value={field.value} onChange={field.onChange} color={color} />
                  )}
                />
              </div>
            </div>
          </div>

          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <div className="flex w-full items-start justify-between gap-3 rounded-xl bg-[#f7f8fc] p-4">
                <div className="flex flex-col items-start gap-1">
                  <p className="text-sm font-medium text-[#20242d]">Aktifkan Kategori</p>
                  <p className="text-xs leading-[1.4] text-[#8f99a7]">
                    Kategori akan langsung tersedia dipilih saat menambahkan produk.
                  </p>
                </div>
                <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
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
            disabled={isPending}
            className="h-10 flex-1 rounded-lg bg-[#4e5bd6] text-sm font-semibold text-[#fdfeff] hover:bg-[#3f4bc0] disabled:opacity-70"
          >
            {isPending ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Simpan'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
