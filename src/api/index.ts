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

export const handleLogin = async (data: Login) => {
  const { data: res } = await apiWallet.post<{ token: string }>(
    '/auth/login',
    data
  )
  return res.token
}

export const handleFindTransaction = async (id: string) => {
  const { data } = await apiWallet.get<TransactionResponse>(
    `/transactions/${id}`
  )
  return data
}

export const handleGetTransactions = async (filters: TransactionFilters) => {
  const params = new URLSearchParams({
    ...(filters.categoryId && { categoryId: filters.categoryId }),
    ...(filters.paymentMethod && { paymentMethod: filters.paymentMethod }),
    ...(filters.creditCardId && { creditCardId: filters.creditCardId }),
    ...(filters.type && { type: filters.type !== 'ALL' ? filters.type : '' }),
    ...(filters.date && { date: filters.date }),
  })

  const { data } = await apiWallet.get<TransactionResponse[]>(
    `/transactions?${params}`
  )

  return data
}

export const handleGetCategories = async (type: TransactionType) => {
  const { data } = await apiWallet.get<CategoriesResponse[]>(
    `/categories?type=${type}`
  )
  return data
}

export const handleGetCategoriesAll = async () => {
  const { data } = await apiWallet.get<CategoriesResponse[]>('/categories/all')
  return data
}

export const handleGetCreditCards = async () => {
  const { data } = await apiWallet.get<CreditCardResponse[]>('/credit-cards')
  return data
}

export const handleFindCreditCard = async (id: string) => {
  const { data } = await apiWallet.get<CreditCardResponse>(
    `/credit-cards/${id}`
  )
  return data
}

export const handleCreateTransaction = async (payload: CreateTransaction) => {
  const { data } = await apiWallet.post('/transactions', payload)
  return data
}

export const handleUpdateTransaction = async (
  id: string,
  payload: Partial<CreateTransaction>
) => {
  const { data } = await apiWallet.put(`/transactions/${id}`, payload)
  return data
}

export const handleDeleteTransaction = async (id: string) => {
  const { data } = await apiWallet.delete(`/transactions/${id}`)
  return data
}

export const handleCreateCreditCard = async (payload: CreateCreditCard) => {
  const { data } = await apiWallet.post('/credit-cards', payload)
  return data
}

export const handleUpdateCreditCard = async (
  id: string,
  payload: UpdateCreditCard
) => {
  const { data } = await apiWallet.put(`/credit-cards/${id}`, payload)
  return data
}

export const handleDeleteCreditCard = async (id: string) => {
  const { data } = await apiWallet.delete(`/credit-cards/${id}`)
  return data
}

export const handleGetBudgets = async (filters: BudgetFilters) => {
  const params = new URLSearchParams()
  if (filters.month) params.append('month', filters.month.toString())
  if (filters.year) params.append('year', filters.year.toString())

  const { data } = await apiWallet.get<Budget[]>(`/budgets?${params}`)
  return data
}

export const handleCreateBudget = async (payload: CreateBudgetDTO) => {
  const { data } = await apiWallet.post<{ budget: Budget }>('/budgets', payload)
  return data.budget
}

export const handleUpdateBudget = async (
  id: string,
  payload: UpdateBudgetDTO
) => {
  const { data } = await apiWallet.patch<{ budget: Budget }>(
    `/budgets/${id}`,
    payload
  )
  return data.budget
}

export const handleDeleteBudget = async (id: string) => {
  const { data } = await apiWallet.delete(`/budgets/${id}`)
  return data
}

// Métodos para planos de assinatura
export const handleGetSubscriptionPlans = async () => {
  const { data } = await apiWallet.get<SubscriptionPlan[]>('/plans')
  return data
}

export const handleUpdateUserPlan = async (planId: string) => {
  const { data } = await apiWallet.patch(`/plans/${planId}`)
  return data
}

// Método para dashboard
export const handleGetDashboard = async () => {
  const { data } = await apiWallet.get<DashboardData>('/dashboard')
  return data
}

// Método para logout
export const handleLogout = async () => {
  const response = await fetch('/api/logout')
  return response.json()
}
