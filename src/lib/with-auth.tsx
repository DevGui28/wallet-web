'use client'

import { useAuth } from "@/hooks/useAuth"
import { redirect } from "next/navigation"

export function withAuth(Component: any) {
  return function AuthComponent(props: any) {
    const { isLoading, isLogged } = useAuth()
    
    if (!isLogged && !isLoading) {
      redirect('/login')
    }

    if (isLoading) {
      return <h1>Loading...</h1>
    }

    return <Component {...props} />
  }
}