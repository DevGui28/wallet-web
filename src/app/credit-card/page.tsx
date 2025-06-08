import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import CreditCardListNew from '../../components/app/CreditCard/CreditCardListNew'
import TopNav from '../../components/app/Header/TopNav'
import { tokenName } from '../../constants/cookies'
import { JwtPayload } from '../../types/jwt.interface'

export default function CreditCardPage() {
  const token = cookies().get(tokenName)?.value
  if (!token) {
    return redirect('/login')
  }

  const payload = jwtDecode<JwtPayload>(token)
  const name = payload.user.name

  return (
    <>
      <TopNav title="Cartões de Crédito" name={name} />
      <div className="mt-4 flex w-full items-center justify-center px-4">
        <div className="mb-6 w-full">
          <CreditCardListNew />
        </div>
      </div>
    </>
  )
}
