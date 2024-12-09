import { Login } from '@/app/login/page'
import { urls } from '@/constants/urls'
import axios, { Axios } from 'axios'
import { TransactionResponse } from '../components/app/Transactions/interfaces'
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
