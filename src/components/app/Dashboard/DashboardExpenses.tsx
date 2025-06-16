'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { formatCurrency } from '../../../lib/utils'
import { Progress } from '../../ui/progress'
import DashboardButtomSeeMore from './DashboardButtomSeeMore'
import { ExpenseByCategory } from '../../../types/dashboard.interface'
import { useMemo } from 'react'

type DashboardExpensesProps = {
  data: ExpenseByCategory[]
}

export default function DashboardExpenses({ data }: DashboardExpensesProps) {
  const expenseColors = useMemo(
    () => [
      { indicator: '#3B82F6', bgOpacity: '#3B82F640' },
      { indicator: '#EC4899', bgOpacity: '#EC489940' },
      { indicator: '#8B5CF6', bgOpacity: '#8B5CF640' },
      { indicator: '#10B981', bgOpacity: '#10B98140' },
      { indicator: '#F59E0B', bgOpacity: '#F59E0B40' },
    ],
    []
  )

  return (
    <Card className="col-span-1 flex flex-col justify-between">
      <div>
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
              {data.map((expense, index) => (
                <div key={expense.category} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: expenseColors[index % 5].indicator,
                        }}
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
                    indicatorClassName={`progress-indicator-${index % 5}`}
                    style={{
                      backgroundColor: expenseColors[index % 5].bgOpacity,
                    }}
                  />
                  <style jsx global>{`
                    .progress-indicator-${index % 5} {
                      background-color: ${expenseColors[index % 5].indicator};
                    }
                  `}</style>
                  <div className="text-xs text-muted-foreground">
                    {expense.percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
      <div className="flex justify-end pb-6 pr-6">
        <DashboardButtomSeeMore link="/transactions" />
      </div>
    </Card>
  )
}
