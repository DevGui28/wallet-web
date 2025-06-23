import axios, { Axios } from 'axios'
import { Login } from '../app/login/page'
import { urls } from '../constants/urls'
import {
  Budget,
  BudgetFilters,
  CreateBudgetDTO,
  UpdateBudgetDTO,
} from '../types/budgets.interface'
import { CategoriesResponse } from '../types/categories.interface'
import { DashboardData } from '../types/dashboard.interface'
import {
  CreateCreditCard,
  CreditCardResponse,
  UpdateCreditCard,
} from '../types/credit-card.interface'
import { SubscriptionPlan } from '../types/subscription-plans.interface'
import {
  CreateTransaction,
  TransactionFilters,
  TransactionResponse,
  TransactionType,
} from '../types/transactions.interface'
import { authorizationInterceptor } from './interceptors/authorization'
import { tokenInterceptor } from './interceptors/response'
import { withErrorHandling } from './errorHandler'

export const apiWallet = new Axios({
  baseURL: urls.walletApi,
  validateStatus: (status) => status >= 200 && status < 300,
  transformRequest: axios.defaults?.transformRequest,
  transformResponse: axios.defaults?.transformResponse,
})

apiWallet.interceptors.request.use(authorizationInterceptor)

apiWallet.interceptors.response.use(
  (response) => response,
  (error) => tokenInterceptor(error)
)

export const handleLogin = withErrorHandling(async (data: Login) => {
  const { data: res } = await apiWallet.post<{ token: string }>(
    '/auth/login',
    data
  )
  return res.token
})

export const handleFindTransaction = withErrorHandling(async (id: string) => {
  const { data } = await apiWallet.get<TransactionResponse>(
    `/transactions/${id}`
  )
  return data
})

export const handleGetTransactions = withErrorHandling(
  async (filters: TransactionFilters) => {
    const params = new URLSearchParams({
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.paymentMethod && {
        paymentMethod:
          filters.paymentMethod !== 'ALL' ? filters.paymentMethod : '',
      }),
      ...(filters.creditCardId && { creditCardId: filters.creditCardId }),
      ...(filters.type && { type: filters.type !== 'ALL' ? filters.type : '' }),
      ...(filters.date && { date: filters.date }),
    })

    const { data } = await apiWallet.get<{
      transactions: TransactionResponse[]
      total: {
        income: number
        expense: number
        balance: number
        investment: number
      }
    }>(`/transactions?${params}`)

    return data
  }
)

export const handleGetCategories = withErrorHandling(
  async (type: TransactionType | 'ALL') => {
    const { data } = await apiWallet.get<CategoriesResponse[]>(
      type === 'ALL' ? '/categories/all' : `/categories?type=${type}`
    )
    return data
  }
)

export const handleGetCategoriesAll = withErrorHandling(async () => {
  const { data } = await apiWallet.get<CategoriesResponse[]>('/categories/all')
  return data
})

export const handleGetCreditCards = withErrorHandling(async () => {
  const { data } = await apiWallet.get<CreditCardResponse[]>('/credit-cards')
  return data
})

export const handleFindCreditCard = withErrorHandling(async (id: string) => {
  const { data } = await apiWallet.get<CreditCardResponse>(
    `/credit-cards/${id}`
  )
  return data
})

export const handleCreateTransaction = withErrorHandling(
  async (payload: CreateTransaction) => {
    const { data } = await apiWallet.post('/transactions', payload)
    return data
  }
)

export const handleUpdateTransaction = withErrorHandling(
  async (id: string, payload: Partial<CreateTransaction>) => {
    const { data } = await apiWallet.put(`/transactions/${id}`, payload)
    return data
  }
)

export const handleDeleteTransaction = withErrorHandling(async (id: string) => {
  const { data } = await apiWallet.delete(`/transactions/${id}`)
  return data
})

export const handleCreateCreditCard = withErrorHandling(
  async (payload: CreateCreditCard) => {
    const { data } = await apiWallet.post('/credit-cards', payload)
    return data
  }
)

export const handleUpdateCreditCard = withErrorHandling(
  async (id: string, payload: UpdateCreditCard) => {
    const { data } = await apiWallet.put(`/credit-cards/${id}`, payload)
    return data
  }
)

export const handleDeleteCreditCard = withErrorHandling(async (id: string) => {
  const { data } = await apiWallet.delete(`/credit-cards/${id}`)
  return data
})

export const handleGetBudgets = withErrorHandling(
  async (filters: BudgetFilters) => {
    const params = new URLSearchParams()
    if (filters.month) params.append('month', filters.month.toString())
    if (filters.year) params.append('year', filters.year.toString())

    const { data } = await apiWallet.get<Budget[]>(`/budgets?${params}`)
    return data
  }
)

export const handleCreateBudget = withErrorHandling(
  async (payload: CreateBudgetDTO) => {
    const { data } = await apiWallet.post<{ budget: Budget }>(
      '/budgets',
      payload
    )
    return data.budget
  }
)

export const handleUpdateBudget = withErrorHandling(
  async (id: string, payload: UpdateBudgetDTO) => {
    const { data } = await apiWallet.patch<{ budget: Budget }>(
      `/budgets/${id}`,
      payload
    )
    return data.budget
  }
)

export const handleDeleteBudget = withErrorHandling(async (id: string) => {
  const { data } = await apiWallet.delete(`/budgets/${id}`)
  return data
})

// Métodos para planos de assinatura
export const handleGetSubscriptionPlans = withErrorHandling(async () => {
  const { data } = await apiWallet.get<SubscriptionPlan[]>('/plans')
  return data
})

export const handleUpdateUserPlan = withErrorHandling(
  async (planId: string) => {
    const { data } = await apiWallet.patch(`/plans/${planId}`)
    return data
  }
)

// Método para dashboard
export const handleGetDashboard = withErrorHandling(async () => {
  const { data } = await apiWallet.get<DashboardData>('/dashboard')
  return data
})

// Método para pagar uma transação
export const handlePayTransaction = withErrorHandling(async (id: string) => {
  const { data } = await apiWallet.patch(`/transactions/${id}/pay`)
  return data
})

// Método para pagar uma fatura de cartão de crédito
export const handlePayInvoice = withErrorHandling(async (id: string) => {
  const { data } = await apiWallet.patch(`/invoices/${id}/pay`)
  return data
})

// Método para logout
export const handleLogout = withErrorHandling(async () => {
  const response = await fetch('/api/logout')
  return response.json()
})
