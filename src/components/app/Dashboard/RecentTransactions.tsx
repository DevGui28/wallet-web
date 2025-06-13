'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Car,
  Home,
  ShoppingBag,
  Utensils,
} from 'lucide-react'
import { Plus } from '@phosphor-icons/react'
import { formatCurrency, formatDateToString } from '../../../lib/utils'
import { Button } from '@/components/ui/button'
import { NewTransactionDialog } from '../../app/Transactions/NewTransactionDialog'
import { handleCreateTransaction } from '@/api'

interface Transaction {
  id: string
  amount: number
  date: Date
  description: string
  category: string
  type: 'income' | 'expense'
}

const transactions: Transaction[] = [
  {
    id: '1',
    amount: 2500,
    date: new Date('2025-04-01'),
    description: 'Salário',
    category: 'Income',
    type: 'income',
  },
  {
    id: '2',
    amount: 120,
    date: new Date('2025-04-02'),
    description: 'Mercearia',
    category: 'Food',
    type: 'expense',
  },
  {
    id: '3',
    amount: 35,
    date: new Date('2025-04-03'),
    description: 'Cafeteria',
    category: 'Food',
    type: 'expense',
  },
  {
    id: '4',
    amount: 800,
    date: new Date('2025-04-05'),
    description: 'Aluguel',
    category: 'Housing',
    type: 'expense',
  },
  {
    id: '5',
    amount: 65,
    date: new Date('2025-04-06'),
    description: 'Posto de gasolina',
    category: 'Transportation',
    type: 'expense',
  },
]

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food':
      return <Utensils className="h-4 w-4" />
    case 'housing':
      return <Home className="h-4 w-4" />
    case 'transportation':
      return <Car className="h-4 w-4" />
    case 'income':
      return <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
    default:
      return <ShoppingBag className="h-4 w-4" />
  }
}

export function RecentTransactions() {
  const [openNewTransactionDialog, setOpenNewTransactionDialog] =
    useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle>Transações recentes</CardTitle>
            <CardDescription>
              Suas últimas atividades financeiras
            </CardDescription>
          </div>
          <Button
            variant="default"
            size="sm"
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
            onClick={() => setOpenNewTransactionDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Nova transação
          </Button>

          <NewTransactionDialog
            open={openNewTransactionDialog}
            setOpen={setOpenNewTransactionDialog}
            onAddTransaction={handleCreateTransaction}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-9 w-9 bg-muted">
                  <AvatarFallback>
                    {getCategoryIcon(transaction.category)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateToString(transaction.date, 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center gap-1 ${transaction.type === 'income' ? 'text-emerald-500' : 'text-destructive'}`}
              >
                {transaction.type === 'income' ? (
                  <ArrowDownIcon className="h-4 w-4" />
                ) : (
                  <ArrowUpIcon className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
