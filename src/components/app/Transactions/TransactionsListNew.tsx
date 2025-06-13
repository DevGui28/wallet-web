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
} from '../../../types/transactions.interface'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleCreateTransaction, handleGetCategoriesAll } from '../../../api'
import { CustomSelect } from '../../shared/CustomSelect'

export default function TransactionsList() {
  const [search, setSearch] = useState({} as TransactionFilters)
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await handleGetCategoriesAll()
      return data.map((category) => ({
        label: category.name,
        value: category.id,
      }))
    },
  })

  const createTransactionMutation = useMutation({
    mutationFn: (data: CreateTransaction) => handleCreateTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transação adicionada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao criar transação')
    },
  })

  const onAddTransaction = async (data: CreateTransaction) => {
    await createTransactionMutation.mutateAsync(data)
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
        <div className="mb-6">
          <div className="relative flex-1">
            <CustomSelect
              label="Filtrar por categoria"
              placeholder="Selecione uma categoria"
              options={categories || []}
              value={search.categoryId || null}
              onChange={(value) => setSearch({ ...search, categoryId: value })}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <TransactionsTable search={search} />
        </div>
      </CardContent>
    </Card>
  )
}
