'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Goal, useGoals } from '../../../../hooks/useGoals'
import { formatCurrency } from '../../../../lib/utils'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { Form } from '@/components/ui/form'
import FormInput from '../../../shared/Form/FormInput'
import FormDatePicker from '../../../shared/Form/FormDatePicker'

const editGoalSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  targetValue: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  deadline: z.date().optional(),
  description: z.string().optional(),
})

type FormEditGoal = z.infer<typeof editGoalSchema>

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  goal: Goal | null
}

export function GoalEditDialog({ open, setOpen, goal }: Props) {
  const { useUpdateGoal } = useGoals()
  const updateGoalMutation = useUpdateGoal()

  const form = useForm<FormEditGoal>({
    resolver: zodResolver(editGoalSchema),
    defaultValues: {
      name: goal?.name || '',
      targetValue: Number(goal?.targetValue) || 0,
      deadline: goal?.deadline ? new Date(goal.deadline) : undefined,
      description: goal?.description || '',
    },
  })

  useEffect(() => {
    if (goal && open) {
      form.reset({
        name: goal.name,
        targetValue: Number(goal.targetValue),
        deadline: goal.deadline ? new Date(goal.deadline) : undefined,
        description: goal.description || '',
      })
    }
  }, [goal, open, form])

  const onSubmit = (data: FormEditGoal) => {
    if (!goal) return

    updateGoalMutation.mutate(
      {
        id: goal.id,
        name: data.name,
        targetValue: data.targetValue,
        deadline: data.deadline?.toISOString(),
        description: data.description,
      },
      {
        onSuccess: () => {
          setOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Editar Objetivo
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Atualize os detalhes do seu objetivo financeiro.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {goal && (
              <div className="rounded-md bg-accent p-3 text-sm">
                <p className="font-medium">
                  Valor já guardado: {formatCurrency(goal.savedValue)}
                </p>
              </div>
            )}
            <div className="grid gap-3">
              <FormInput
                name="name"
                label="Nome"
                placeholder="Ex: Viagem para o Japão"
                form={form}
              />
              <FormInput
                name="description"
                label="Descrição"
                placeholder="Ex: Viagem para o Japão"
                form={form}
                isOptional
              />
              <FormInput
                name="targetValue"
                label="Valor Total"
                placeholder="0,00"
                form={form}
                prefix="R$ "
                numeric
                withMask
              />
              <FormDatePicker
                name="deadline"
                label="Data Limite"
                placeholder="Selecione uma data"
                form={form}
                future={true}
                minDate={new Date()}
                maxDate={new Date(2050, 11, 31)}
                optional
                modal
              />
            </div>
            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-8 text-xs sm:h-9 sm:text-sm"
                disabled={updateGoalMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="h-8 text-xs sm:h-9 sm:text-sm"
                disabled={updateGoalMutation.isPending}
              >
                {updateGoalMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
