'use client'

import { Plus } from '@phosphor-icons/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { handleGetCategories, handleGetCreditCards } from '../../../api'
import FormInput from '../../../components/shared/Form/FormInput'
import { Button } from '../../../components/ui/button'

import { zodResolver } from '@hookform/resolvers/zod'
import { addYears } from 'date-fns'
import { jwtDecode } from 'jwt-decode'
import Link from 'next/link'
import { parseCookies } from 'nookies'
import { paymentMethodMapper } from '../../../components/../lib/mappers'
import { JwtPayload } from '../../../components/app/common/interfaces/jwt'
import TopNav from '../../../components/app/Header/TopNav'
import { TransactionType } from '../../../components/app/Transactions/interfaces'
import {
  FormAddTransaction,
  formAddTransactionSchema,
} from '../../../components/app/Transactions/schemas/add-transaction'
import { CustomSelect } from '../../../components/shared/CustomSelect'
import FormDatePicker from '../../../components/shared/Form/FormDatePicker'
import FormSelect from '../../../components/shared/Form/FormSelect'
import { Form } from '../../../components/ui/form'
import { tokenName } from '../../../constants/cookies'

export default function AddTransactionDialog() {
  const cookies = parseCookies()
  const token = cookies[tokenName]
  const payload = jwtDecode<JwtPayload>(token)
  const name = payload.user.name
  const [type, setType] = useState<TransactionType>()

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

  const { data: creditCards } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: async () => {
      const data = await handleGetCreditCards()
      return data.map((creditCard) => ({
        value: creditCard.id,
        label: creditCard.cardName,
      }))
    },
  })

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

  const onSubmit = (data: FormAddTransaction) => {
    console.log(data, type)
  }

  return (
    <>
      <TopNav title="Adicionar transações" name={name} />
      <div className="flex w-full items-center justify-between px-16">
        <div className="mb-6 w-full">
          <CustomSelect
            className="mb-4"
            label="Tipo de transação"
            placeholder="Selecione o tipo de transação"
            options={[
              { value: TransactionType.EXPENSE, label: 'Despesa' },
              { value: TransactionType.INCOME, label: 'Receita' },
            ]}
            onChange={(value) => setType(value as TransactionType)}
          />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col"
            >
              {type && (
                <div className="mb-4 grid gap-4 md:grid-cols-2">
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
                    (creditCards ? (
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
                      </>
                    ) : (
                      <Link
                        href="/credit-card/create"
                        className="flex items-center gap-2 text-accent hover:underline"
                      >
                        <Plus size={16} weight="bold" />
                        Adicionar um cartão de crédito
                      </Link>
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
                <Link href="/transactions">
                  <span className="text-sm text-foreground hover:text-card-foreground hover:underline">
                    Cancelar
                  </span>
                </Link>
                <Button className="px-8" type="submit">
                  Adicionar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
