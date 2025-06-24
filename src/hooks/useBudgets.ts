import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  handleCreateBudget,
  handleDeleteBudget,
  handleGetBudgets,
  handleUpdateBudget,
} from '../api'
import { CreateBudgetDTO, UpdateBudgetDTO } from '../types/budgets.interface'

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () => handleGetBudgets(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBudgetDTO) => handleCreateBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
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
