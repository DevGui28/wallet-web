import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { formatCurrency } from '../../../lib/utils'
import { format } from 'date-fns'
import DashboardButtomSeeMore from './DashboardButtomSeeMore'
import { RecentTransaction } from '../../../types/dashboard.interface'

export default function DashboardTransactions({
  recentTransactions,
}: {
  recentTransactions: RecentTransaction[]
}) {
  return (
    <Card className="col-span-1 flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Nenhuma transação recente encontrada.
            </p>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{transaction.name}</span>
                    <div className="flex gap-2">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), 'dd/MM/yyyy')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {transaction.category}{' '}
                        {transaction.description
                          ? ` - ${transaction.description}`
                          : ''}
                      </span>
                    </div>
                  </div>
                  <span
                    className={
                      transaction.type === 'INCOME'
                        ? 'text-green-500'
                        : 'text-destructive'
                    }
                  >
                    {transaction.type === 'INCOME' ? '+' : '-'}{' '}
                    {formatCurrency(transaction.amount)}
                  </span>
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
