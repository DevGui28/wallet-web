import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  handleDeleteBudget,
  handleGetBudgets,
  handleUpdateBudget,
} from '../api'
import { UpdateBudgetDTO } from '../types/budgets.interface'

export function useBudgets(month?: number, year?: number) {
  return useQuery({
    queryKey: ['budgets', month, year],
    queryFn: () => handleGetBudgets(month, year),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetDTO }) =>
      handleUpdateBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: handleDeleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
