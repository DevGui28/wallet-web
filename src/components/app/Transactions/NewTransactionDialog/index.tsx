'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useQuery, useQueryClient } from 'react-query'
import { addYears } from 'date-fns'

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
import FormSelect from '@/components/shared/Form/FormSelect'
import FormDatePicker from '@/components/shared/Form/FormDatePicker'
import { Form } from '@/components/ui/form'
import { CustomSelect } from '@/components/shared/CustomSelect'
import { Plus } from '@phosphor-icons/react'
import { AddCreditCardDialog } from '../../CreditCard/AddCreditCardDialog'
import {
  handleCreateCreditCard,
  handleGetCategories,
  handleGetCreditCards,
} from '@/api'
import { paymentMethodMapper } from '@/lib/mappers'
import {
  FormAddTransaction,
  formAddTransactionSchema,
} from '@/schemas/add-transaction'
import { PaymentMethod, TransactionType } from '@/types/transactions.interface'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  onAddTransaction: (data: any) => Promise<void>
}

export function NewTransactionDialog({
  open,
  setOpen,
  onAddTransaction,
}: Props) {
  const [type, setType] = useState<TransactionType | null>(null)
  const [typeIncome, setTypeIncome] = useState<string | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const [openAddCardDialog, setOpenAddCardDialog] = useState(false)

  const queryClient = useQueryClient()

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

  const form = useForm<FormAddTransaction>({
    resolver: zodResolver(formAddTransactionSchema),
  })

  const paymentMethods = Object.entries(paymentMethodMapper)
    .filter(([key]) =>
      type === 'INCOME'
        ? !key.includes('CARD') &&
          !key.includes('SLIP') &&
          !key.includes('INVOICE')
        : !key.includes('INVOICE')
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
      await onAddTransaction({
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
      setOpen(false)
    } catch (error: any) {
      toast.error('Erro ao adicionar transação!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Nova Transação
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Preencha os campos para adicionar uma nova transação
          </DialogDescription>
        </DialogHeader>
        <div className="mb-4 w-full">
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
                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Identificação"
                    name="name"
                    placeholder={
                      type === TransactionType.EXPENSE
                        ? 'Ifood, Uber, Mercado, etc...'
                        : 'Salário, Venda de produto, etc...'
                    }
                    form={form}
                  />
                  <FormInput
                    label="Descição"
                    name="description"
                    placeholder={
                      type === TransactionType.EXPENSE
                        ? 'Pizza, ida para festa, etc...'
                        : 'Salário do mês, Venda de produto, etc...'
                    }
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
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOpenAddCardDialog(true)}
                          className="flex h-9 w-full items-center justify-center gap-2 text-xs sm:text-sm"
                        >
                          <Plus size={14} className="sm:size-4" weight="bold" />
                          Adicionar um cartão de crédito
                        </Button>
                        <AddCreditCardDialog
                          open={openAddCardDialog}
                          setOpen={setOpenAddCardDialog}
                          onAddCreditCard={async (data) => {
                            try {
                              await handleCreateCreditCard(data)
                              queryClient.invalidateQueries('credit-cards')
                              return Promise.resolve()
                            } catch (error) {
                              return Promise.reject(error)
                            }
                          }}
                        />
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
                  disabled={isSubmitting || !type}
                  className="h-8 text-xs sm:h-9 sm:text-sm"
                >
                  {isSubmitting ? 'Adicionando...' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
