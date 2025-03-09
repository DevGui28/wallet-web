'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CreditCard, DollarSign, PiggyBank, Wallet } from 'lucide-react'
import { formatCurrency } from '../../../lib/utils'

interface Account {
  id: string
  name: string
  balance: number
  type: 'checking' | 'savings' | 'credit' | 'investment'
  icon: React.ReactNode
}

const accounts: Account[] = [
  {
    id: '1',
    name: 'Conta Principal',
    balance: 3250.65,
    type: 'checking',
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    id: '2',
    name: 'Poupança',
    balance: 12500.0,
    type: 'savings',
    icon: <PiggyBank className="h-4 w-4" />,
  },
  {
    id: '3',
    name: 'Cartão de Crédito',
    balance: -450.25,
    type: 'credit',
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: '4',
    name: 'Investimentos',
    balance: 8750.33,
    type: 'investment',
    icon: <DollarSign className="h-4 w-4" />,
  },
]

export function Account() {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saldo das Contas</CardTitle>
        <CardDescription>
          Visualize todas as suas contas financeiras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  {account.icon}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {account.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {account.type === 'checking' && 'Conta Corrente'}
                    {account.type === 'savings' && 'Poupança'}
                    {account.type === 'credit' && 'Cartão de Crédito'}
                    {account.type === 'investment' && 'Investimentos'}
                  </p>
                </div>
              </div>
              <div
                className={`text-sm font-medium ${account.balance < 0 ? 'text-destructive' : ''}`}
              >
                {formatCurrency(account.balance)}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm font-medium">Patrimônio Total</p>
            <p className="text-sm font-bold">{formatCurrency(totalBalance)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
