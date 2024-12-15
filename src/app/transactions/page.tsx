import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { JwtPayload } from '../../components/app/common/interfaces/jwt'
import TopNav from '../../components/app/Header/TopNav'
import TransactionsTable from '../../components/app/Transactions/TransactionsTable'
import { tokenName } from '../../constants/cookies'

function Page() {
  const cookie = cookies()
  const token = cookie.get(tokenName)
  if (!token) {
    return redirect('/login')
  }

  const payload = jwtDecode<JwtPayload>(token.value)

  const name = payload.user.name
  return (
    <>
      <TopNav title="Transações" name={name} />
      <div className="flex w-full items-center justify-between px-8">
        <div className="mb-6 w-full">
          <TransactionsTable />
        </div>
      </div>
    </>
  )
}

export default Page
