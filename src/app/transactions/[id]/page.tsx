import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import TopNav from '../../../components/app/Header/TopNav'
import { TransactionDetail } from '../../../components/app/Transactions/TransactionDetail'
import { tokenName } from '../../../constants/cookies'
import { urls } from '../../../constants/urls'
import { JwtPayload } from '../../../types/jwt.interface'
import { TransactionResponse } from '../../../types/transactions.interface'

type TranscationDetailProps = {
  params: {
    id: string
  }
}

export default async function TranscationDetail({
  params,
}: TranscationDetailProps) {
  const token = cookies().get(tokenName)?.value
  if (!token) {
    return redirect('/login')
  }

  const payload = jwtDecode<JwtPayload>(token)
  const name = payload.user.name

  const { data: transaction } = await axios.get<TransactionResponse>(
    `${urls.walletApi}/transactions/${params.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return (
    <>
      <TopNav title="Detalhes da transação" name={name} />
      <div className="mt-4 flex w-full items-center justify-center px-4">
        <TransactionDetail transaction={transaction} />
      </div>
    </>
  )
}
