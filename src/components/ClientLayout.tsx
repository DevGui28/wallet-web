'use client'

import { InstallmentsProvider } from '@/context/InstallmentsContext'
import { AuthProvider } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'

import Header from './Header'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const noHeaderPaths = ['/login', '/register']

  const shouldRenderHeader = !noHeaderPaths.some((path) =>
    pathname.includes(path)
  )

  return (
    <AuthProvider>
      <InstallmentsProvider>
        {shouldRenderHeader && <Header />}
        {children}
      </InstallmentsProvider>
    </AuthProvider>
  )
}
