'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { handleFindCreditCard } from '../../../../api'
import { FormAddCreditCard } from '../../../../schemas/add-credit-card'
import FormInput from '../../../shared/Form/FormInput'
import { Button } from '../../../ui/button'
import { Form } from '../../../ui/form'
import { Skeleton } from '../../../ui/skeleton'
import { CreditCard } from '../CreditCardList'
import DeletedCardDialog from '../DeletedCardDialog'
import { useUpdateCreditCard } from '../../../../hooks/useCreditCards'

type CreditCardDetailProps = {
  id: string
}

export default function CreditCardDetail({ id }: CreditCardDetailProps) {
  const router = useRouter()
  const updateCreditCardMutation = useUpdateCreditCard()

  const { data: creditCard, isLoading } = useQuery({
    queryKey: ['credit-cards-detail', id],
    queryFn: () => handleFindCreditCard(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })

  const form = useForm<Partial<FormAddCreditCard>>()

  useEffect(() => {
    if (creditCard) {
      form.reset({
        cardName: creditCard.cardName,
        limit: creditCard.limit,
        closingDay: creditCard.closingDay.toString(),
        dueDay: creditCard.dueDay.toString(),
        lastDigits: creditCard.lastDigits?.toString(),
      })
    }
  }, [creditCard])

  async function onSubmit(data: Partial<FormAddCreditCard>) {
    const payload = {
      ...(data.cardName === creditCard?.cardName
        ? {}
        : { cardName: data.cardName }),
      ...(data.limit === creditCard?.limit
        ? {}
        : { limit: data.limit ? Number(data.limit) : null }),
      ...(data.closingDay === creditCard?.closingDay.toString()
        ? {}
        : { closingDay: Number(data.closingDay) }),
      ...(data.dueDay === creditCard?.dueDay.toString()
        ? {}
        : { dueDay: Number(data.dueDay) }),
      ...(data.lastDigits === creditCard?.lastDigits?.toString()
        ? {}
        : { lastDigits: Number(data.lastDigits) }),
    }

    try {
      await updateCreditCardMutation.mutateAsync({ id, data: payload })
      toast.success('Cartão atualizado com sucesso')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex w-full flex-col items-start justify-start gap-8 lg:flex-row">
      {isLoading && <Skeleton className="h-40 w-96" />}
      {creditCard && <CreditCard creditCard={creditCard} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
            <FormInput
              form={form}
              name="cardName"
              label="Nome do cartão"
              placeholder="Nome do cartão"
            />
            <FormInput
              form={form}
              name="closingDay"
              label="Dia de fechamento"
              placeholder="Dia de fechamento"
              numeric
              withMask
            />
            <FormInput
              form={form}
              name="dueDay"
              label="Dia de vencimento"
              placeholder="Dia de vencimento"
              numeric
              withMask
            />
            <FormInput
              form={form}
              name="limit"
              label="Limite"
              placeholder="Limite"
              withMask
              numeric
              prefix="R$ "
              isOptional
            />
            <FormInput
              form={form}
              name="lastDigits"
              label="Últimos 4 dígitos"
              placeholder="Últimos 4 dígitos"
              numeric
              maxLength={4}
              isOptional
            />
          </div>
          <div className="mt-4 flex w-full items-center justify-between gap-4">
            <DeletedCardDialog id={id} />
            <div className="flex items-center justify-center gap-4">
              <span
                className="cursor-pointer text-sm text-foreground hover:text-card-foreground hover:underline"
                onClick={() => router.back()}
              >
                Voltar
              </span>
              <Button
                type="submit"
                className="px-8"
                disabled={updateCreditCardMutation.isPending}
              >
                {updateCreditCardMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
