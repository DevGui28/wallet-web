'use client'

import { MobileNav } from '../../components/app/Header/MobileNav'
import { SideNav } from '../../components/app/Header/SideNav'
import { withAuth } from '../../lib/with-auth'

function CreditCardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center overflow-hidden">
      <SideNav className="hidden md:flex" />
      <main className="flex h-screen min-h-[calc(100vh-40px)] w-full flex-col overflow-auto bg-card p-4 md:mx-0 md:my-5 md:ml-[calc(288px+12px)] md:mr-4 md:h-full md:rounded-3xl">
        <MobileNav />
        {children}
      </main>
    </div>
  )
}

export default withAuth(CreditCardLayout)
