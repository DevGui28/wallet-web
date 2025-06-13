import { useQuery } from '@tanstack/react-query'
import { handleGetInstallments } from '../api'

interface UseInstallmentsOptions {
  enabled?: boolean
}

export function useInstallments(
  creditcardId: string | undefined,
  date: string,
  options: UseInstallmentsOptions = {}
) {
  const { enabled = true } = options

  return useQuery({
    queryKey: ['installments', creditcardId, date],
    queryFn: () => handleGetInstallments({ creditcardId, date }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: !!creditcardId && enabled,
  })
}
