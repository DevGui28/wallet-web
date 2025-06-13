'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAddValueToGoal } from '../../../../hooks/useGoals'
import { Goal } from '../../../../api/goals'

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

const addValueSchema = z.object({
  amount: z.string().min(1, 'Valor é obrigatório'),
})

type FormAddValue = z.infer<typeof addValueSchema>

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  goal: Goal
  onAddValue: (goalId: string, amount: number) => Promise<void>
}

export function AddValueDialog({ open, setOpen, goal, onAddValue }: Props) {
  const addValueMutation = useAddValueToGoal()

  const form = useForm<FormAddValue>({
    resolver: zodResolver(addValueSchema),
    defaultValues: {
      amount: '',
    },
  })

  const onSubmit = async (data: FormAddValue) => {
    try {
      const amount = Number(data.amount.replace(/\D/g, '')) / 100
      // Usar tanto o hook personalizado quanto a função onAddValue para compatibilidade
      await Promise.all([
        addValueMutation.mutateAsync({ id: goal.id, amount }),
        onAddValue(goal.id, amount),
      ])
      toast.success('Valor adicionado com sucesso!')
      form.reset()
      setOpen(false)
    } catch (error) {
      toast.error('Erro ao adicionar valor')
      console.error('Erro ao adicionar valor:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Adicionar valor para {goal.title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Adicione um valor para seu objetivo financeiro
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <p>Valor atual: R$ {goal.currentAmount.toFixed(2)}</p>
              <p>Valor alvo: R$ {goal.targetAmount.toFixed(2)}</p>
              <p>
                Valor restante: R${' '}
                {(goal.targetAmount - goal.currentAmount).toFixed(2)}
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
