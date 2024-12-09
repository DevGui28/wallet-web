'use client'

import { SideNav } from '@/components/app/Header/SideNav'
import TopNav from '@/components/app/Header/TopNav'
import { jwtDecode } from 'jwt-decode'
import { parseCookies } from 'nookies'
import { JwtPayload } from '../../components/app/common/interfaces/jwt'
import { tokenName } from '../../constants/cookies'
import { withAuth } from '../../lib/with-auth'

function TransactionsLayout({ children }: { children: React.ReactNode }) {
  const cookies = parseCookies()
  const getToken = cookies[tokenName]
  const payload = jwtDecode<JwtPayload>(getToken)

  const name = payload.user.name

  return (
    <div className="flex items-center">
      <SideNav />
      <main className="my-5 ml-60 mr-4 flex min-h-screen w-full flex-col rounded-3xl bg-card">
        <TopNav title="Transactions" name={name} />
        <div className="flex w-full items-center justify-between px-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default withAuth(TransactionsLayout)
