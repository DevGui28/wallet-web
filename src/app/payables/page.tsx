import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import TopNav from '../../components/app/Header/TopNav'
import PayablesList from '../../components/app/Payables/PayablesList'
import { tokenName } from '../../constants/cookies'
import { JwtPayload } from '../../types/jwt.interface'

export default function PayablesPage() {
  const token = cookies().get(tokenName)?.value
  if (!token) {
    return redirect('/login')
  }

  const payload = jwtDecode<JwtPayload>(token)
  const name = payload.user.name
  return (
    <>
      <TopNav
        title="Contas a Pagar"
        name={name}
        subtitle="Gerencie suas contas fixas e avulsas"
      />
      <div className="mt-4 flex w-full items-center justify-center px-4">
        <div className="mb-6 w-full">
          <PayablesList />
        </div>
      </div>
    </>
  )
}
