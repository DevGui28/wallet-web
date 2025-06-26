import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  handleCreateRecurringBill,
  handleDeleteRecurringBill,
  handleFindRecurringBills,
  handleUpdateRecurringBill,
} from '../api'
import {
  CreateRecurringBillDTO,
  UpdateRecurringBillDTO,
} from '../types/recurring-bills.interface'
import { toast } from 'sonner'

export const useRecurringBills = () => {
  return useQuery({
    queryKey: ['recurring-bills'],
    queryFn: handleFindRecurringBills,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

export const useCreateRecurringBill = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRecurringBillDTO) =>
      handleCreateRecurringBill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-bills'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Conta fixa criada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao criar conta fixa')
    },
  })
}

export const useUpdateRecurringBill = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecurringBillDTO }) =>
      handleUpdateRecurringBill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-bills'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Conta fixa atualizada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao atualizar conta fixa')
    },
  })
}

export const useDeleteRecurringBill = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => handleDeleteRecurringBill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-bills'] })
    },
  })
}
