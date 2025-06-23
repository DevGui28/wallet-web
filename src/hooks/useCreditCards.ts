import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  handleCreateCreditCard,
  handleDeleteCreditCard,
  handleGetCreditCards,
  handleUpdateCreditCard,
} from '../api'
import {
  CreateCreditCard,
  UpdateCreditCard,
} from '../types/credit-card.interface'

interface UseCreditCardsOptions {
  enabled?: boolean
}

export function useCreditCards(options: UseCreditCardsOptions = {}) {
  const { enabled = true } = options

  return useQuery({
    queryKey: ['creditCards'],
    queryFn: handleGetCreditCards,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled,
  })
}

export function useCreateCreditCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCreditCard) => handleCreateCreditCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditCards'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateCreditCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCreditCard }) =>
      handleUpdateCreditCard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditCards'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['credit-cards-detail'] })
    },
  })
}

export function useDeleteCreditCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => handleDeleteCreditCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditCards'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
