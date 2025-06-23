import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  handleDeleteTransaction,
  handleGetTransactions,
  handleUpdateTransaction,
} from '../api'
import {
  TransactionFilters,
  CreateTransaction,
} from '../types/transactions.interface'

export function useTransactions() {
  const queryClient = useQueryClient()

  const useGetTransactions = (filters: TransactionFilters) => {
    const { data } = useQuery({
      queryKey: ['transactions', filters],
      queryFn: () => handleGetTransactions(filters),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    })

    return data
  }

  const useUpdateTransaction = (id: string, data: CreateTransaction) => {
    return useMutation({
      mutationFn: () => handleUpdateTransaction(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      },
    })
  }

  const useDeleteTransaction = (id: string) => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: () => handleDeleteTransaction(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      },
    })
  }

  return {
    useGetTransactions,
    useUpdateTransaction,
    useDeleteTransaction,
  }
}
