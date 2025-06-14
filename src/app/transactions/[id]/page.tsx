import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import TopNav from '../../../components/app/Header/TopNav'
import { tokenName } from '../../../constants/cookies'
import { urls } from '../../../constants/urls'
import { paymentMethodMapper } from '../../../lib/mappers'
import { formatCurrency, formatDateToString } from '../../../lib/utils'
import { JwtPayload } from '../../../types/jwt.interface'
import {
  TransactionResponse,
  TransactionType,
} from '../../../types/transactions.interface'

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

  const statusLabel = transaction.isPaid
    ? 'Pago'
    : new Date(transaction.date).getTime() < new Date().getTime()
      ? 'Atrasado'
      : 'Pendente'
  const statusColor = transaction.isPaid
    ? 'text-green-500'
    : new Date(transaction.date).getTime() < new Date().getTime()
      ? 'text-red-500'
      : 'text-amber-500'

  const transactionTypeMap = {
    [TransactionType.INCOME]: 'Receita',
    [TransactionType.EXPENSE]: 'Despesa',
    [TransactionType.INVESTMENT]: 'Investimento',
  }

  return (
    <>
      <TopNav title="Detalhes da transação" name={name} />
      <div className="mt-4 flex w-full items-center justify-center px-4">
        <div className="mb-6 flex w-full flex-col gap-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold sm:text-2xl">
                {transaction.name}
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${statusColor}`}
              >
                {statusLabel}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {transaction.description || 'Sem descrição'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Valor</span>
              <span className="text-lg font-semibold">
                {formatCurrency(transaction.totalAmount)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Data</span>
              <span className="font-medium">
                {formatDateToString(new Date(transaction.date), 'dd MMMM yyyy')}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Método de pagamento
              </span>
              <span className="font-medium">
                {paymentMethodMapper[transaction.paymentMethod]}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Categoria</span>
              <span className="font-medium">{transaction.category.name}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Tipo</span>
              <span className="font-medium">
                {transactionTypeMap[transaction.type]}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Recorrente</span>
              <span className="font-medium">
                {transaction.isRecurring ? 'Sim' : 'Não'}
              </span>
            </div>

            {transaction.paidAt && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Data de pagamento
                </span>
                <span className="font-medium">
                  {formatDateToString(
                    new Date(transaction.paidAt),
                    'dd MMMM yyyy'
                  )}
                </span>
              </div>
            )}

            {transaction.creditCard && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Cartão de crédito
                </span>
                <span className="font-medium">
                  {transaction.creditCard.cardName}
                </span>
              </div>
            )}

            {transaction.totalInstallments && transaction.installmentNumber && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Parcelas</span>
                <span className="font-medium">
                  {transaction.installmentNumber}/
                  {transaction.totalInstallments}
                </span>
              </div>
            )}
          </div>

          {transaction.invoice && (
            <div className="mt-2 rounded-lg border border-border p-4">
              <h2 className="mb-3 text-lg font-semibold">Detalhes da Fatura</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Mês/Ano</span>
                  <span className="font-medium">
                    {transaction.invoice.month}/{transaction.invoice.year}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">
                    Valor total
                  </span>
                  <span className="font-medium">
                    {formatCurrency(transaction.invoice.totalAmount)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span
                    className={`font-medium ${transaction.invoice.isPaid ? 'text-green-500' : new Date(transaction.invoice.dueDate).getTime() > new Date().getTime() ? 'text-amber-500' : 'text-green-500'}`}
                  >
                    {transaction.invoice.isPaid
                      ? 'Paga'
                      : new Date(transaction.invoice.dueDate).getTime() >
                          new Date().getTime()
                        ? 'Pendente'
                        : 'Paga'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">
                    Data de fechamento
                  </span>
                  <span className="font-medium">
                    {formatDateToString(
                      new Date(transaction.invoice.closingDate),
                      'dd MMM yyyy'
                    )}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">
                    Data de vencimento
                  </span>
                  <span className="font-medium">
                    {formatDateToString(
                      new Date(transaction.invoice.dueDate),
                      'dd MMM yyyy'
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href={`/invoices/${transaction.invoice.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Ver detalhes da fatura
                </Link>
              </div>
            </div>
          )}

          {transaction.billToPay && (
            <div className="mt-2 rounded-lg border border-border p-4">
              <h2 className="mb-3 text-lg font-semibold">
                Detalhes da Conta a Pagar
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Nome</span>
                  <span className="font-medium">
                    {transaction.billToPay.name}
                  </span>
                </div>

                {transaction.billToPay.description && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Descrição
                    </span>
                    <span className="font-medium">
                      {transaction.billToPay.description}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Valor</span>
                  <span className="font-medium">
                    {formatCurrency(transaction.billToPay.amount)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">
                    Data de vencimento
                  </span>
                  <span className="font-medium">
                    {formatDateToString(
                      new Date(transaction.billToPay.dueDate),
                      'dd MMM yyyy'
                    )}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span
                    className={`font-medium ${transaction.billToPay.isPaid ? 'text-green-500' : 'text-amber-500'}`}
                  >
                    {transaction.billToPay.isPaid ? 'Paga' : 'Pendente'}
                  </span>
                </div>

                {transaction.billToPay.paidAt && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Data de pagamento
                    </span>
                    <span className="font-medium">
                      {formatDateToString(
                        new Date(transaction.billToPay.paidAt),
                        'dd MMM yyyy'
                      )}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">
                    Recorrente
                  </span>
                  <span className="font-medium">
                    {transaction.billToPay.isRecurring ? 'Sim' : 'Não'}
                  </span>
                </div>

                {transaction.billToPay.recurrenceDay && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Dia de recorrência
                    </span>
                    <span className="font-medium">
                      {transaction.billToPay.recurrenceDay}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Link
                  href={`/payables/${transaction.billToPay.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Ver detalhes da conta a pagar
                </Link>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Link
              href="/transactions"
              className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              Voltar para transações
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
