import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import Face6OutlinedIcon from '@mui/icons-material/Face6Outlined'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'
import AuthLayout from '../components/auth/AuthLayout'
import AuthTextField from '../components/auth/AuthTextField'
import { setAuthTokens } from '../lib/authToken'

type RegisterFormValues = {
  username: string
  company_name: string
  full_name: string
  phone: string
  email: string
  password: string
  agree: boolean
}

type ServerFieldError = {
  field: string
  message: string
}

type ServerErrorResponse = {
  message?: string
  errors?: ServerFieldError[]
}

const fieldNameMap: Record<string, keyof RegisterFormValues> = {
  username: 'username',
  company_name: 'company_name',
  full_name: 'full_name',
  phone: 'phone',
  email: 'email',
  password: 'password',
}

export default function Register() {
  const navigate = useNavigate()
  const { control, handleSubmit, setError } = useForm<RegisterFormValues>({
    defaultValues: {
      username: '',
      company_name: '',
      full_name: '',
      phone: '',
      email: '',
      password: '',
      agree: false,
    },
  })

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      setAuthTokens(response.data.access_token, response.data.refresh_token)
      navigate('/')
    },
    onError: (error) => {
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
        setError('email', { type: 'server', message: data.message })
      }
    },
  })

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate({
      username: values.username,
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      role: 'Owner',
      company_name: values.company_name,
      agree: values.agree,
    })
  }

  return (
    <AuthLayout
      eyebrow="Mulai Gratis Sekarang"
      title="Daftarkan bisnis Anda, kelola dengan cerdas."
      description="Pantau performa, dapatkan insight dari AI, dan kendalikan seluruh bisnis Anda dalam satu platform."
      formTitle="Buat akun baru"
      formSubtitle="Lengkapi data berikut untuk memulai perjalanan bisnis Anda"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <AuthTextField
          control={control}
          name="company_name"
          label="Nama Toko"
          placeholder="Masukkan nama toko Anda"
          startIcon={<StorefrontOutlinedIcon sx={{ fontSize: 16, color: '#8f99a7' }} />}
          rules={{ required: 'Nama toko wajib diisi' }}
        />

        <AuthTextField
          control={control}
          name="full_name"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap Anda"
          startIcon={<PersonOutlineIcon sx={{ fontSize: 16, color: '#8f99a7' }} />}
          rules={{ required: 'Nama lengkap wajib diisi' }}
        />

        <AuthTextField
          control={control}
          name="username"
          label="Username"
          placeholder="Masukkan username Anda"
          startIcon={<Face6OutlinedIcon sx={{ fontSize: 16, color: '#8f99a7' }} />}
          rules={{
            required: 'Username wajib diisi',
            pattern: {
              value: /^[a-zA-Z0-9._-]+$/,
              message: 'Username tidak boleh mengandung spasi atau simbol lain',
            },
          }}
        />

        <AuthTextField
          control={control}
          name="phone"
          label="Nomor Telepon / WhatsApp"
          placeholder="Masukkan nomor telepon / whatsapp Anda"
          type="tel"
          startIcon={<PhoneOutlinedIcon sx={{ fontSize: 16, color: '#8f99a7' }} />}
          rules={{
            required: 'Nomor telepon / WhatsApp wajib diisi',
            pattern: {
              value: /^[0-9+()\s-]{8,}$/,
              message: 'Format nomor telepon tidak valid',
            },
          }}
        />

        <AuthTextField
          control={control}
          name="email"
          label="Email"
          placeholder="Masukkan email Anda"
          type="email"
          startIcon={<EmailOutlinedIcon sx={{ fontSize: 16, color: '#8f99a7' }} />}
          rules={{
            required: 'Email wajib diisi',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Format email tidak valid',
            },
          }}
        />

        <div className="flex flex-col gap-2">
          <AuthTextField
            control={control}
            name="password"
            label="Password"
            placeholder="Masukkan password Anda"
            isPassword
            startIcon={<KeyOutlinedIcon sx={{ fontSize: 16, color: '#8f99a7' }} />}
            rules={{
              required: 'Password wajib diisi',
              minLength: { value: 8, message: 'Password minimal 8 karakter' },
            }}
          />

          <Controller
            control={control}
            name="agree"
            rules={{ required: 'Anda harus menyetujui Syarat & Ketentuan' }}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2 text-[12.5px] leading-5 text-[#9ba8b8]">
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    size="small"
                    sx={{
                      color: '#bfc4cc',
                      p: 0,
                      '&.Mui-checked': { color: '#4e5bd6' },
                    }}
                  />
                  <span>
                    Dengan mendaftar, Anda menyetujui{' '}
                    <Link to="#" className="font-medium text-[#4e5bd6] no-underline hover:underline">
                      Syarat &amp; Ketentuan
                    </Link>{' '}
                    dan{' '}
                    <Link to="#" className="font-medium text-[#4e5bd6] no-underline hover:underline">
                      Kebijakan Privasi
                    </Link>{' '}
                    Luma.
                  </span>
                </label>
                {fieldState.error && (
                  <p className="pl-6 text-xs text-red-600">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disableElevation
          disabled={registerMutation.isPending}
          sx={{
            bgcolor: '#4e5bd6',
            color: '#fdfeff',
            textTransform: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            py: 1,
            mt: 0.5,
            '&:hover': { bgcolor: '#3f4bc0' },
            '&.Mui-disabled': { bgcolor: '#4e5bd6', color: '#fdfeff', opacity: 0.7 },
          }}
        >
          {registerMutation.isPending ? 'Memproses...' : 'Daftar Sekarang'}
        </Button>

        <p className="text-center text-sm text-[#7b8499]">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-[#4e5bd6] no-underline hover:underline">
            Masuk disini
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
