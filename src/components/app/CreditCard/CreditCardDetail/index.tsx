'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { handleGetCreditCards } from '../../../../api'
import FormInput from '../../../shared/Form/FormInput'
import { Button } from '../../../ui/button'
import { Form } from '../../../ui/form'
import { Skeleton } from '../../../ui/skeleton'
import { CreditCard } from '../CreditCardList'

type CreditCardDetailProps = {
  id: string
}

export default function CreditCardDetail({ id }: CreditCardDetailProps) {
  const [isSubmitting, setSubmitting] = useState(false)

  const router = useRouter()

  const { data: creditCards, isLoading } = useQuery({
    queryKey: ['credit-cards', id],
    queryFn: handleGetCreditCards,
  })

  const creditCard = creditCards?.find((card) => card.id === id)

  const form = useForm({
    defaultValues: {
      cardName: creditCard?.cardName,
      limit: creditCard?.limit,
      closingDay: creditCard?.closingDay,
      dueDay: creditCard?.dueDay,
    },
  })

  function onSubmit() {
    setSubmitting(true)
    console.log('submit')
    setTimeout(() => {
      setSubmitting(false)
    }, 3000)
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
              name="limit"
              label="Limite"
              placeholder="Limite"
              withMask
              numeric
              prefix="R$ "
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
          </div>
          <div className="mt-4 flex w-full items-center justify-end gap-4">
            <span
              className="cursor-pointer text-sm text-foreground hover:text-card-foreground hover:underline"
              onClick={() => router.back()}
            >
              Voltar
            </span>
            <Button className="px-8" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
