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
      return (
        <div className="flex h-full w-full items-center justify-center bg-primary text-center">
          Loading...
        </div>
      )
    }

    return <Component {...props} />
  }
}
