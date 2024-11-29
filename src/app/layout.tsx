import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'

import './globals.css'

import QueryProvider from '@/components/shared/QueryProvider'

export const metadata: Metadata = {
  title: 'Sábio Financeiro',
  description: 'Cuidando do seu dinheiro.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="inter-300 bg-background">
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
