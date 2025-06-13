'use client'

import { useDashboard } from '../../../hooks/useDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { formatCurrency } from '../../../lib/utils'
import { ArrowDown, ArrowUp, ChartPie, Wallet } from '@phosphor-icons/react'
import DashboardGoals from './DashboardGoals'
import DashboardInvoices from './DashboardInvoices'
import DashboardTransactions from './DashboardTransactions'
import DashboardExpenses from './DashboardExpenses'
import DashboardBudgets from './DashboardBudgets'

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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
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
            <Wallet className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.financialSummary.balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DashboardInvoices data={dashboardData.nextCreditCardInvoice} />
        <DashboardGoals data={dashboardData.financialGoals} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DashboardTransactions
          recentTransactions={dashboardData.recentTransactions}
        />

        <DashboardExpenses data={dashboardData.expensesByCategory} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DashboardBudgets data={dashboardData.budgets} />
      </div>
    </div>
  )
}
