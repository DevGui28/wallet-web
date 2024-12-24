'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { toast } from 'sonner'
import { handleCreateCreditCard } from '../../../api'
import TopNav from '../../../components/app/Header/TopNav'
import FormInput from '../../../components/shared/Form/FormInput'
import { Button } from '../../../components/ui/button'
import { Form } from '../../../components/ui/form'
import { tokenName } from '../../../constants/cookies'
import {
  FormAddCreditCard,
  formAddCreditCardSchema,
} from '../../../schemas/add-credit-card'
import { JwtPayload } from '../../../types/jwt.interface'

export default function AddCreditCardPage() {
  const cookies = parseCookies()
  const token = cookies[tokenName]
  const payload = jwtDecode<JwtPayload>(token)
  const name = payload.user.name

  const queryClient = useQueryClient()

  const router = useRouter()

  const [isSubmitting, setSubmitting] = useState(false)

  const form = useForm<FormAddCreditCard>({
    resolver: zodResolver(formAddCreditCardSchema),
    defaultValues: {
      cardName: '',
      limit: '',
      closingDay: '',
      dueDay: '',
    },
  })

  const onSubmit = async (data: FormAddCreditCard) => {
    const { cardName, limit, closingDay, dueDay, lastDigits } = data
    const payload = {
      cardName,
      limit: Number(limit),
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
      await handleCreateCreditCard(payload)
      toast.success('Cartão de crédito cadastrado com sucesso')
      queryClient.invalidateQueries('credit-cards')
      form.reset()
      router.push('/credit-card')
    } catch (error) {
      toast.error('Erro ao cadastrar cartão de crédito')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <TopNav title="Cadastre um novo cartão de crédito" name={name} />
      <div className="mt-4 flex w-full items-center justify-center px-4">
        <div className="mb-6 w-full max-w-4xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col"
            >
              <div className="mb-4 grid gap-4 lg:grid-cols-2">
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
              <div className="flex w-full items-center justify-end gap-4">
                <span
                  className="cursor-pointer text-sm text-foreground hover:text-card-foreground hover:underline"
                  onClick={() => router.back()}
                >
                  Voltar
                </span>
                <Button className="px-8" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
