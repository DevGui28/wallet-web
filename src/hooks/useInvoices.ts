import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleGetInvoices, handlePayInvoice } from '../api'
import { toast } from 'sonner'

interface UseInvoicesOptions {
  enabled?: boolean
}

export function useInvoices(options: UseInvoicesOptions = {}) {
  const { enabled = true } = options

  return useQuery({
    queryKey: ['invoices'],
    queryFn: handleGetInvoices,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
    enabled,
  })
}

export function usePayInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => handlePayInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Fatura paga com sucesso!')
    },
  })
}
