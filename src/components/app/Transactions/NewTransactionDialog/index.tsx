'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useQueryClient, useQuery } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()
  const [type, setType] = useState<TransactionType | null>(null)
  const [typeIncome, setTypeIncome] = useState<string | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const [openAddCardDialog, setOpenAddCardDialog] = useState(false)

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

  const { data: creditCards, isLoading: creditCardsLoading } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: handleGetCreditCards,
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
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['bills'] })
      queryClient.invalidateQueries({ queryKey: ['installments'] })
      toast.success('Transação adicionada com sucesso!')
      setOpen(false)
    } catch (error: any) {
      console.error('Erro ao adicionar transação:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] sm:max-w-2xl 2xl:max-w-[1000px]">
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
              { value: TransactionType.INVESTMENT, label: 'Investimento' },
            ]}
            onChange={(value) => setType(value as TransactionType)}
          />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col"
            >
              {type && (
                <div className="mb-4 grid gap-4 2xl:grid-cols-2">
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
                    (!creditCardsLoading && creditCards?.length ? (
                      <>
                        <FormSelect
                          form={form}
                          name="creditCardId"
                          data={creditCards.map((card) => ({
                            label: card.cardName,
                            value: card.id,
                          }))}
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
                              queryClient.invalidateQueries({
                                queryKey: ['credit-cards'],
                              })
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
              <DialogFooter className="gap-2 sm:justify-end">
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
