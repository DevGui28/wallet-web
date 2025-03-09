'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '../../../lib/utils'
import { Progress } from '../../ui/progress'

interface BudgetCategory {
  id: string
  name: string
  budgeted: number
  spent: number
  color: string
}

const budgets: BudgetCategory[] = [
  {
    id: '1',
    name: 'Casa',
    budgeted: 1500,
    spent: 1200,
    color: 'bg-chart-1',
  },
  {
    id: '2',
    name: 'Alimentação',
    budgeted: 500,
    spent: 450,
    color: 'bg-chart-2',
  },
  {
    id: '3',
    name: 'Transporte',
    budgeted: 400,
    spent: 300,
    color: 'bg-chart-3',
  },
  {
    id: '4',
    name: 'Entretenimento',
    budgeted: 200,
    spent: 200,
    color: 'bg-chart-4',
  },
  {
    id: '5',
    name: 'Outros',
    budgeted: 300,
    spent: 350,
    color: 'bg-chart-5',
  },
]

export function BudgetProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso do orçamento</CardTitle>
        <CardDescription>
          Acompanhe seus gastos em relação aos orçamentos mensais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = Math.min(
              Math.round((budget.spent / budget.budgeted) * 100),
              100
            )
            const isOverBudget = budget.spent > budget.budgeted
            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${budget.color}`}
                    ></div>
                    <span className="text-sm font-medium">{budget.name}</span>
                  </div>
                  <div className="text-sm">
                    <span
                      className={
                        isOverBudget ? 'font-medium text-destructive' : ''
                      }
                    >
                      {formatCurrency(budget.spent)}
                    </span>
                    <span className="text-muted-foreground">
                      {' '}
                      / {formatCurrency(budget.budgeted)}
                    </span>
                  </div>
                </div>
                <Progress
                  value={percentage}
                  className={isOverBudget ? 'bg-muted' : ''}
                  indicatorClassName={
                    isOverBudget ? 'bg-destructive' : budget.color
                  }
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
