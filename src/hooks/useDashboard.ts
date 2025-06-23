import { useQuery } from '@tanstack/react-query'
import { handleGetDashboard } from '../api'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: handleGetDashboard,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: true,
  })
}
