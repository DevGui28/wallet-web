'use client'

import { useDashboard } from '../../../hooks/useDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { cn, formatCurrency } from '../../../lib/utils'
import {
  ArrowDown,
  ArrowUp,
  ChartPie,
  Wallet,
  CreditCard,
  Target,
  ArrowRight,
  Clock,
  CalendarX,
  Check,
} from '@phosphor-icons/react'
import { format, differenceInDays, isBefore } from 'date-fns'
import { Progress } from '../../ui/progress'
import Link from 'next/link'
import { Button } from '../../ui/button'

export default function DashboardContent() {
  const { data: dashboardData, isLoading, error } = useDashboard()

  if (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p>Carregando dados do dashboard...</p>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p>Não foi possível carregar os dados do dashboard.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.financialSummary.monthlyIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Despesas Mensais
            </CardTitle>
            <ArrowDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.financialSummary.monthlyExpenses)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
            <ChartPie className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.financialSummary.investments)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.financialSummary.balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Faturas de Cartão do mês</CardTitle>
            <CreditCard className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            {!dashboardData.nextCreditCardInvoice.length ? (
              <p className="text-center text-sm text-muted-foreground">
                Nenhuma fatura pendente.
              </p>
            ) : (
              dashboardData.nextCreditCardInvoice.map((invoice) => (
                <div className="space-y-4 py-2" key={invoice.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-semibold">{invoice.cardName}</span>
                      <div>
                        <span className="text-sm">
                          Vencimento -
                          {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm">Valor</span>
                      <span
                        className={cn(
                          'font-medium text-destructive',
                          invoice.isPaid && 'text-foreground'
                        )}
                      >
                        {formatCurrency(invoice.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {differenceInDays(new Date(invoice.dueDate), new Date()) <=
                    7 &&
                    !invoice.isPaid && (
                      <div className="mt-2 rounded-md bg-destructive/10 p-2 text-center text-sm text-destructive">
                        <Clock className="mr-1 inline h-4 w-4" />
                        Vence em{' '}
                        {differenceInDays(
                          new Date(invoice.dueDate),
                          new Date()
                        )}{' '}
                        dias
                      </div>
                    )}
                  {invoice.isPaid && (
                    <div className="mt-2 rounded-md bg-green-500/10 p-2 text-center text-sm text-green-500">
                      <Check className="mr-1 inline h-4 w-4" />
                      Pago
                    </div>
                  )}
                </div>
              ))
            )}
            <div className="mt-4 flex justify-end">
              <Link href="/credit-card">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  Ver detalhes
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Metas Financeiras</CardTitle>
            <Target className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            {dashboardData.financialGoals?.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Nenhuma meta financeira encontrada.
              </p>
            ) : (
              <div className="space-y-4">
                {dashboardData.financialGoals?.map((goal) => {
                  const progress =
                    (goal.currentAmount / goal.targetAmount) * 100
                  const isExpired = isBefore(
                    new Date(goal.deadline),
                    new Date()
                  )

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

                <div className="mt-4 flex justify-end">
                  <Link href="/goals">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      Ver todas as metas
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.recentTransactions.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Nenhuma transação recente encontrada.
              </p>
            ) : (
              <div className="space-y-4">
                {dashboardData.recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {transaction.description}
                      </span>
                      <div className="flex gap-2">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(transaction.date), 'dd/MM/yyyy')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {transaction.category}
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
            <div className="mt-4 flex justify-end">
              <Link href="/transactions">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  Ver mais
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.expensesByCategory.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Nenhuma despesa encontrada.
              </p>
            ) : (
              <div className="space-y-4">
                {dashboardData.expensesByCategory.map((expense, index) => (
                  <div key={index} className="space-y-1">
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
            <div className="mt-4 flex justify-end">
              <Link href="/goals">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  Ver mais
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orçamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.budgets.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Nenhum orçamento encontrado para este mês.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dashboardData.budgets.map((budget) => (
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
          <div className="mt-4 flex justify-end">
            <Link href="/budgets">
              <Button variant="outline" size="sm" className="flex items-center">
                Ver mais
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
