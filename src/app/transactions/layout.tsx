'use client'

import { SideNav } from '../../components/app/Header/SideNav'
import { withAuth } from '../../lib/with-auth'

function TransactionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center overflow-hidden">
      <SideNav className="hidden md:flex" />
      <main className="flex min-h-screen w-full flex-col overflow-auto bg-card p-4 md:mx-0 md:my-5 md:ml-60 md:mr-4 md:rounded-3xl">
        {children}
      </main>
    </div>
  )
}

export default withAuth(TransactionsLayout)
