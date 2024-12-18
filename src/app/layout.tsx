import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import './globals.css'

import QueryProvider from '../components/shared/QueryProvider'
import { AuthProvider } from '../hooks/useAuth'

export const metadata: Metadata = {
  title: 'Sábio Financeiro',
  description: 'Cuidando do seu dinheiro.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <ThemeProvider>
          <body className="inter-300 bg-background">
            <QueryProvider>{children}</QueryProvider>
            <Toaster position="top-right" />
          </body>
        </ThemeProvider>
      </AuthProvider>
    </html>
  )
}
