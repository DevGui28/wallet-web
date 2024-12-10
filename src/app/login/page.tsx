'use client'

import ChangeTheme from '@/components/shared/ChangeTheme'
import FormInput from '@/components/shared/Form/FormInput'
import { Form } from '@/components/ui/form'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircularProgress } from '@mui/material'
import { AxiosError } from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { handleLogin } from '../../api'
import { LoadingGlobal } from '../../components/app/common/Loading/global-loading'

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
})

export type Login = z.infer<typeof loginSchema>

export default function SignIn() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { updateToken, isLoading, isLogged } = useAuth()
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
      <ChangeTheme
        className="fixed right-5 top-5 lg:right-40 lg:top-10"
        textClass="hidden lg:block"
        withText
      />
      <div className="flex w-4/5 max-w-[600px] flex-col items-center justify-center rounded-3xl bg-card px-4 py-16 text-foreground">
        <div className="my-8 flex cursor-default items-center">
          <Image alt="logo" src="/wallet-logo.png" width={100} height={56} />
          <h1 className="inter-900 text-wrap text-3xl/10 text-card-foreground lg:text-4xl/10">
            <p className="-mb-1">Sábio</p>
            Financeiro
          </h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 flex max-w-xs flex-col justify-center"
          >
            <FormInput
              form={form}
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
            />
            <FormInput
              form={form}
              name="password"
              type="password"
              placeholder="Digite sua senha"
            />
            <Link
              className="mt-3 text-center text-xs text-foreground"
              href="/register"
            >
              Não tem uma conta?{' '}
              <span className="font-bold">Crie sua conta</span>
            </Link>
            <button
              className={cn(
                'mt-5 flex items-center justify-center rounded-md p-2 font-medium text-accent-foreground',
                loading
                  ? 'cursor-not-allowed bg-accent/50 text-foreground/50'
                  : 'cursor-pointer bg-accent'
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
              {loading ? 'Carregando...' : 'Entrar'}
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
