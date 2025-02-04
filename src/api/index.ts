import axios, { Axios } from 'axios'
import { Login } from '../app/login/page'
import { TransactionFilters } from '../components/app/Transactions/TransactionsTable'
import { urls } from '../constants/urls'
import { CategoriesResponse } from '../types/categories.interface'
import {
  CreateCreditCard,
  CreditCardResponse,
  UpdateCreditCard,
} from '../types/credit-card.interface'
import {
  CreateTransaction,
  IncomesResponse,
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

export const handleGetCreditCards = async () => {
  const { data } = await apiWallet.get<CreditCardResponse[]>(`/credit-card`)
  return data
}

export const handleFindCreditCard = async (id: string) => {
  const { data } = await apiWallet.get<CreditCardResponse>(`/credit-card/${id}`)
  return data
}

export const handleCreateTransaction = async (payload: CreateTransaction) => {
  const { data } = await apiWallet.post('/transactions', payload)
  return data
}

export const handleCreateCreditCard = async (payload: CreateCreditCard) => {
  const { data } = await apiWallet.post('/credit-card', payload)
  return data
}

export const handleUpdateCreditCard = async (
  id: string,
  payload: UpdateCreditCard
) => {
  const { data } = await apiWallet.put(`/credit-card/${id}`, payload)
  return data
}

export const handleDeleteCreditCard = async (id: string) => {
  const { data } = await apiWallet.delete(`/credit-card/${id}`)
  return data
}

export const handlePaySplitOrRecurrence = async (id: string, paidAt: Date) => {
  const { data } = await apiWallet.patch(`/split-or-recurrence/${id}/pay`, {
    paidAt,
  })
  return data
}

export const handleGetInstallments = async ({
  creditcardId,
  date,
}: {
  creditcardId?: string
  date: string
}) => {
  if (!creditcardId) {
    return
  }

  const params = new URLSearchParams()
  params.append('date', date)
  const { data } = await apiWallet.get<IncomesResponse>(
    `/split-or-recurrence/${creditcardId}/invoices?${params}`
  )
  return data
}

export const handleGetBills = async ({ date }: { date: string }) => {
  const params = new URLSearchParams()
  params.append('date', date)
  const { data } = await apiWallet.get<IncomesResponse>(
    `/split-or-recurrence/bills?${params}`
  )
  return data
}
