'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CurrencyCircleDollar } from '@phosphor-icons/react'
import { Button } from '../../ui/button'
import { paymentMethodMapper } from '../../../lib/mappers'
import { formatCurrency, formatDateToString } from '../../../lib/utils'
import {
  PaymentMethod,
  TransactionResponse,
  TransactionType,
} from '../../../types/transactions.interface'
import { handlePayTransaction, handlePayInvoice } from '../../../api'
import { PayTransactionDialog } from './PayTransactionDialog'

type TransactionDetailProps = {
  transaction: TransactionResponse
}

export function TransactionDetail({ transaction }: TransactionDetailProps) {
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const isCreditCardTransaction =
    transaction.paymentMethod === PaymentMethod.CREDIT_CARD

  const getStatusInfo = () => {
    if (transaction.isPaid) {
      return { label: 'Pago', color: 'text-green-500' }
    }

    if (isCreditCardTransaction && transaction.invoice) {
      const invoiceDueDate = new Date(transaction.invoice.dueDate).getTime()
      const now = new Date().getTime()

      if (invoiceDueDate < now) {
        return { label: 'Atrasado', color: 'text-red-500' }
      } else {
        return { label: 'Pendente', color: 'text-amber-500' }
      }
    } else {
      const transactionDate = new Date(transaction.date).getTime()
      const now = new Date().getTime()

      if (transactionDate < now) {
        return { label: 'Atrasado', color: 'text-red-500' }
      } else {
        return { label: 'Pendente', color: 'text-amber-500' }
      }
    }
  }

  const { label: statusLabel, color: statusColor } = getStatusInfo()

  const transactionTypeMap = {
    [TransactionType.INCOME]: 'Receita',
    [TransactionType.EXPENSE]: 'Despesa',
    [TransactionType.INVESTMENT]: 'Investimento',
  }

  const payTransactionMutation = useMutation({
    mutationFn: (id: string) => handlePayTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const payInvoiceMutation = useMutation({
    mutationFn: (id: string) => handlePayInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })

  const handleOpenPayDialog = () => {
    setPayDialogOpen(true)
  }

  const onPayTransaction = async (id: string) => {
    await payTransactionMutation.mutateAsync(id)
  }

  const onPayInvoice = async (id: string) => {
    await payInvoiceMutation.mutateAsync(id)
  }

  console.log({ transaction })

  return (
    <div className="mb-6 flex w-full flex-col gap-6 rounded-lg border border-border bg-card p-6 shadow-sm">
      <PayTransactionDialog
        open={payDialogOpen}
        setOpen={setPayDialogOpen}
        transaction={transaction}
        onPayTransaction={onPayTransaction}
        onPayInvoice={onPayInvoice}
        isLoading={
          payTransactionMutation.isPending || payInvoiceMutation.isPending
        }
      />
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold sm:text-2xl">{transaction.name}</h1>
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
            {formatCurrency(Number(transaction.totalAmount))}
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
              {formatDateToString(new Date(transaction.paidAt), 'dd MMMM yyyy')}
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
              {transaction.installmentNumber}/{transaction.totalInstallments}
            </span>
          </div>
        )}
      </div>

      {transaction.invoice && (
        <div className="mt-2 rounded-lg border border-border p-4">
          <h2 className="mb-3 text-lg font-semibold">
            Detalhes da Fatura do Cartão {transaction.creditCard?.cardName}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Mês/Ano</span>
              <span className="font-medium">
                {transaction.invoice.month}/{transaction.invoice.year}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Valor total</span>
              <span className="font-medium">
                {formatCurrency(Number(transaction.invoice.totalAmount))}
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

          <div className="mt-4 flex flex-col items-end justify-between gap-2 md:flex-row md:items-center">
            <Link
              href={`/invoices/${transaction.invoice.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver detalhes da fatura
            </Link>
            <Button
              onClick={handleOpenPayDialog}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <CurrencyCircleDollar className="h-5 w-5" />
              Pagar a fatura
            </Button>
          </div>
        </div>
      )}

      {transaction.recurringBill && (
        <div className="mt-2 rounded-lg border border-border p-4">
          <h2 className="mb-3 text-lg font-semibold">
            Detalhes da Conta a Pagar
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Nome</span>
              <span className="font-medium">
                {transaction.recurringBill.name}
              </span>
            </div>

            {transaction.recurringBill.description && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Descrição</span>
                <span className="font-medium">
                  {transaction.recurringBill.description}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Valor</span>
              <span className="font-medium">
                {formatCurrency(Number(transaction.recurringBill.amount))}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Dia de vencimento
              </span>
              <span className="font-medium">
                Todo dia {transaction.recurringBill.recurrenceDay}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Conta Fixa</span>
              <span className="font-medium text-primary">Sim</span>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href={`/payables`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todas as contas fixas
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3">
        {!transaction.isPaid &&
          transaction.paymentMethod !== PaymentMethod.CREDIT_CARD && (
            <Button
              onClick={handleOpenPayDialog}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <CurrencyCircleDollar className="h-5 w-5" />
              Pagar
            </Button>
          )}
        <Link
          href="/transactions"
          className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
        >
          Voltar para transações
        </Link>
      </div>
    </div>
  )
}
