import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiWallet } from '../api'
import { toast } from 'sonner'

export interface Goal {
  id: string
  userId: string
  name: string
  description: string
  targetValue: number
  savedValue: number
  deadline: string
  createdAt: string
  updatedAt: string
}

interface CreateGoalDTO {
  name: string
  description?: string
  targetValue: number
  savedValue?: number
  deadline?: string
}

interface UpdateGoalDTO {
  name?: string
  description?: string
  targetValue?: number
  deadline?: string
}

interface AddValueDTO {
  id: string
  amount: number
}

export function useGoals() {
  const queryClient = useQueryClient()

  const useGetGoals = () => {
    return useQuery<Goal[]>({
      queryKey: ['goals'],
      queryFn: async () => {
        const { data } = await apiWallet.get<Goal[]>('/goals')
        return data
      },
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    })
  }

  const useCreateGoal = () => {
    return useMutation({
      mutationFn: async (goalData: CreateGoalDTO) => {
        const { data } = await apiWallet.post<{ goal: Goal }>(
          '/goals',
          goalData
        )
        return data.goal
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['goals'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        toast.success('Meta criada com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao criar meta')
      },
    })
  }

  const useUpdateGoal = () => {
    return useMutation({
      mutationFn: async ({
        id,
        ...goalData
      }: UpdateGoalDTO & { id: string }) => {
        const { data } = await apiWallet.patch<{ goal: Goal }>(
          `/goals/${id}`,
          goalData
        )
        return data.goal
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['goals'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        toast.success('Meta atualizada com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao atualizar meta')
      },
    })
  }

  const useDeleteGoal = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        await apiWallet.delete(`/goals/${id}`)
        return id
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['goals'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        toast.success('Meta excluída com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao excluir meta')
      },
    })
  }

  const useAddValueToGoal = () => {
    return useMutation({
      mutationFn: async ({ id, amount }: AddValueDTO) => {
        const { data } = await apiWallet.patch<Goal>(`/goals/${id}/progress`, {
          amount,
        })
        return data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['goals'] })
        queryClient.invalidateQueries({ queryKey: ['transactions'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        toast.success('Valor adicionado com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao adicionar valor à meta')
      },
    })
  }

  return {
    useGetGoals,
    useCreateGoal,
    useUpdateGoal,
    useDeleteGoal,
    useAddValueToGoal,
  }
}

export const useAddValueToGoal = () => {
  const { useAddValueToGoal: addValueHook } = useGoals()
  return addValueHook()
}
