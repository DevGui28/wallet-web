import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import TopNav from '../../components/app/Header/TopNav'
import { BudgetsList } from '../../components/app/Budgets/BudgetsList'
import { tokenName } from '../../constants/cookies'
import { JwtPayload } from '../../types/jwt.interface'

export default function BudgetsPage() {
  const token = cookies().get(tokenName)?.value
  if (!token) {
    return redirect('/login')
  }

  const payload = jwtDecode<JwtPayload>(token)
  const name = payload.user.name
  return (
    <>
      <TopNav
        title="Orçamentos"
        name={name}
        subtitle="Defina e acompanhe seus limites de gastos por categoria"
      />
      <div className="mt-4 flex w-full items-center justify-center px-4">
        <div className="mb-6 w-full">
          <BudgetsList />
        </div>
      </div>
    </>
  )
}
