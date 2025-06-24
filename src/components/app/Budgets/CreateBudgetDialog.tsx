'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleCreateBudget, handleGetCategories } from '../../../api'
import { TransactionType } from '../../../types/transactions.interface'
import { CategoriesResponse } from '../../../types/categories.interface'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Form } from '../../ui/form'
import { Button } from '../../ui/button'
import FormInput from '../../../components/shared/Form/FormInput'
import FormSelect from '../../../components/shared/Form/FormSelect'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateBudgetDTO } from '../../../types/budgets.interface'

const createBudgetSchema = z.object({
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  limit: z.coerce.number().min(1, 'Valor deve ser maior que zero'),
})

type CreateBudgetFormValues = z.infer<typeof createBudgetSchema>

interface CreateBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBudgetDialog({
  open,
  onOpenChange,
}: CreateBudgetDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<CreateBudgetFormValues>({
    resolver: zodResolver(createBudgetSchema),
  })

  const { data: categories } = useQuery<CategoriesResponse[]>({
    queryKey: ['categories-expense'],
    queryFn: () => handleGetCategories(TransactionType.EXPENSE),
  })

  const createBudgetMutation = useMutation({
    mutationFn: (data: CreateBudgetDTO) => handleCreateBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Orçamento criado com sucesso!')
      form.reset()
      onOpenChange(false)
    },
    onError: (error) => {
      throw error
    },
  })

  const onAddBudget = async (data: CreateBudgetFormValues) => {
    await createBudgetMutation.mutateAsync({
      categoryId: data.categoryId,
      limit: data.limit,
    })
  }

  const onSubmit = async (values: CreateBudgetFormValues) => {
    setIsLoading(true)
    try {
      await onAddBudget(values)
    } catch (error) {
      toast.error('Erro ao criar orçamento: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!categories) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Orçamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormSelect
              form={form}
              name="categoryId"
              label="Categoria"
              placeholder="Selecione uma categoria"
              data={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
            <FormInput
              form={form}
              name="limit"
              label="Limite"
              placeholder="R$ 0,00"
              prefix="R$ "
              withMask
              numeric
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Criando...' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
