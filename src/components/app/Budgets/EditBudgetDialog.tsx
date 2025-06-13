'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleUpdateBudget } from '../../../api'
import { Budget } from '../../../types/budgets.interface'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'

const editBudgetSchema = z.object({
  limit: z.coerce.number().min(1, 'Valor deve ser maior que zero'),
})

type EditBudgetFormValues = z.infer<typeof editBudgetSchema>

interface EditBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget: Budget
  onSuccess: () => void
}

export function EditBudgetDialog({
  open,
  onOpenChange,
  budget,
  onSuccess,
}: EditBudgetDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<EditBudgetFormValues>({
    resolver: zodResolver(editBudgetSchema),
    defaultValues: {
      limit: budget.limit,
    },
  })

  const onSubmit = async (values: EditBudgetFormValues) => {
    setIsLoading(true)
    try {
      await handleUpdateBudget(budget.id, {
        limit: values.limit,
      })
      onSuccess()
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Orçamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="mb-4">
              <p className="text-sm font-medium">Categoria</p>
              <p className="text-sm text-muted-foreground">{budget.category}</p>
            </div>
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
