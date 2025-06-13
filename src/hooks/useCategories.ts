import { useQuery } from '@tanstack/react-query'
import { handleGetCategories } from '../api'
import { TransactionType } from '../types/transactions.interface'

interface UseCategoriesOptions {
  type: TransactionType
  enabled?: boolean
}

export function useCategories(options: UseCategoriesOptions) {
  const { type, enabled = true } = options

  return useQuery({
    queryKey: ['categories'],
    queryFn: () => handleGetCategories(type),
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled,
  })
}
