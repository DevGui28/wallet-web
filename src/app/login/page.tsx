'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircularProgress } from '@mui/material'
import { AxiosError } from 'axios'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { handleLogin } from '../../api'
import { LoadingGlobal } from '../../components/app/common/Loading/global-loading'
import FormInput from '../../components/shared/Form/FormInput'
import { Form } from '../../components/ui/form'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
  name: z.optional(z.string()),
})

export type Login = z.infer<typeof loginSchema>

export default function SignIn() {
  const [error, setError] = useState<string | null>(null)
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const { updateToken, isLoading, isLogged } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()

  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: Login) {
    try {
      setLoading(true)
      const token = await handleLogin(data)
      updateToken(token)
      router.push('/dashboard')
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          setError('E-mail ou senha incorretos')
          return
        }
        setError('Ocorreu um erro inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingGlobal />
  }

  if (isLogged && !isLoading) {
    return router.push('/dashboard')
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-4/5 max-w-[600px] flex-col items-center justify-center rounded-3xl bg-card px-4 py-16 text-foreground">
        <div className="my-8 flex cursor-default items-center">
          <Image
            alt="logo"
            src={`/sabio-financeiro-${theme === 'dark' ? 'dark' : 'light'}.png`}
            width={300}
            height={40}
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 flex max-w-xs flex-col justify-center gap-2"
          >
            {!isLogin && (
              <FormInput
                form={form}
                name="name"
                label="Nome"
                type="text"
                placeholder="Digite seu nome"
              />
            )}
            <FormInput
              form={form}
              name="email"
              label="E-mail"
              type="email"
              placeholder="Digite seu e-mail"
            />
            <FormInput
              form={form}
              name="password"
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
            />
            <p className="mt-3 text-center text-xs text-foreground">
              {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="cursor-pointer font-bold"
              >
                {isLogin ? 'Crie uma conta!' : 'Faça o login!'}
              </span>
            </p>
            <button
              className={cn(
                'mt-5 flex items-center justify-center rounded-md p-2 font-medium text-accent-foreground',
                loading
                  ? 'cursor-not-allowed bg-accent/50 text-foreground/50'
                  : 'cursor-pointer bg-accent disabled:text-accent-foreground'
              )}
              disabled={loading}
              type="submit"
            >
              {loading && (
                <CircularProgress
                  size={20}
                  className="mr-2 h-1 w-1 animate-spin text-foreground"
                />
              )}
              {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>
          {error && (
            <p className="mt-3 text-xs font-semibold text-foreground">
              {error}
            </p>
          )}
        </Form>
      </div>
    </div>
  )
}
