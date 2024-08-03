import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'

import './globals.css'

import ClientLayout from '@/components/ClientLayout'
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
      <body className="bg-gray-100">
        <QueryProvider>
          <ClientLayout>{children}</ClientLayout>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
