export interface FinancialSummary {
  monthlyIncome: number
  monthlyExpenses: number
  investments: number
  balance: number
}

export interface RecentTransaction {
  id: string
  description: string
  name: string
  amount: number
  date: string
  type: string
  category: string
}

export interface BudgetSummary {
  id: string
  categoryId: string
  categoryName: string
  limit: number
  spent: number
  available: number
  percentage: number
}

export interface ExpenseByCategory {
  category: string
  amount: number
  percentage: number
  color: string
}

export interface CreditCardInvoice {
  id: string
  cardName: string
  dueDate: string
  totalAmount: number
  isPaid: boolean
}

export interface FinancialGoal {
  id: string
  title: string
  currentAmount: number
  targetAmount: number
  deadline: string
  icon: string
}

export interface DashboardData {
  financialSummary: FinancialSummary
  recentTransactions: RecentTransaction[]
  budgets: BudgetSummary[]
  expensesByCategory: ExpenseByCategory[]
  nextCreditCardInvoice: CreditCardInvoice[]
  financialGoals: FinancialGoal[]
}
