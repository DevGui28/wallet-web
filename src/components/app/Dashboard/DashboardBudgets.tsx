import { BudgetSummary } from '../../../types/dashboard.interface'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { formatCurrency } from '../../../lib/utils'
import { Progress } from '../../ui/progress'
import DashboardButtomSeeMore from './DashboardButtomSeeMore'

type DashboardBudgetsProps = {
  data: BudgetSummary[]
}

export default function DashboardBudgets({ data }: DashboardBudgetsProps) {
  return (
    <Card>
      <div>
        <CardHeader>
          <CardTitle>Orçamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Nenhum orçamento encontrado para este mês.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {data.map((budget) => (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{budget.category}</span>
                    <span className="text-sm">
                      {formatCurrency(budget.spent)} /{' '}
                      {formatCurrency(budget.limit)}{' '}
                    </span>
                  </div>
                  <Progress
                    value={budget.percentage}
                    className="h-2"
                    indicatorClassName={
                      budget.percentage > 100
                        ? 'bg-destructive'
                        : budget.percentage > 80
                          ? 'bg-warning'
                          : 'bg-primary'
                    }
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{budget.percentage.toFixed(0)}% utilizado</span>
                    <span>Disponível: {formatCurrency(budget.available)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
      <div className="flex justify-end pb-6 pr-6">
        <DashboardButtomSeeMore link="/budgets" />
      </div>
    </Card>
  )
}
