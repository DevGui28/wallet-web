'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useUpdateGoal } from '../../../../hooks/useGoals'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Form } from '@/components/ui/form'

const editGoalSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  targetAmount: z.string().min(1, 'Valor é obrigatório'),
  deadline: z.string().min(1, 'Data limite é obrigatória'),
  icon: z.string(),
})

type FormEditGoal = z.infer<typeof editGoalSchema>

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  goal: Goal | null
}

export function GoalEditDialog({ open, setOpen, goal }: Props) {
  const updateGoalMutation = useUpdateGoal()

  const form = useForm<FormEditGoal>({
    resolver: zodResolver(editGoalSchema),
    defaultValues: {
      title: '',
      targetAmount: '',
      deadline: '',
      icon: '✈️',
    },
  })

  useEffect(() => {
    if (goal && open) {
      form.reset({
        title: goal.title,
        targetAmount: goal.targetAmount.toString(),
        deadline: goal.deadline,
        icon: goal.icon,
      })
    }
  }, [goal, open, form])

  const onSubmit = async (data: FormEditGoal) => {
    if (!goal) return

    try {
      await updateGoalMutation.mutateAsync({
        id: goal.id,
        data: {
          title: data.title,
          targetAmount: parseFloat(data.targetAmount),
          deadline: data.deadline,
          icon: data.icon,
        },
      })

      toast.success('Objetivo atualizado com sucesso!')
      setOpen(false)
    } catch (error) {
      toast.error('Erro ao atualizar objetivo')
      console.error('Erro ao atualizar objetivo:', error)
    }
  }

  const icons = [
    { value: '✈️', label: 'Viagem' },
    { value: '🚗', label: 'Carro' },
    { value: '🏠', label: 'Casa' },
    { value: '🛡️', label: 'Emergência' },
    { value: '🎓', label: 'Educação' },
    { value: '💻', label: 'Tecnologia' },
    { value: '👶', label: 'Família' },
    { value: '🏝️', label: 'Aposentadoria' },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Editar Objetivo</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Atualize os detalhes do seu objetivo financeiro.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Ex: Viagem para o Japão"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetAmount">Valor Total (R$)</Label>
              <Input
                id="targetAmount"
                type="number"
                {...form.register('targetAmount')}
                placeholder="0,00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Data Limite</Label>
              <Input id="deadline" type="date" {...form.register('deadline')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Ícone</Label>
              <Select
                value={form.watch('icon')}
                onValueChange={(value) => form.setValue('icon', value)}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {icons.map((iconOption) => (
                    <SelectItem key={iconOption.value} value={iconOption.value}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{iconOption.value}</span>
                        {iconOption.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                disabled={updateGoalMutation.isPending}
                className="h-8 text-xs sm:h-9 sm:text-sm"
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
