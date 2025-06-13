import { useQuery } from '@tanstack/react-query'
import { handleGetDashboard } from '../api'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: handleGetDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
  })
}
