import { toast } from 'sonner'

type ApiFunction<T, Args extends any[]> = (...args: Args) => Promise<T>

// Flag para controlar se o erro já foi tratado pelo interceptor
export const errorHandlingState = {
  errorHandledByInterceptor: false,
  resetErrorHandling: () => {
    errorHandlingState.errorHandledByInterceptor = false
  },
}

export function withErrorHandling<T, Args extends any[]>(
  fn: ApiFunction<T, Args>
): ApiFunction<T, Args> {
  return async (...args: Args) => {
    try {
      // Resetar o estado antes de cada chamada API
      errorHandlingState.resetErrorHandling()
      return await fn(...args)
    } catch (error: any) {
      // Só exibe toast se não foi tratado pelo interceptor
      if (!errorHandlingState.errorHandledByInterceptor) {
        const errorMessage =
          error.response?.data?.message || 'Ocorreu um erro na requisição'
        toast.error(errorMessage)
      }
      throw error
    }
  }
}
