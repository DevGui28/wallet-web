'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

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

const addCreditCardSchema = z.object({
  cardName: z.string().min(1, 'Nome do cartão é obrigatório'),
  limit: z.string().min(1, 'Limite do cartão é obrigatório'),
  closingDay: z.string().min(1, 'Dia de fechamento é obrigatório'),
  dueDay: z.string().min(1, 'Dia de vencimento é obrigatório'),
  lastDigits: z.string().optional(),
})

type FormAddCreditCard = z.infer<typeof addCreditCardSchema>

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  onAddCreditCard: (data: {
    cardName: string
    limit: number
    closingDay: number
    dueDay: number
    lastDigits?: number
  }) => Promise<void>
}

export function AddCreditCardDialog({ open, setOpen, onAddCreditCard }: Props) {
  const [isSubmitting, setSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<FormAddCreditCard>({
    resolver: zodResolver(addCreditCardSchema),
    defaultValues: {
      cardName: '',
      limit: '',
      closingDay: '',
      dueDay: '',
      lastDigits: '',
    },
  })

  const onSubmit = async (data: FormAddCreditCard) => {
    const { cardName, limit, closingDay, dueDay, lastDigits } = data
    const payload = {
      cardName,
      limit: Number(limit.replace(/\D/g, '')) / 100,
      closingDay: Number(closingDay),
      dueDay: Number(dueDay),
      ...(lastDigits && { lastDigits: Number(lastDigits) }),
    }

    if (
      payload.closingDay > 31 ||
      payload.dueDay > 31 ||
      payload.closingDay < 1 ||
      payload.dueDay < 1
    ) {
      toast.error('Dia de fechamento ou vencimento inválido')
      return
    }

    try {
      setSubmitting(true)
      await onAddCreditCard(payload)
      toast.success('Cartão de crédito cadastrado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
      queryClient.invalidateQueries({ queryKey: ['credit-cards-detail'] })
      form.reset()
      setOpen(false)
    } catch (error) {
      toast.error('Erro ao cadastrar cartão de crédito')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Cadastrar novo cartão de crédito
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Preencha os dados do seu cartão de crédito
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Nome do cartão"
                placeholder="Ex: Nubank"
                form={form}
                name="cardName"
              />
              <FormInput
                label="Limite do cartão"
                name="limit"
                placeholder="R$ 4.000,00"
                prefix="R$ "
                form={form}
                withMask
                numeric
              />
              <FormInput
                label="Dia de fechamento"
                name="closingDay"
                form={form}
                placeholder="Ex: 10"
                withMask
                numeric
                maxLength={2}
              />
              <FormInput
                label="Dia de vencimento"
                name="dueDay"
                form={form}
                placeholder="Ex: 5"
                withMask
                maxLength={2}
                numeric
              />
              <FormInput
                label="Últimos 4 dígitos"
                name="lastDigits"
                form={form}
                placeholder="Ex: 1234"
                maxLength={4}
                numeric
                isOptional
              />
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
                disabled={isSubmitting}
                className="h-8 text-xs sm:h-9 sm:text-sm"
              >
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
