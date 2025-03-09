'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  PiggyBank,
} from 'lucide-react'
import { formatCurrency } from '../../../lib/utils'

export function Summary() {
  const monthlyIncome = 4500
  const monthlyExpenses = 3200
  const monthlySavings = monthlyIncome - monthlyExpenses
  const savingsRate = (monthlySavings / monthlyIncome) * 100

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
              <ArrowDownRight className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium">Receitas</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyIncome)}
            </div>
          </div>
          <div className="flex flex-col space-y-1.5 rounded-lg border border-card-foreground/20 p-4">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Despesas</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyExpenses)}
            </div>
          </div>
          <div className="flex flex-col space-y-1.5 rounded-lg border border-card-foreground/20 p-4">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Economia</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlySavings)}
            </div>
          </div>
          <div className="flex flex-col space-y-1.5 rounded-lg border border-card-foreground/20 p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Taxa de Economia</span>
            </div>
            <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
