'use client'

import { Plus } from '@phosphor-icons/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { handleGetCategories, handleGetCreditCards } from '../../../../api'
import FormInput from '../../../shared/Form/FormInput'
import { Button } from '../../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { paymentMethodMapper } from '../../../../lib/mappers'
import { CustomSelect } from '../../../shared/CustomSelect'
import FormDatePicker from '../../../shared/Form/FormDatePicker'
import FormSelect from '../../../shared/Form/FormSelect'
import { Form } from '../../../ui/form'
import { TransactionType } from '../interfaces'
import { FormAddTransaction, formAddTransactionSchema } from './schema'

export default function AddTransactionDialog() {
  const [open, setOpen] = useState<boolean>(false)
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

  console.log({ date: form.watch('date') })

  const handleClose = () => {
    setOpen(false)
    setType(undefined)
    form.reset()
  }

  const paymentMethods = Object.entries(paymentMethodMapper)
    .filter(([key]) => (type === 'INCOME' ? !key.includes('CARD') : true))
    .map(([key, value]) => ({
      value: key,
      label: value,
    }))

  const onSubmit = (data: FormAddTransaction) => {
    console.log(data, type)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="gap-2 rounded-full px-6">
          <Plus size={16} weight="bold" />
          Adicionar transação
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar transação</DialogTitle>
          <DialogDescription>
            Preencha os campos para adicionar uma transação
          </DialogDescription>
        </DialogHeader>
        <CustomSelect
          label="Tipo de transação"
          placeholder="Selecione o tipo de transação"
          options={[
            { value: TransactionType.EXPENSE, label: 'Despesa' },
            { value: TransactionType.INCOME, label: 'Receita' },
          ]}
          onChange={(value) => setType(value as TransactionType)}
        />
        {type && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
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
                maxDate={new Date('2026-12-31')}
                minDate={new Date('2021-01-01')}
                modal
              />
              <DialogFooter>
                <Button onClick={handleClose} variant="link">
                  Cancelar
                </Button>
                <Button type="submit">Adicionar</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
