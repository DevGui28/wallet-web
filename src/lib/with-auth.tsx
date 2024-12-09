'use client'

import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'
import { LoadingGlobal } from '../components/app/common/Loading/global-loading'

export function withAuth(Component: any) {
  return function AuthComponent(props: any) {
    const { isLoading, isLogged } = useAuth()

    if (!isLogged && !isLoading) {
      redirect('/login')
    }

    console.log({ isLoading, isLogged })

    if (isLoading) {
      return <LoadingGlobal />
    }

    return <Component {...props} />
  }
}
