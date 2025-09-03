// src/components/app/Transactions/TransactionDetail.tsx

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CurrencyCircleDollar, Trash } from '@phosphor-icons/react' // Adicionar ícone
import { Button } from '../../ui/button'
import { paymentMethodMapper } from '../../../lib/mappers'
import { formatCurrency, formatDateToString } from '../../../lib/utils'
import {
  PaymentMethod,
  TransactionResponse,
  TransactionType,
} from '../../../types/transactions.interface'
import { handlePayTransaction, handlePayInvoice, handleDeleteTransaction } from '../../../api' // Adicionar handle
import { PayTransactionDialog } from './PayTransactionDialog'
import { ConfirmationDialog } from '../Common/ConfirmationDialog' // Adicionar import
import { toast } from 'sonner'
import { useRouter } from 'next/navigation' // Adicionar import

type TransactionDetailProps = {
  transaction: TransactionResponse
}

export function TransactionDetail({ transaction }: TransactionDetailProps) {
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false) // Adicionar estado
  const queryClient = useQueryClient()
  const router = useRouter()

  // ... (código existente)

  const deleteTransactionMutation = useMutation({
    mutationFn: (id: string) => handleDeleteTransaction(id),
    onSuccess: () => {
      toast.success('Transação excluída com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      router.push('/transactions')
    },
    onError: () => {
      toast.error('Erro ao excluir a transação.')
    },
  })


  const handleConfirmDelete = () => {
    deleteTransactionMutation.mutate(transaction.id)
  }
  
  // ... (código existente)

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
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        confirmText="Excluir"
        variant="destructive"
        isLoading={deleteTransactionMutation.isPending}
      />
      {/* ... (código existente do detalhe da transação) */}

      <div className="flex flex-wrap items-center justify-end gap-3">
        {/* ... (botões existentes) */}
        <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Trash className="h-5 w-5" />
            Excluir
          </Button>
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