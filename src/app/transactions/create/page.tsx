'use client'

import { Plus } from '@phosphor-icons/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from 'react-query'
import {
  handleCreateTransaction,
  handleGetCategories,
  handleGetCreditCards,
} from '../../../api'
import FormInput from '../../../components/shared/Form/FormInput'
import { Button } from '../../../components/ui/button'

import { zodResolver } from '@hookform/resolvers/zod'
import { addYears } from 'date-fns'
import { jwtDecode } from 'jwt-decode'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'
import { toast } from 'sonner'
import { paymentMethodMapper } from '../../../components/../lib/mappers'
import TopNav from '../../../components/app/Header/TopNav'
import { CustomSelect } from '../../../components/shared/CustomSelect'
import FormDatePicker from '../../../components/shared/Form/FormDatePicker'
import FormSelect from '../../../components/shared/Form/FormSelect'
import { Form } from '../../../components/ui/form'
import { tokenName } from '../../../constants/cookies'
import {
  FormAddTransaction,
  formAddTransactionSchema,
} from '../../../schemas/add-transaction'
import { JwtPayload } from '../../../types/jwt.interface'
import {
  PaymentMethod,
  TransactionType,
} from '../../../types/transactions.interface'

export default function AddTransactionPage() {
  const cookies = parseCookies()
  const token = cookies[tokenName]
  const payload = jwtDecode<JwtPayload>(token)
  const name = payload.user.name

  const router = useRouter()

  const [type, setType] = useState<TransactionType | null>(null)
  const [typeIncome, setTypeIncome] = useState<string | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)

  const { data: categories } = useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      if (!type) return
      const data = await handleGetCategories(type)
      return data.map((category) => ({
        value: category.id,
        label: category.name,
      }))
    },
  })

  const { data: creditCards, isLoading } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: async () => {
      const creditCard = await handleGetCreditCards()
      return creditCard.map((card) => ({
        value: card.id,
        label: card.cardName,
      }))
    },
  })

  console.log({ creditCards, isLoading })

  const queryClient = useQueryClient()

  const form = useForm<FormAddTransaction>({
    resolver: zodResolver(formAddTransactionSchema),
  })

  const paymentMethods = Object.entries(paymentMethodMapper)
    .filter(([key]) =>
      type === 'INCOME' ? !key.includes('CARD') && !key.includes('SLIP') : true
    )
    .map(([key, value]) => ({
      value: key,
      label: value,
    }))

  function handleResetForm() {
    form.reset()
    setType(null)
    setTypeIncome(null)
  }

  const onSubmit = async (data: FormAddTransaction) => {
    if (!type) return
    const isRecurring =
      (typeIncome === 'RECURRING' && type === TransactionType.EXPENSE) ||
      data.paymentMethod === PaymentMethod.CREDIT_CARD
    try {
      setSubmitting(true)
      await handleCreateTransaction({
        ...data,
        totalAmount: Number(data.totalAmount),
        totalInstallments: data.totalInstallments
          ? Number(data.totalInstallments)
          : undefined,
        isRecurring,
        type,
      })
      handleResetForm()
      queryClient.invalidateQueries('transactions')
      queryClient.invalidateQueries('bills')
      queryClient.invalidateQueries('installments')
      toast.success('Transação adicionada com sucesso!')
    } catch (error: any) {
      toast.error('Erro ao adicionar transação!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <TopNav title="Adicionar uma nova transação" name={name} />
      <div className="mt-4 flex w-full items-center justify-center px-4">
        <div className="mb-6 w-full max-w-4xl">
          <CustomSelect
            className="mb-4"
            label="Tipo de transação"
            placeholder="Selecione o tipo de transação"
            value={type}
            options={[
              { value: TransactionType.EXPENSE, label: 'Despesa' },
              { value: TransactionType.INCOME, label: 'Receita' },
            ]}
            onChange={(value) => setType(value as TransactionType)}
          />
          {type === TransactionType.EXPENSE && (
            <CustomSelect
              className="mb-4"
              label="Qual o tipo da despesa?"
              placeholder="Essa despesa é normal ou fixa?"
              value={typeIncome}
              options={[
                { value: 'NORMAL', label: 'Normal' },
                { value: 'RECURRING', label: 'Conta Fixa' },
              ]}
              description="As despesas fixas serão adicionadas automaticamente todo mês pelo proximo 1 ano."
              onChange={(value) => setTypeIncome(value)}
            />
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col"
            >
              {type && (
                <div className="mb-4 grid gap-4 lg:grid-cols-2">
                  <FormInput
                    label="Identificação"
                    name="name"
                    placeholder="Ifood, Uber, Mercado, etc..."
                    form={form}
                  />
                  <FormInput
                    label="Descição"
                    name="description"
                    placeholder="Pizza, ida para festa, etc..."
                    form={form}
                    isOptional
                  />
                  <FormSelect
                    form={form}
                    name="categoryId"
                    data={categories}
                    label="Categoria"
                  />
                  <FormInput
                    label="Valor da transação"
                    name="totalAmount"
                    placeholder="R$ 0,00"
                    prefix="R$ "
                    form={form}
                    withMask
                    numeric
                  />
                  <FormSelect
                    form={form}
                    name="paymentMethod"
                    data={paymentMethods}
                    label="Método de pagamento"
                  />
                  {form.watch('paymentMethod') === 'CREDIT_CARD' &&
                    (!isLoading && creditCards?.length ? (
                      <>
                        <FormSelect
                          form={form}
                          name="creditCardId"
                          data={creditCards}
                          label="Selecione o cartão de crédito"
                        />
                        <FormInput
                          label="Total de parcelas"
                          name="totalInstallments"
                          placeholder="1"
                          form={form}
                          numeric
                        />
                        {form.formState.errors.creditCardId && (
                          <span className="mt-2 text-xs text-destructive">
                            Você precisa adicionar um cartão de crédito para
                            poder adicionar uma transação com esse método de
                            pagamento.
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="mt-2 flex w-full flex-col gap-1">
                        <p className="text-xs text-foreground">
                          Você não possui nenhum cartão de crédito cadastrado.
                        </p>
                        <Link
                          href="/credit-card/create"
                          className="flex items-center justify-center gap-2 rounded-md bg-accent p-3 text-sm text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground/80 md:justify-normal"
                        >
                          <Plus size={16} weight="bold" />
                          Adicionar um cartão de crédito
                        </Link>
                        {form.formState.errors.creditCardId && (
                          <span className="mt-2 text-xs text-destructive">
                            Você precisa adicionar um cartão de crédito para
                            poder adicionar uma transação com esse método de
                            pagamento.
                          </span>
                        )}
                      </div>
                    ))}

                  <FormDatePicker
                    form={form}
                    name="date"
                    label="Data da transação"
                    placeholder="Selecione a data da transação"
                    maxDate={addYears(new Date(), 2)}
                    minDate={new Date('2021-01-01')}
                    modal
                  />
                </div>
              )}
              <div className="flex w-full items-center justify-end gap-4">
                <span
                  className="cursor-pointer text-sm text-foreground hover:text-card-foreground hover:underline"
                  onClick={() => router.back()}
                >
                  Voltar
                </span>
                <Button className="px-8" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adicionando...' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
