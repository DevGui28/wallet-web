import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import TopNav from '../../../components/app/Header/TopNav'
import SplitOrRecurrenceTable from '../../../components/app/Transactions/SplitOrRecurrenceTable'
import { tokenName } from '../../../constants/cookies'
import { urls } from '../../../constants/urls'
import { paymentMethodMapper } from '../../../lib/mappers'
import { formatCurrency, formatDateToString } from '../../../lib/utils'
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
        <div className="mb-6 flex w-full flex-col gap-4">
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
            <h1>
              Nome:
              <span className="ml-1 font-semibold">{transaction.name}</span>
            </h1>
            <p>
              Descrição:
              <span className="ml-1 font-semibold">
                {transaction.description || 'Sem descrição'}
              </span>
            </p>
            <p>
              Método de pagamento:
              <span className="ml-1 font-semibold">
                {paymentMethodMapper[transaction.paymentMethod]}
              </span>
            </p>
            <p>
              Data da transação:
              <span className="ml-1 font-semibold">
                {formatDateToString(transaction.date)}
              </span>
            </p>
            <p>
              Valor total:
              <span className="ml-1 font-semibold">
                {formatCurrency(transaction.totalAmount)}
              </span>
            </p>
            <p>
              Categoria:
              <span className="ml-1 font-semibold">
                {transaction.category.name}
              </span>
            </p>
            {transaction.creditCard && (
              <p>
                Cartão:
                <span className="ml-1 font-semibold">
                  {transaction.creditCard.cardName} -
                  {transaction.creditCard.lastDigits
                    ? ` Final ${transaction.creditCard.lastDigits}`
                    : ''}
                </span>
              </p>
            )}
          </div>
          {transaction.splitsOrRecurrences.length > 0 && (
            <div className="flex flex-col gap-2 rounded-lg py-4">
              <h2 className="font-semibold">Parcelas</h2>
              <SplitOrRecurrenceTable id={transaction.id} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
