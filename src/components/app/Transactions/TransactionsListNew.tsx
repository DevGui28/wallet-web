'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from '@phosphor-icons/react'
import { Button } from '../../ui/button'
import { Dialog, DialogTrigger } from '../../ui/dialog'
import { NewTransactionDialog } from './NewTransactionDialog'
import { formatCurrency } from '../../../lib/utils'
import {
  CreateTransaction,
  TransactionFilters,
  TransactionResponse,
} from '../../../types/transactions.interface'
import TransactionsTable from './TransactionsTableNew'
import { TransactionCard } from './TransactionCard'
import TransactionsFilter from './TransactionsFilter'
import {
  handleCreateTransaction,
  handleGetTransactions,
  handleGetCreditCards,
  handleGetCategories,
} from '../../../api'

function MobileTransactionsList({ search }: { search: TransactionFilters }) {
  const { data, isLoading } = useQuery({
    queryKey: ['transactions', search],
    queryFn: () => handleGetTransactions(search),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })

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

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', search],
    queryFn: () => handleGetTransactions(search),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', search.type],
    queryFn: () => handleGetCategories(search.type || 'ALL'),
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
    onError: (error) => {
      throw error
    },
  })

  const onAddTransaction = async (data: CreateTransaction) => {
    await createTransactionMutation.mutateAsync(data)
  }

  const isLoading =
    categoriesLoading || creditCardsLoading || transactionsLoading

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
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">Transações</CardTitle>
            {transactionsData?.total && (
              <div className="flex flex-col gap-2 lg:flex-row">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Receita: {formatCurrency(transactionsData.total.income)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Despesa: {formatCurrency(transactionsData.total.expense)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Investimento:{' '}
                    {formatCurrency(transactionsData.total.investment)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total: {formatCurrency(transactionsData.total.balance)}
                  </span>
                </div>
              </div>
            )}
          </div>
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
