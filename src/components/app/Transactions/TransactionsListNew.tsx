'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { Plus } from '@phosphor-icons/react'
import TransactionsTable from './TransactionsTableNew'
import { Button } from '../../ui/button'
import { Dialog, DialogTrigger } from '../../ui/dialog'
import { NewTransactionDialog } from './NewTransactionDialog'
import {
  CreateTransaction,
  TransactionFilters,
  TransactionResponse,
} from '../../../types/transactions.interface'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  handleCreateTransaction,
  handleGetCategoriesAll,
  handleGetTransactions,
  handleGetCreditCards,
} from '../../../api'
import { TransactionCard } from './TransactionCard'
import TransactionsFilter from './TransactionsFilter'

function MobileTransactionsList({ search }: { search: TransactionFilters }) {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', search],
    queryFn: () => handleGetTransactions(search),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })

  if (isLoading) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <p className="text-sm font-medium sm:text-base">
          Carregando transações...
        </p>
      </div>
    )
  }

  if (transactions?.length === 0 || !transactions) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <p className="text-sm font-medium sm:text-base">
          Nenhuma transação encontrada.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {transactions.map((transaction: TransactionResponse) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  )
}

export default function TransactionsList() {
  const [search, setSearch] = useState({} as TransactionFilters)
  const queryClient = useQueryClient()

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: handleGetCategoriesAll,
  })

  const { data: creditCards, isLoading: creditCardsLoading } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: handleGetCreditCards,
  })

  const createTransactionMutation = useMutation({
    mutationFn: (data: CreateTransaction) => handleCreateTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const onAddTransaction = async (data: CreateTransaction) => {
    try {
      await createTransactionMutation.mutateAsync(data)
      toast.success('Transação adicionada com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar transação')
    }
  }

  const isLoading = categoriesLoading || creditCardsLoading

  const [open, setOpen] = useState(false)

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-xl">Transações</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <Plus className="h-5 w-5" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <NewTransactionDialog
              open={open}
              setOpen={setOpen}
              onAddTransaction={onAddTransaction}
            />
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {!isLoading && categories && creditCards && (
          <TransactionsFilter
            search={search}
            setSearch={setSearch}
            categories={
              categories?.map((category) => ({
                label: category.name,
                value: category.id,
              })) || []
            }
            creditCards={
              creditCards?.map((card) => ({
                label: card.cardName,
                value: card.id,
              })) || []
            }
          />
        )}
        <div className="hidden overflow-x-auto md:block">
          <TransactionsTable search={search} />
        </div>

        <div className="block md:hidden">
          <MobileTransactionsList search={search} />
        </div>
      </CardContent>
    </Card>
  )
}
