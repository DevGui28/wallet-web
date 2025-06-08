'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Plus } from '@phosphor-icons/react'
import TransactionsTable from './TransactionsTableNew'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function TransactionsList() {
  const [search, setSearch] = useState('')

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Transações</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-2xl rounded-lg bg-card p-6">
              <DialogHeader>
                <DialogTitle>Nova Transação</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para criar uma nova transação.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 text-center text-muted-foreground">
                Formulário de nova transação
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar transação por descrição, categoria ou data"
              className="w-full rounded-lg bg-muted py-2 pl-10 pr-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <TransactionsTable search={search} />
      </CardContent>
    </Card>
  )
}
