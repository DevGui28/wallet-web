'use client'

import { SideNav } from '@/components/app/Header/SideNav'
import { withAuth } from '../../lib/with-auth'

function TransactionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center overflow-hidden">
      <SideNav className="hidden md:flex" />
      <main className="mx-5 my-5 flex min-h-screen w-full flex-col overflow-auto rounded-3xl bg-card md:mx-0 md:ml-60 md:mr-4">
        {children}
      </main>
    </div>
  )
}

export default withAuth(TransactionsLayout)
