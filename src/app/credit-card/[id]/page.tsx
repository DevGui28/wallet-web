import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import CreditCardDetail from '../../../components/app/CreditCard/CreditCardDetail'
import TopNav from '../../../components/app/Header/TopNav'
import { tokenName } from '../../../constants/cookies'
import { JwtPayload } from '../../../types/jwt.interface'

type CreditCardPageProps = {
  params: {
    id: string
  }
}

export default async function CreditCardPage({ params }: CreditCardPageProps) {
  const token = cookies().get(tokenName)?.value
  if (!token) {
    return redirect('/login')
  }

  const payload = jwtDecode<JwtPayload>(token)
  const name = payload.user.name

  return (
    <>
      <TopNav title="Detalhes do Cartão" name={name} />
      <div className="mt-4 flex w-full items-center justify-center px-4">
        <CreditCardDetail id={params.id} />
      </div>
    </>
  )
}
