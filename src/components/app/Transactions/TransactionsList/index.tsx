'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { NewTransactionModal } from '../AddTransactionDialog'
import TransactionsTableNew from '../TransactionsTableNew'

export default function TransactionsList() {
  const [search, setSearch] = useState('')

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Transações</CardTitle>
          <NewTransactionModal />
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
        <TransactionsTableNew search={search} />
      </CardContent>
    </Card>
  )
}
