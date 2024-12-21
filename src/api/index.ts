import axios, { Axios } from 'axios'
import { Login } from '../app/login/page'
import { urls } from '../constants/urls'
import { CategoriesResponse } from '../types/categories.interface'
import {
  CreateCreditCard,
  CreditCardResponse,
} from '../types/credit-card.interface'
import {
  CreateTransaction,
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

export const handleGetTransactions = async () => {
  const { data } = await apiWallet.get<TransactionResponse[]>(`/transactions/`)
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

export const handleCreateTransaction = async (payload: CreateTransaction) => {
  const { data } = await apiWallet.post('/transactions', payload)
  return data
}

export const handleCreateCreditCard = async (payload: CreateCreditCard) => {
  const { data } = await apiWallet.post('/credit-card', payload)
  return data
}

export const handleDeleteCreditCard = async (id: string) => {
  const { data } = await apiWallet.delete(`/credit-card/${id}`)
  return data
}
