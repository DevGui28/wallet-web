'use client'

import { SideNav } from '@/components/app/Header/SideNav'
import TopNav from '@/components/app/Header/TopNav'
import { jwtDecode } from 'jwt-decode'
import { parseCookies } from 'nookies'
import { tokenName } from '../../constants/cookies'
import { withAuth } from '../../lib/with-auth'
import { JwtPayload } from '../../types/jwt.interface'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookies = parseCookies()
  const getToken = cookies[tokenName]
  const payload = jwtDecode<JwtPayload>(getToken)

  const name = payload.user.name

  return (
    <div className="flex items-center overflow-hidden">
      <SideNav className="hidden md:flex" />
      <main className="flex min-h-screen w-full flex-col overflow-auto bg-card p-4 md:mx-0 md:my-5 md:ml-60 md:mr-4 md:rounded-3xl">
        <TopNav title="Painel" name={name} />
        <div className="flex w-full items-center justify-between px-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default withAuth(DashboardLayout)
