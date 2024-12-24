import { Plus } from '@phosphor-icons/react/dist/ssr'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import CreditCardList from '../../components/app/CreditCard/CreditCardList'
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
          <div className="mb-4 flex items-center justify-end">
            <Link href="/credit-card/create">
              <div className="flex h-10 items-center gap-2 rounded-md bg-secondary px-6 py-4 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 hover:text-secondary-foreground/90">
                <Plus size={16} weight="bold" />
                Adicionar cartão
              </div>
            </Link>
          </div>
          <CreditCardList />
        </div>
      </div>
    </>
  )
}
