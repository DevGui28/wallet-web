'use client'

import { redirect } from 'next/navigation'
import { LoadingGlobal } from '../components/app/common/Loading/global-loading'
import { useAuth } from '../hooks/useAuth'

export function withAuth(Component: any) {
  return function AuthComponent(props: any) {
    const { isLoading, isLogged } = useAuth()

    if (!isLogged && !isLoading) {
      redirect('/login')
    }

    if (isLoading) {
      return <LoadingGlobal />
    }

    return <Component {...props} />
  }
}
