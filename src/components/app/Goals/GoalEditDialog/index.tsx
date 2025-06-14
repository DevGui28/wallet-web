'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
        deadline: goal.deadline?.toISOString() || '',
        icon: goal.icon,
      })
    }
  }, [goal, open, form])

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
          <DialogTitle className="text-lg sm:text-xl">
            Editar Objetivo
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Atualize os detalhes do seu objetivo financeiro.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
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
              <Button type="submit" className="h-8 text-xs sm:h-9 sm:text-sm">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
