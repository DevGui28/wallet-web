'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Plus } from '@phosphor-icons/react'
import TransactionsTable from './TransactionsTableNew'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { NewTransactionDialog } from './NewTransactionDialog'

export default function TransactionsList() {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const onAddTransaction = async (data: any) => {
    try {
      console.log('onAddTransaction', data)
    } catch (error) {
      console.error('Erro ao adicionar transação:', error)
    }
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
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar transações..."
              className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
