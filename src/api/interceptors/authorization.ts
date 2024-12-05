import { tokenName } from '@/constants/cookies'
import { InternalAxiosRequestConfig } from 'axios'
import { parseCookies } from 'nookies'

export const authorizationInterceptor = (
  config: InternalAxiosRequestConfig<any>
) => {
  const cookies = parseCookies()

  const token = cookies[tokenName]

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}
