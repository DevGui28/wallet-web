'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { formatCurrency } from '../../../lib/utils'
import { Progress } from '../../ui/progress'
import DashboardButtomSeeMore from './DashboardButtomSeeMore'
import { ExpenseByCategory } from '../../../types/dashboard.interface'

type DashboardExpensesProps = {
  data: ExpenseByCategory[]
}

export default function DashboardExpenses({ data }: DashboardExpensesProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Nenhuma despesa encontrada.
          </p>
        ) : (
          <div className="space-y-4">
            {data.map((expense) => (
              <div key={expense.category} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: expense.color }}
                    />
                    <span className="text-sm font-medium">
                      {expense.category}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
                <Progress
                  value={expense.percentage}
                  className="h-2"
                  indicatorClassName="bg-primary"
                  style={{ backgroundColor: expense.color + '40' }}
                />
                <div className="text-xs text-muted-foreground">
                  {expense.percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}
        <DashboardButtomSeeMore link="/transactions" />
      </CardContent>
    </Card>
  )
}
