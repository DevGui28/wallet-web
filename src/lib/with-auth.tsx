'use client'

import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'

export function withAuth(Component: any) {
  return function AuthComponent(props: any) {
    const { isLoading, isLogged } = useAuth()

    if (!isLogged && !isLoading) {
      redirect('/login')
    }

    if (isLoading) {
      return <div>Loading...</div>
    }

    return <Component {...props} />
  }
}
