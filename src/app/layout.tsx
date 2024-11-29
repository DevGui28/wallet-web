import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'

import './globals.css'

import { Header } from '@/components/app/Header'
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
      <ThemeProvider>
        <body className="inter-300 bg-background">
          <Header />
          <QueryProvider>{children}</QueryProvider>
          <Toaster />
        </body>
      </ThemeProvider>
    </html>
  )
}
