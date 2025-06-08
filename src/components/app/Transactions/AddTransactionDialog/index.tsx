import { Plus } from '@phosphor-icons/react'
import { addYears } from 'date-fns'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import FormDatePicker from '../../../shared/Form/FormDatePicker'
import FormInput from '../../../shared/Form/FormInput'
import FormSelect from '../../../shared/Form/FormSelect'
import { Button } from '../../../ui/button'
import { Checkbox } from '../../../ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog'
import { Form } from '../../../ui/form'

type TransactionType = 'INCOME' | 'EXPENSE' | 'INVESTMENT' | 'TRANSFER'
type RecurrencePattern = 'MONTHLY' | 'YEARLY'
type TransactionStatus = 'PENDING' | 'PAID'

const categories = [
  { value: '1', label: 'Alimentação' },
  { value: '2', label: 'Transporte' },
  { value: '3', label: 'Moradia' },
  { value: '4', label: 'Lazer' },
  { value: '5', label: 'Saúde' },
  { value: '6', label: 'Educação' },
  { value: '7', label: 'Investimentos' },
]

const transactionTypes: {
  value: TransactionType
  label: string
}[] = [
  { value: 'INCOME', label: 'Receita' },
  { value: 'EXPENSE', label: 'Despesa' },
  { value: 'INVESTMENT', label: 'Investimento' },
]

const paymentStatus: {
  value: TransactionStatus
  label: string
}[] = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'PAID', label: 'Pago' },
]

const recurrencePatterns: {
  value: RecurrencePattern
  label: string
}[] = [
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'YEARLY', label: 'Anual' },
]

const creditCards = [
  { value: '1', label: 'Nubank' },
  { value: '2', label: 'Itaú' },
  { value: '3', label: 'Santander' },
  { value: '4', label: 'Bradesco' },
  { value: '5', label: 'Inter' },
]

const installments = Array.from({ length: 12 }, (_, i) => ({
  value: `${i + 1}`,
  label: `${i + 1}x`,
}))

export function NewTransactionModal() {
  const [isRecurring, setIsRecurring] = useState(false)
  const [isCreditCard, setIsCreditCard] = useState(false)

  const form = useForm({
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: '',
      transactionType: 'INCOME' as TransactionType,
      status: 'PENDING' as TransactionStatus,
      isRecurring: false,
      recurrencePattern: 'MONTHLY' as RecurrencePattern,
      recurrenceStartDate: new Date().toISOString().split('T')[0],
      recurrenceEndDate: '',
      creditCard: '',
      installments: '1',
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl rounded-lg bg-card p-6">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar uma nova transação.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="Descrição"
                name="description"
                form={form}
                placeholder="Ex: Compra de mantimentos"
              />
              <FormInput
                label="Valor"
                name="amount"
                form={form}
                prefix="R$ "
                placeholder="R$ 100,00"
                withMask
                numeric
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormDatePicker
                form={form}
                name="date"
                label="Data da transação"
                placeholder="Selecione a data da transação"
                maxDate={addYears(new Date(), 2)}
                minDate={new Date('2024-01-01')}
                modal
              />
              <FormSelect
                label="Categoria"
                name="category"
                placeholder="Selecione a categoria"
                form={form}
                data={categories}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormSelect
                label="Tipo de Transação"
                name="transactionType"
                placeholder="Selecione o tipo de transação"
                data={transactionTypes}
                form={form}
              />
              <FormSelect
                label="Status do Pagamento"
                name="status"
                placeholder="Selecione o status do pagamento"
                data={paymentStatus}
                form={form}
              />
            </div>

            <div className="border-t pt-4">
              <label className="mb-4 flex items-center gap-2">
                <Checkbox
                  checked={isRecurring}
                  onClick={() => setIsRecurring((prev) => !prev)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium">
                  Transação Recorrente
                </span>
              </label>

              {isRecurring && (
                <div className="mb-4 space-y-4">
                  <FormSelect
                    label="Frequência de Recorrência"
                    name="recurrencePattern"
                    placeholder="Selecione a frequência de recorrência"
                    data={recurrencePatterns}
                    form={form}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormDatePicker
                      form={form}
                      name="recurrenceStartDate"
                      label="Data de Início"
                      placeholder="Selecione a data de início"
                      maxDate={addYears(new Date(), 2)}
                      minDate={new Date('2024-01-01')}
                      modal
                    />

                    <FormDatePicker
                      form={form}
                      name="recurrenceEndDate"
                      label="Data de Término"
                      placeholder="Selecione a data de término"
                      maxDate={addYears(new Date(), 2)}
                      minDate={new Date('2024-01-01')}
                      optional
                      modal
                    />
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <label className="mb-4 flex items-center gap-2">
                  <Checkbox
                    checked={isCreditCard}
                    onClick={() => setIsCreditCard((prev) => !prev)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Cartão de Crédito</span>
                </label>
              </div>

              {isCreditCard && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormSelect
                    label="Cartão de Crédito"
                    name="creditCard"
                    placeholder="Selecione o cartão de crédito"
                    data={creditCards}
                    form={form}
                  />

                  {!isRecurring && (
                    <FormSelect
                      data={installments}
                      label="Parcelas"
                      form={form}
                      name="installments"
                      placeholder="Selecione o número de parcelas"
                    />
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  className="rounded-lg bg-transparent px-4 py-2 text-foreground transition-colors hover:bg-transparent hover:text-foreground/70"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Criar Transação</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
