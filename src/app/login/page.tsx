'use client'

import axiosInstance from '@/api/axiosInstance'
import { useAuth } from '@/hooks/useAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { AxiosError } from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
})

type Login = z.infer<typeof loginSchema>

export default function SignIn() {
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { updateToken } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: Login) {
    try {
      setError(null)
      const { data: res } = await axiosInstance.post('/auth/login', data)
      updateToken(res.token)
      router.push('/dashboard')
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setError('E-mail ou senha incorretos')
          return
        }
        setError('Ocorreu um erro inesperado')
      }
    }
  }

  const classError = 'my-1 text-center text-sm font-semibold text-yellow-200'
  const classInput =
    'my-1 rounded-md border border-gray-300 p-2 focus-visible:outline-1 focus-visible:outline-gray-100'

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="m-6 flex flex-col items-center justify-center rounded-xl border border-[#9e9e9e] bg-[#15d1d1] p-16 shadow-xl md:p-20">
        <Image
          src="/wallet-horizontal.png"
          alt="Logo"
          width={380}
          height={200}
        />
        <form
          className="mt-5 flex max-w-xs flex-col justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="flex justify-center">
            <input
              type="text"
              placeholder="E-mail"
              className={classInput}
              {...register('email')}
            />
          </label>
          {errors.email && <p className={classError}>{errors.email.message}</p>}
          <label htmlFor="password" className="relative flex justify-center">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              className={classInput}
              {...register('password')}
            />
            {showPassword ? (
              <VisibilityOffIcon
                className="absolute right-2 top-3.5 transform cursor-pointer md:right-14"
                color="disabled"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <VisibilityIcon
                className="absolute right-2 top-3.5 cursor-pointer md:right-14"
                color="disabled"
                onClick={() => setShowPassword(true)}
              />
            )}
          </label>

          {errors.password && (
            <p className={classError}>{errors.password.message}</p>
          )}
          <Link
            className="mt-3 text-center text-sm text-gray-100"
            href="/login"
          >
            Já tem uma conta?{' '}
            <span className="text-yellow-200">Faça o login</span>
          </Link>
          <button className="mt-5 rounded-md bg-blue-900 p-2 text-white">
            Entrar
          </button>
          {error && <p className={classError}>{error}</p>}
        </form>
      </div>
    </div>
  )
}
