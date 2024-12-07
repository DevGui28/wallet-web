'use client'

import { SideNav } from '@/components/app/Header/SideNav'
import TopNav from '@/components/app/Header/TopNav'
import { withAuth } from '../../lib/with-auth'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center">
      <SideNav />
      <main className="my-5 ml-60 mr-4 flex min-h-screen w-full flex-col rounded-3xl bg-card">
        <TopNav title="Dashboard" />
        {children}
      </main>
    </div>
  )
}

export default withAuth(DashboardLayout)
