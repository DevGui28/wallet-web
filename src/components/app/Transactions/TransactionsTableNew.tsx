// src/components/app/Transactions/TransactionsTableNew.tsx

'use client'

import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  Eye,
  Trash, // Ícone de lixeira importado
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
  handleDeleteTransaction, // Função de exclusão importada
} from '@/api'
import { TransactionFilters } from '../../../types/transactions.interface'
import { useState } from 'react'
import { PayTransactionDialog } from './PayTransactionDialog'
import { toast } from 'sonner'
import { ConfirmationDialog } from '../Common/ConfirmationDialog' // Diálogo de confirmação
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { paymentMethodMapper } from '@/lib/mappers'

type TransactionsTableProps = {
  search?: TransactionFilters
}

export default function TransactionsTable({ search }: TransactionsTableProps) {
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionResponse | null>(null)
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(
    null,
  )
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', search],
    queryFn: () => handleGetTransactions(search || {}),
    staleTime: 5 * 60 * 1000,
  })

  const transactions = data?.transactions

  const payTransactionMutation = useMutation({
    mutationFn: handlePayTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transação paga com sucesso!')
      setPayDialogOpen(false)
    },
  })

  const payInvoiceMutation = useMutation({
    mutationFn: handlePayInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Fatura paga com sucesso!')
      setPayDialogOpen(false)
    },
  })

  const deleteTransactionMutation = useMutation({
    mutationFn: handleDeleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transação excluída com sucesso!')
      setDeletingTransactionId(null)
    },
    onError: () => {
      toast.error('Erro ao excluir a transação.')
    },
  })

  const onPayTransaction = (id: string) => {
    payTransactionMutation.mutate(id)
  }

  const onPayInvoice = (id: string) => {
    payInvoiceMutation.mutate(id)
  }

  const handleOpenPayDialog = (transaction: TransactionResponse) => {
    setSelectedTransaction(transaction)
    setPayDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deletingTransactionId) {
      deleteTransactionMutation.mutate(deletingTransactionId)
    }
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
      <ConfirmationDialog
        open={!!deletingTransactionId}
        onOpenChange={(isOpen) => !isOpen && setDeletingTransactionId(null)}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        confirmText="Excluir"
        variant="destructive"
        isLoading={deleteTransactionMutation.isPending}
      />
      <div className="overflow-x-auto">
        <Table className="w-full rounded-2xl">
          <TableHeader>
            <TableRow className="border-b border-muted">
              <TableHead className="px-2 py-3 text-center sm:px-4 sm:py-4">
                Pago
              </TableHead>
              <TableHead className="min-w-[150px] px-2 py-3 text-left sm:px-4 sm:py-4">
                Nome
              </TableHead>
              <TableHead className="px-2 py-3 text-left sm:px-4 sm:py-4">
                Tipo
              </TableHead>
              <TableHead className="px-2 py-3 text-left sm:px-4 sm:py-4">
                Valor
              </TableHead>
              <TableHead className="px-2 py-3 text-left sm:px-4 sm:py-4">
                Data
              </TableHead>
              <TableHead className="px-2 py-3 text-left sm:px-4 sm:py-4">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="border-muted">
                  <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                    <Skeleton className="m-auto h-5 w-5 rounded-full" />
                  </TableCell>
                  <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="px-2 py-3 text-center sm:px-4 sm:py-4">
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : transactions?.length === 0 || !transactions ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  Nenhuma transação encontrada
                </TableCell>
              </TableRow>
            ) : (
              transactions?.map((transaction: TransactionResponse) => (
                <TableRow key={transaction.id} className="border-muted">
                  <TableCell className="px-2 py-3 text-center sm:px-4 sm:py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenPayDialog(transaction)}
                      disabled={transaction.isPaid}
                    >
                      {transaction.isPaid ? (
                        <div className="h-5 w-5 rounded-full bg-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-red-500" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="px-2 py-3 text-left font-medium sm:px-4 sm:py-4">
                    {transaction.name}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-left sm:px-4 sm:py-4">
                    <div className="flex items-center gap-2">
                      {transaction.type === 'INCOME' ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-muted-foreground">
                        {paymentMethodMapper[transaction.paymentMethod]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-3 text-left sm:px-4 sm:py-4">
                    {formatCurrency(transaction.totalAmount)}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-left sm:px-4 sm:py-4">
                    {formatDateToString(transaction.date)}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-center sm:px-4 sm:py-4">
                    <div className="flex items-center justify-start gap-2">
                      <Link href={`/transactions/${transaction.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {transaction.paymentMethod === 'CREDIT_CARD' && (
                        <Link href={`/credit-card`}>
                          <Button variant="ghost" size="icon">
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setDeletingTransactionId(transaction.id)
                        }
                        title="Excluir transação"
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
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