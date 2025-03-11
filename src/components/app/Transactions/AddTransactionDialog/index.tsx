import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { useState } from 'react'

type TransactionType = 'INCOME' | 'EXPENSE' | 'INVESTMENT' | 'TRANSFER'
type RecurrencePattern = 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'YEARLY'
type TransactionStatus = 'PENDING' | 'PAID' | 'LATE'

export function NewTransactionModal() {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [category, setCategory] = useState('')
  const [transactionType, setTransactionType] =
    useState<TransactionType>('EXPENSE')
  const [status, setStatus] = useState<TransactionStatus>('PENDING')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrencePattern, setRecurrencePattern] =
    useState<RecurrencePattern>('MONTHLY')
  const [recurrenceStartDate, setRecurrenceStartDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  )
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('')

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
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Descrição
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg bg-muted p-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Valor</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg bg-muted p-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg bg-muted p-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg bg-muted p-2"
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Moradia">Moradia</option>
                <option value="Lazer">Lazer</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Investimentos">Investimentos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Tipo</label>
              <select
                value={transactionType}
                onChange={(e) =>
                  setTransactionType(e.target.value as TransactionType)
                }
                className="w-full rounded-lg bg-muted p-2"
                required
              >
                <option value="INCOME">Receita</option>
                <option value="EXPENSE">Despesa</option>
                <option value="INVESTMENT">Investimento</option>
                <option value="TRANSFER">Transferência</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                className="w-full rounded-lg bg-muted p-2"
                required
              >
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago</option>
                <option value="LATE">Atrasado</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium">Transação Recorrente</span>
            </label>

            {isRecurring && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Padrão de Recorrência
                  </label>
                  <select
                    value={recurrencePattern}
                    onChange={(e) =>
                      setRecurrencePattern(e.target.value as RecurrencePattern)
                    }
                    className="w-full rounded-lg bg-muted p-2"
                    required
                  >
                    <option value="DAILY">Diário</option>
                    <option value="WEEKLY">Semanal</option>
                    <option value="BIWEEKLY">Quinzenal</option>
                    <option value="MONTHLY">Mensal</option>
                    <option value="YEARLY">Anual</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={recurrenceStartDate}
                      onChange={(e) => setRecurrenceStartDate(e.target.value)}
                      className="w-full rounded-lg bg-muted p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Data de Término (opcional)
                    </label>
                    <input
                      type="date"
                      value={recurrenceEndDate}
                      onChange={(e) => setRecurrenceEndDate(e.target.value)}
                      className="w-full rounded-lg bg-muted p-2"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="rounded-lg bg-transparent px-4 py-2 text-foreground transition-colors hover:bg-transparent hover:text-foreground/70"
            >
              Cancelar
            </Button>
            <Button type="submit">Criar Transação</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  //     <div className="relative w-full max-w-2xl rounded-lg bg-card p-6">
  //       <button
  //         onClick={onClose}
  //         className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
  //       >
  //         <X className="h-5 w-5" />
  //       </button>

  //       <h2 className="mb-6 text-2xl font-bold">Nova Transação</h2>

  //     </div>
  //   </div>
  // )
}
