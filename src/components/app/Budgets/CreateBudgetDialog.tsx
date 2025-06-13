'use client'

import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'

const createBudgetSchema = z.object({
  category: z.string().min(1, 'Categoria é obrigatória'),
  limit: z.coerce.number().min(1, 'Valor deve ser maior que zero'),
})

type CreateBudgetFormValues = z.infer<typeof createBudgetSchema>

interface CreateBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  currentMonth: number
  currentYear: number
}

export function CreateBudgetDialog({
  open,
  onOpenChange,
  onSuccess,
  currentMonth,
  currentYear,
}: CreateBudgetDialogProps) {
  const [categories, setCategories] = useState<CategoriesResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CreateBudgetFormValues>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      category: '',
      limit: 0,
    },
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await handleGetCategories(TransactionType.EXPENSE)
        setCategories(data)
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
      }
    }

    if (open) {
      fetchCategories()
      form.reset()
    }
  }, [open, form])

  const onSubmit = async (values: CreateBudgetFormValues) => {
    setIsLoading(true)
    try {
      await handleCreateBudget({
        category: values.category,
        limit: values.limit,
        month: currentMonth,
        year: currentYear,
      })
      onSuccess()
    } catch (error) {
      console.error('Erro ao criar orçamento:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Orçamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
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
                {isLoading ? 'Criando...' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
