'use client'

import { withAuth } from '../../lib/with-auth'
import { SideNav } from '../../components/app/Header/SideNav'
import { MobileNav } from '../../components/app/Header/MobileNav'

function GoalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center overflow-hidden">
      <SideNav className="hidden md:flex" />
      <main className="flex min-h-[calc(100vh-40px)] w-full flex-col overflow-auto bg-card p-4 md:mx-0 md:my-5 md:ml-[calc(288px+12px)] md:mr-4 md:rounded-3xl">
        <MobileNav />
        <div className="flex w-full flex-col items-center justify-between md:px-4">
          {children}
        </div>
      </main>
    </div>
  )
}

export default withAuth(GoalsLayout)
