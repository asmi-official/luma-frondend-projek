import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useFlexParams } from '../../../api/flexParams'
import {
  useCreateRoleMenuPermission,
  useUpdateRoleMenuPermission,
  type RoleMenuPermission,
} from '../../../api/role-menu-permision'
import CloseIcon from '../../../icon/CloseIcon'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import type { RoleFormValues } from '../../../pages/data-master/role-management/types'
import ColorPicker from './ColorPicker'
import IconPicker from './IconPicker'

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

const emptyValues: RoleFormValues = {
  name: '',
  description: '',
  icon: 'user-round',
  color: '#4e5bd6',
  menuAccess: [],
}

function toFormValues(role: RoleMenuPermission): RoleFormValues {
  return {
    name: role.value_param,
    description: role.description ?? '',
    icon: role.icon ?? 'user-round',
    color: role.color_icon ?? '#4e5bd6',
    menuAccess: role.menus.map((menu) => menu.value_param),
  }
}

type CreateRoleModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (values: RoleFormValues) => void
  roleToEdit?: RoleMenuPermission | null
}

export default function CreateRoleModal({ open, onClose, onSubmit, roleToEdit }: CreateRoleModalProps) {
  const isEditMode = !!roleToEdit
  const { control, handleSubmit, watch, reset } = useForm<RoleFormValues>({ defaultValues: emptyValues })

  const icon = watch('icon')
  const color = watch('color')

  useEffect(() => {
    if (!open) return
    reset(roleToEdit ? toFormValues(roleToEdit) : emptyValues)
  }, [open, roleToEdit, reset])

  const { data } = useFlexParams({
    filter: [
      { key: 'type_param', operator: 'equal', value: 'MENU_APP_LUMA' },
      { key: 'active', operator: 'equal', value: true },
      { key: 'level', operator: 'equal', value: 2 },
    ],
    limit: 100,
  })
  const menuRows = (data?.data ?? []).filter((row) => row.header_id !== null)
  const menuOptions = menuRows.map((row) => row.value_param)

  const createRoleMenuPermissionMutation = useCreateRoleMenuPermission()
  const updateRoleMenuPermissionMutation = useUpdateRoleMenuPermission()
  const isSubmitting = createRoleMenuPermissionMutation.isPending || updateRoleMenuPermissionMutation.isPending

  const handleClose = () => {
    reset(emptyValues)
    onClose()
  }

  const submit = (values: RoleFormValues) => {
    const flexParamMenuIds = menuRows
      .filter((row) => values.menuAccess.includes(row.value_param))
      .map((row) => row.id)

    const onSuccess = () => {
      onSubmit(values)
      reset(emptyValues)
    }

    if (isEditMode && roleToEdit) {
      updateRoleMenuPermissionMutation.mutate(
        {
          flex_param_role_id: roleToEdit.id,
          role_name: values.name,
          flex_param_menu_id: flexParamMenuIds,
          description: values.description,
          icon: values.icon,
          color_icon: values.color,
          color_bg_icon: `${values.color}1a`,
        },
        { onSuccess },
      )
      return
    }

    createRoleMenuPermissionMutation.mutate(
      {
        flex_param_menu_id: flexParamMenuIds,
        role_name: values.name,
        description: values.description,
        icon: values.icon,
        color_icon: values.color,
        color_bg_icon: `${values.color}1a`,
        active: true,
      },
      { onSuccess },
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
            <DynamicLucideIcon name="shield" size={20} className="text-[#4e5bd6]" />
          </span>
          <div className="flex flex-1 flex-col items-start">
            <p className="text-lg font-semibold leading-[1.4] text-[#20242d]">
              {isEditMode ? 'Ubah Role' : 'Tambah Role'}
            </p>
            <p className="text-sm leading-[1.4] text-[#8f99a7]">
              {isEditMode ? 'Perbarui peran dan hak akses' : 'Tentukan role baru dan hak aksesnya'}
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
            rules={{ required: 'Nama role wajib diisi' }}
            render={({ field, fieldState }) => (
              <div className="flex w-full flex-col gap-2">
                <label className="flex items-center gap-1 text-sm font-medium text-[#20242d]">
                  Nama Role
                  <RequiredMark />
                </label>
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Masukkan nama role (contoh : manager)"
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
                  placeholder="Jelaskan tanggung jawab role (contoh: Kelola operasional dan produk)"
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
            name="menuAccess"
            rules={{ validate: (value) => value.length > 0 || 'Pilih minimal 1 akses menu' }}
            render={({ field, fieldState }) => (
              <div className="flex w-full flex-col items-start gap-2">
                <label className="flex items-center gap-1 text-xs font-medium text-[#20242d]">
                  Akses Menu
                  <RequiredMark />
                </label>
                <div className="flex flex-wrap items-start gap-2">
                  {menuOptions.map((menu) => {
                    const isActive = field.value.includes(menu)
                    return (
                      <button
                        key={menu}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            isActive
                              ? field.value.filter((item) => item !== menu)
                              : [...field.value, menu],
                          )
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap ${isActive ? 'bg-[#edeffb] text-[#4e5bd6]' : 'bg-[#f2f2f2] text-[#8f99a7]'
                          }`}
                      >
                        {menu}
                      </button>
                    )
                  })}
                </div>
                {fieldState.error && (
                  <p className="text-xs text-[#a72131]">{fieldState.error.message}</p>
                )}
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
