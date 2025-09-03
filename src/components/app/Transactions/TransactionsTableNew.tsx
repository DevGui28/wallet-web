'use client'

import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  Eye,
  TrendUp,
  CurrencyCircleDollar,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { formatCurrency, formatDateToString } from '../../../lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
import { TransactionResponse } from '../../../types/transactions.interface'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  handleGetTransactions,
  handlePayTransaction,
  handlePayInvoice,
} from '../../../api'
import { TransactionFilters } from '../../../types/transactions.interface'
import { useState } from 'react'
import { PayTransactionDialog } from './PayTransactionDialog'
import { toast } from 'sonner'

const transactionTypeIcons = {
  INCOME: <ArrowUp className="h-5 w-5 text-green-500" />,
  EXPENSE: <ArrowDown className="h-5 w-5 text-red-500" />,
  INVESTMENT: <TrendUp className="h-5 w-5 text-blue-500" />,
  INVOICE: <CreditCard className="h-5 w-5 text-purple-500" />,
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

type TransactionsTableProps = {
  search: TransactionFilters
}

export default function TransactionsTable({ search }: TransactionsTableProps) {
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionResponse | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', search],
    queryFn: () => handleGetTransactions(search),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })

  const payTransactionMutation = useMutation({
    mutationFn: (id: string) => handlePayTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transação paga com sucesso!')
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
  })

  const handleOpenPayDialog = (transaction: TransactionResponse) => {
    setSelectedTransaction(transaction)
    setPayDialogOpen(true)
  }

  const onPayTransaction = async (id: string) => {
    await payTransactionMutation.mutateAsync(id)
  }

  const onPayInvoice = async (id: string) => {
    await payInvoiceMutation.mutateAsync(id)
  }

  const transactions = data?.transactions

  if (isLoading) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <p className="text-sm font-medium sm:text-base">
          Carregando transações...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg">
      {selectedTransaction && (
        <PayTransactionDialog
          open={payDialogOpen}
          setOpen={setPayDialogOpen}
          transaction={selectedTransaction}
          onPayTransaction={onPayTransaction}
          onPayInvoice={onPayInvoice}
          isLoading={
            payTransactionMutation.isPending || payInvoiceMutation.isPending
          }
        />
      )}
      <div className="overflow-x-auto">
        <Table className="w-full rounded-2xl">
          <TableHeader>
            <TableRow className="border-muted">
              <TableHead className="px-2 py-3 text-left sm:px-4 sm:py-4">
                Data
              </TableHead>
              <TableHead className="px-2 py-3 text-left sm:px-4 sm:py-4">
                Nome
              </TableHead>
              <TableHead className="hidden px-4 py-4 text-left md:table-cell">
                Categoria
              </TableHead>
              <TableHead className="hidden px-4 py-4 text-left lg:table-cell">
                Tipo
              </TableHead>
              <TableHead className="hidden px-4 py-4 text-left lg:table-cell">
                Status
              </TableHead>
              <TableHead className="px-2 py-3 text-right sm:px-4 sm:py-4">
                Valor
              </TableHead>
              <TableHead className="px-2 py-3 text-center sm:px-4 sm:py-4">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.length === 0 || !transactions ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              transactions?.map((transaction: TransactionResponse) => (
                <TableRow key={transaction.id} className="border-muted">
                  <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                    <span className="text-xs sm:text-sm">
                      {formatDateToString(
                        new Date(transaction.date),
                        'dd MMM yyyy'
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                    <div className="flex items-center gap-1 sm:gap-3">
                      <span className="text-xs sm:text-sm">
                        {transaction.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden px-4 py-4 md:table-cell">
                    <span className="text-xs sm:text-sm">
                      {transaction.category?.name}
                    </span>
                  </TableCell>
                  <TableCell className="hidden px-4 py-4 lg:table-cell">
                    <div className="flex items-center gap-2">
                      {transaction.type &&
                        transactionTypeIcons[
                          transaction.type as keyof typeof transactionTypeIcons
                        ]}
                      <span className="text-xs sm:text-sm">
                        {transaction.type &&
                          transactionTypeLabels[
                            transaction.type as keyof typeof transactionTypeLabels
                          ]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden px-4 py-4 lg:table-cell">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusColors[transaction.isPaid ? 'PAID' : new Date(transaction.invoice?.dueDate || transaction.date).getTime() < new Date().getTime() ? 'LATE' : 'PENDING']}`}
                    >
                      {
                        statusLabels[
                          transaction.isPaid
                            ? 'PAID'
                            : new Date(
                                  transaction.invoice?.dueDate ||
                                    transaction.date
                                ).getTime() < new Date().getTime()
                              ? 'LATE'
                              : 'PENDING'
                        ]
                      }
                    </span>
                  </TableCell>
                  <TableCell className="px-2 py-3 text-right sm:px-4 sm:py-4">
                    <span className="text-xs sm:text-sm">
                      {formatCurrency(Number(transaction.totalAmount))}
                    </span>
                  </TableCell>
                  <TableCell className="px-2 py-3 text-center sm:px-4 sm:py-4">
                    <div className="flex items-center justify-center gap-2">
                      {!transaction.isPaid && (
                        <button
                          onClick={() => handleOpenPayDialog(transaction)}
                          className="inline-flex items-center justify-center rounded-md bg-green-600 p-2 text-white hover:bg-green-700"
                          title="Pagar transação"
                        >
                          <CurrencyCircleDollar className="h-4 w-4" />
                        </button>
                      )}
                      <Link
                        href={`/transactions/${transaction.id}`}
                        className="inline-flex items-center justify-center rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary/90"
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
