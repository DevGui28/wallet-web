import type { Metadata } from 'next'

import './globals.css'

import ClientLayout from '@/components/ClientLayout'

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
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
