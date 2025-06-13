import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleGetSubscriptionPlans, handleUpdateUserPlan } from '../api'
import { UpdateUserPlanDTO } from '../types/subscription-plans.interface'

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: handleGetSubscriptionPlans,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

export function useUpdateUserPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserPlanDTO) => handleUpdateUserPlan(data.planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
