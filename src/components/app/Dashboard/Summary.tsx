'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowDownRight, ArrowUpRight, Wallet } from '@phosphor-icons/react'
import { formatCurrency } from '../../../lib/utils'

export function Summary() {
  const monthlyIncome = 4500
  const monthlyExpenses = 3200
  const investments = 500
  const totalBalance = monthlyIncome - monthlyExpenses

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral Mensal</CardTitle>
        <CardDescription>Seu resumo financeiro deste mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
          <div className="flex flex-col space-y-1.5 rounded-lg border border-card-foreground/20 p-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" weight="bold" />
              <span className="text-sm font-medium">Saldo</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBalance)}
            </div>
          </div>
          <div className="flex flex-col space-y-1.5 rounded-lg border border-card-foreground/20 p-4">
            <div className="flex items-center gap-2">
              <ArrowDownRight
                className="h-4 w-4 text-emerald-500"
                weight="bold"
              />
              <span className="text-sm font-medium">Receitas</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyIncome)}
            </div>
          </div>
          <div className="flex flex-col space-y-1.5 rounded-lg border border-card-foreground/20 p-4">
            <div className="flex items-center gap-2">
              <ArrowUpRight
                className="h-4 w-4 text-destructive"
                weight="bold"
              />
              <span className="text-sm font-medium">Despesas</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyExpenses)}
            </div>
          </div>
          <div className="flex flex-col space-y-1.5 rounded-lg border border-card-foreground/20 p-4">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-orange-500" weight="bold" />
              <span className="text-sm font-medium">Investimentos</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(investments)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
