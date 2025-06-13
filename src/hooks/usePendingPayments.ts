import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleGetBills, handlePaySplitOrRecurrence } from '../api'

interface UsePendingPaymentsOptions {
  enabled?: boolean
}

export function usePendingPayments(
  date: string,
  options: UsePendingPaymentsOptions = {}
) {
  const { enabled = true } = options

  return useQuery({
    queryKey: ['pendingPayments', date],
    queryFn: () => handleGetBills({ date }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled,
  })
}

export function usePayPendingPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, paidAt }: { id: string; paidAt: Date }) =>
      handlePaySplitOrRecurrence(id, paidAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
