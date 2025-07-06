'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useGoals } from '../../../../hooks/useGoals'
import { Button } from '../../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../ui/dialog'
import { Form } from '../../../ui/form'
import FormInput from '../../../shared/Form/FormInput'
import FormDatePicker from '../../../shared/Form/FormDatePicker'
import { useState } from 'react'

interface CreateGoalDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const createGoalSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  targetValue: z.coerce
    .number()
    .min(0.01, 'Valor deve ser maior que zero')
    .nonnegative('Valor não pode ser negativo'),
  savedValue: z.coerce
    .number()
    .min(0.01, 'Valor não pode ser negativo')
    .optional(),
  deadline: z.date({
    required_error: 'Data limite é obrigatória',
  }),
})

type FormCreateGoal = z.infer<typeof createGoalSchema>

export function CreateGoalDialog({ open, setOpen }: CreateGoalDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { useCreateGoal } = useGoals()
  const createGoalMutation = useCreateGoal()

  const form = useForm<FormCreateGoal>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      name: '',
      description: '',
      targetValue: undefined,
      savedValue: undefined,
      deadline: undefined,
    },
  })

  const onSubmit = (data: FormCreateGoal) => {
    setIsSubmitting(true)
    createGoalMutation.mutate(
      {
        name: data.name,
        description: data.description,
        targetValue: data.targetValue,
        savedValue: data.savedValue,
        deadline: data.deadline.toISOString(),
      },
      {
        onSuccess: () => {
          setOpen(false)
          form.reset()
        },
        onSettled: () => {
          setIsSubmitting(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Meta</DialogTitle>
          <DialogDescription>
            Crie uma nova meta financeira para acompanhar seu progresso
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormInput
                form={form}
                name="name"
                label="Nome"
                placeholder="Viagem para Europa"
              />
              <FormInput
                form={form}
                name="description"
                label="Descrição"
                placeholder="Descreva sua meta (opcional)"
                isOptional
              />
              <FormInput
                form={form}
                name="targetValue"
                label="Valor total"
                placeholder="R$ 0,00"
                prefix="R$ "
                numeric
                withMask
              />
              <FormInput
                form={form}
                name="savedValue"
                label="Valor guardado"
                placeholder="R$ 0,00"
                prefix="R$ "
                numeric
                withMask
                isOptional
              />
              <FormDatePicker
                form={form}
                name="deadline"
                label="Data limite"
                placeholder="Selecione uma data"
                minDate={new Date()}
                maxDate={new Date(2050, 11, 31)}
                modal
              />
            </div>
            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting || createGoalMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || createGoalMutation.isPending}
              >
                {createGoalMutation.isPending ? 'Criando...' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
