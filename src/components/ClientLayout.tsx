'use client'

import { InstallmentsProvider } from '@/context/InstallmentsContext'
import { AuthProvider } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'

import BottomNavigation from './shared/BottomNavigation'
import Header from './shared/Header'

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
        {shouldRenderHeader && <BottomNavigation />}
      </InstallmentsProvider>
    </AuthProvider>
  )
}
