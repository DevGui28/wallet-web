'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { Goal } from '../../../../hooks/useGoals'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import FormInput from '@/components/shared/Form/FormInput'
import { Form } from '@/components/ui/form'
import { formatCurrency } from '../../../../lib/utils'
import { useAddValueToGoal } from '../../../../hooks/useGoals'

const addValueSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
})

type FormAddValue = z.infer<typeof addValueSchema>

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  goal: Goal
}

export function AddValueDialog({ open, setOpen, goal }: Props) {
  const addValueMutation = useAddValueToGoal()
  const form = useForm<FormAddValue>({
    resolver: zodResolver(addValueSchema),
  })

  const onSubmit = async (data: FormAddValue) => {
    try {
      await addValueMutation.mutateAsync({
        id: goal.id,
        amount: data.amount,
      })
      toast.success('Valor adicionado com sucesso!')
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error('Erro ao adicionar valor:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Adicionar valor para {goal.name}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Adicione um valor para seu objetivo financeiro
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="gap-4 space-y-4"
          >
            <FormInput
              label="Valor"
              name="amount"
              placeholder="R$ 0,00"
              prefix="R$ "
              form={form}
              withMask
              numeric
            />
            <div className="flex flex-col space-y-2 text-xs text-muted-foreground sm:text-sm">
              <p>Valor atual: {formatCurrency(goal.savedValue)}</p>
              <p>Valor alvo: {formatCurrency(goal.targetValue)}</p>
              <p>
                Valor restante:{' '}
                {formatCurrency(goal.targetValue - goal.savedValue)}
              </p>
            </div>
            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-8 text-xs sm:h-9 sm:text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={addValueMutation.isPending}
                className="h-8 text-xs sm:h-9 sm:text-sm"
              >
                {addValueMutation.isPending ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
