import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined'
import Button from '@mui/material/Button'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import AuthLayout from '../components/auth/AuthLayout'
import AuthTextField from '../components/auth/AuthTextField'
import { setAuthTokens } from '../lib/authToken'

type LoginFormValues = {
    email: string
    password: string
}

type ServerErrorResponse = {
    message?: string
}

export default function Login() {
    const navigate = useNavigate()
    const { control, handleSubmit, setError } = useForm<LoginFormValues>({
        defaultValues: { email: '', password: '' },
    })

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (response) => {
            setAuthTokens(response.data.access_token, response.data.refresh_token)
            navigate('/')
        },
        onError: (error) => {
            if (!isAxiosError(error)) return
            const data = error.response?.data as ServerErrorResponse | undefined
            setError('password', {
                type: 'server',
                message: data?.message ?? 'Email atau password salah',
            })
        },
    })

    const onSubmit = (values: LoginFormValues) => {
        loginMutation.mutate(values)
    }

    return (
        <AuthLayout
            eyebrow="Untuk Pebisnis Modern"
            title="Bisnis lebih cerdas, keputusan lebih tepat."
            description="Pantau performa, dapatkan insight dari AI, dan kendalikan seluruh bisnis Anda dalam satu platform."
            formTitle="Selamat datang"
            formSubtitle="Masuk untuk melanjutkan ke Luma"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                        rules={{ required: 'Password wajib diisi' }}
                    />
                    <div className="flex justify-end">
                        <Link
                            to="#"
                            className="text-[13.5px] font-semibold text-[#4e5bd6] no-underline hover:underline"
                        >
                            Lupa password?
                        </Link>
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disableElevation
                    disabled={loginMutation.isPending}
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
                    {loginMutation.isPending ? 'Memproses...' : 'Masuk'}
                </Button>

                <p className="text-center text-sm text-[#7b8499]">
                    Belum punya akun?{' '}
                    <Link to="/register" className="font-semibold text-[#4e5bd6] no-underline hover:underline">
                        Daftar di sini
                    </Link>
                </p>
            </form>
        </AuthLayout>
    )
}
