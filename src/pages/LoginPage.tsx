import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { tokens } from '@/shared/design-system/tokens'
import { useLogin } from '@/features/auth/hooks/useLogin'

const schema = z.object({
  userId: z.string().min(1, 'User ID required'),
  password: z.string().min(1, 'Password required'),
})

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = (data: z.infer<typeof schema>) => {
    login.mutate(data, {
      onSuccess: (res) => {
        const token = res.data?.data?.token
        if (token) localStorage.setItem('token', token)
        const redirect = sessionStorage.getItem('redirect_after_login') || '/'
        sessionStorage.removeItem('redirect_after_login')
        navigate(redirect, { replace: true })
      },
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { message?: string } } }
        console.log('Login endpoint error:', e?.response?.data?.message ?? err)
        setErrorMsg(e?.response?.data?.message ?? 'Login failed. Please check your credentials.')
      },
    })
  }

  return (
    <div className={`${tokens.page} grid md:grid-cols-2 h-screen overflow-hidden`}>
      <div className="hidden md:flex items-center justify-center p-4 max-h-screen">
        <img src="/img/login-banner.svg" alt="Login illustration" className="max-w-md w-full" />
      </div>
      <div className="flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`${tokens.card} w-[70%] max-w-md p-8 shadow-2xl`}
        >
          <div className="flex justify-start mb-5">
            <img src="/img/logo.svg" alt="Logo" className="w-32 h-12" />
          </div>
          <h2 className="text-lg font-bold text-[#000A3A]">Login</h2>
          {errorMsg && <p className="text-sm text-[#DC2626] mb-3">{errorMsg}</p>}
          <p className={`${tokens.subheading} mb-4`}>Use your company provided login credentials</p>
          <div className="space-y-2.5">
            <div>
              <label htmlFor="userId" className={tokens.label}>
                User ID
              </label>
              <input
                id="userId"
                {...register('userId')}
                className={tokens.input}
                placeholder="Enter user ID"
              />
              {errors.userId && <p className={tokens.error}>{errors.userId.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className={tokens.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className={tokens.input}
                placeholder="Enter password"
              />
              {errors.password && <p className={tokens.error}>{errors.password.message}</p>}
            </div>
          </div>
          <div className="mt-2 text-left">
            <a href="#" className="text-sm text-[#1B5DEF] hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            disabled={login.isPending}
            className={`${tokens.btnPrimary} w-full mt-3`}
          >
            {login.isPending ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
