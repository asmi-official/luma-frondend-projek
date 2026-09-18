import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { Controller } from 'react-hook-form'

type AuthTextFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder: string
  type?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  isPassword?: boolean
  rules?: RegisterOptions<T, Path<T>>
}

export default function AuthTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  startIcon,
  endIcon,
  isPassword = false,
  rules,
}: AuthTextFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false)

  const resolvedEndIcon = isPassword ? (
    <IconButton
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      edge="end"
      size="small"
      tabIndex={-1}
    >
      {showPassword ? (
        <VisibilityOffOutlinedIcon sx={{ fontSize: 18, color: '#8f99a7' }} />
      ) : (
        <VisibilityOutlinedIcon sx={{ fontSize: 18, color: '#8f99a7' }} />
      )}
    </IconButton>
  ) : (
    endIcon
  )

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="flex w-full flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#20242d]">{label}</label>
          <TextField
            {...field}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            placeholder={placeholder}
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            slotProps={{
              input: {
                startAdornment: startIcon && (
                  <InputAdornment position="start">{startIcon}</InputAdornment>
                ),
                endAdornment: resolvedEndIcon && (
                  <InputAdornment position="end">{resolvedEndIcon}</InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                fontSize: '14px',
                '& fieldset': { borderColor: '#e9e9ea' },
                '&:hover fieldset': { borderColor: '#c7c9ce' },
                '&.Mui-focused fieldset': { borderColor: '#4e5bd6' },
              },
              '& .MuiOutlinedInput-input': {
                padding: '16px',
              },
              '& .MuiOutlinedInput-input::placeholder': {
                color: '#8f99a7',
                opacity: 1,
              },
            }}
          />
        </div>
      )}
    />
  )
}
