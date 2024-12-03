'use client'

import { SideNav } from '@/components/app/SideNav'
import TopNav from '@/components/app/TopNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center">
      <SideNav />
      <main className="ml-80 flex min-h-screen w-full flex-col bg-background">
        <TopNav title="Dashboard" />
        {children}
      </main>
    </div>
  )
}
