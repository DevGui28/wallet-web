import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import TopNav from '../../components/app/Header/TopNav'
import PlansList from '../../components/app/Plans/PlansList'
import { tokenName } from '../../constants/cookies'
import { JwtPayload } from '../../types/jwt.interface'

export default function PlansPage() {
  const token = cookies().get(tokenName)?.value
  if (!token) {
    return redirect('/login')
  }

  const payload = jwtDecode<JwtPayload>(token)
  const name = payload.user.name
  return (
    <>
      <TopNav
        title="Planos"
        name={name}
        subtitle="Conheça nossos planos e escolha o ideal para você"
      />
      <div className="mt-4 flex w-full items-center justify-center px-4">
        <div className="mb-6 w-full">
          <PlansList />
        </div>
      </div>
    </>
  )
}
