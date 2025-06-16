import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { FinancialGoal } from '../../../types/dashboard.interface'
import { formatCurrency } from '../../../lib/utils'
import { Target, CalendarX } from '@phosphor-icons/react'
import { format, isBefore } from 'date-fns'
import { Progress } from '../../ui/progress'
import DashboardButtomSeeMore from './DashboardButtomSeeMore'

type DashboardGoalsProps = {
  data: FinancialGoal[]
}

export default function DashboardGoals({ data }: DashboardGoalsProps) {
  return (
    <Card className="col-span-1 flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Metas Financeiras</CardTitle>
          <Target className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          {data?.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Nenhuma meta financeira encontrada.
            </p>
          ) : (
            <div className="space-y-6">
              {data?.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100
                const isExpired = isBefore(new Date(goal.deadline), new Date())

                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{goal.icon}</span>
                        <span className="font-medium">{goal.title}</span>
                      </div>
                      <span
                        className={`text-xs ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}
                      >
                        {isExpired ? (
                          <span className="flex items-center">
                            <CalendarX className="mr-1 h-3 w-3" />
                            Meta vencida
                          </span>
                        ) : (
                          `Prazo: ${format(new Date(goal.deadline), 'dd/MM/yyyy')}`
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {formatCurrency(goal.currentAmount)} /{' '}
                        {formatCurrency(goal.targetAmount)}
                      </span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>

                    <Progress
                      value={progress}
                      className="h-2"
                      indicatorClassName={
                        isExpired ? 'bg-destructive' : 'bg-primary'
                      }
                    />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </div>
      <div className="flex justify-end pb-6 pr-6">
        <DashboardButtomSeeMore link="/goals" />
      </div>
    </Card>
  )
}
