'use client'

import {
  ArrowDown,
  ArrowUp,
  Eye,
  TrendUp,
  CurrencyCircleDollar,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { formatCurrency, formatDateToString } from '../../../lib/utils'
import {
  PaymentMethod,
  TransactionResponse,
} from '../../../types/transactions.interface'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handlePayTransaction, handlePayInvoice } from '../../../api'
import { toast } from 'sonner'
import { PayTransactionDialog } from './PayTransactionDialog'

const transactionTypeIcons = {
  INCOME: <ArrowUp className="h-5 w-5 text-green-500" />,
  EXPENSE: <ArrowDown className="h-5 w-5 text-red-500" />,
  INVESTMENT: <TrendUp className="h-5 w-5 text-blue-500" />,
}

const transactionTypeLabels = {
  INCOME: 'Receita',
  EXPENSE: 'Despesa',
  INVESTMENT: 'Investimento',
  INVOICE: 'Fatura',
}

const statusColors = {
  PENDING:
    'bg-yellow-300 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-300',
  PAID: 'bg-green-300 text-green-800 dark:bg-green-700 dark:text-green-300',
  LATE: 'bg-red-300 text-red-800 dark:bg-red-700 dark:text-red-300',
}

const statusLabels = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  LATE: 'Atrasado',
}

type TransactionCardProps = {
  transaction: TransactionResponse
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const payTransactionMutation = useMutation({
    mutationFn: (id: string) => handlePayTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transação paga com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao pagar transação')
    },
  })

  const payInvoiceMutation = useMutation({
    mutationFn: (id: string) => handlePayInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Fatura paga com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao pagar fatura')
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
  return (
    <div className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
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
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{transaction.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatDateToString(new Date(transaction.date), 'dd MMM yyyy')}
          </span>
        </div>
        <span className="text-sm font-medium">
          {formatCurrency(Number(transaction.totalAmount))}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {transaction.category && (
          <span className="rounded-full bg-secondary px-2 py-1 text-xs">
            {transaction.category.name}
          </span>
        )}

        {transaction.type && (
          <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1">
            {
              transactionTypeIcons[
                transaction.type as keyof typeof transactionTypeIcons
              ]
            }
            <span className="text-xs">
              {
                transactionTypeLabels[
                  transaction.type as keyof typeof transactionTypeLabels
                ]
              }
            </span>
          </div>
        )}

        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            statusColors[
              transaction.isPaid
                ? 'PAID'
                : new Date(
                      transaction.invoice?.dueDate || transaction.date
                    ).getTime() < new Date().getTime()
                  ? 'LATE'
                  : 'PENDING'
            ]
          }`}
        >
          {
            statusLabels[
              transaction.isPaid
                ? 'PAID'
                : new Date(
                      transaction.invoice?.dueDate || transaction.date
                    ).getTime() < new Date().getTime()
                  ? 'LATE'
                  : 'PENDING'
            ]
          }
        </span>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        {!transaction.isPaid &&
          transaction.paymentMethod !== PaymentMethod.CREDIT_CARD && (
            <button
              onClick={handleOpenPayDialog}
              className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
            >
              <CurrencyCircleDollar className="h-3 w-3" />
              Pagar
            </button>
          )}
        <Link
          href={`/transactions/${transaction.id}`}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Eye className="h-3 w-3" />
          Ver detalhes
        </Link>
      </div>
    </div>
  )
}
