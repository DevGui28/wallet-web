import { urls } from '../../constants/urls'
import { toast } from 'sonner'
import { errorHandlingState } from '../errorHandler'

export const tokenInterceptor = (error: any) => {
  if (error.response?.status === 403) {
    window.location.replace(`${urls.walletWeb}/session-expired`)
    return Promise.reject(error)
  }

  const errorMessage =
    error.response?.data?.message || 'Ocorreu um erro na requisição'

  // Marca que o erro foi tratado pelo interceptor
  errorHandlingState.errorHandledByInterceptor = true
  toast.error(errorMessage)

  return Promise.reject(error)
}
