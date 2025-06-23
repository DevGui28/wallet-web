'use client'

import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { formatCurrency } from '../../../lib/utils'
import {
  PaymentMethod,
  TransactionResponse,
} from '../../../types/transactions.interface'
import { toast } from 'sonner'

type PayTransactionDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  transaction: TransactionResponse
  onPayTransaction: (id: string) => Promise<void>
  onPayInvoice: (id: string) => Promise<void>
  isLoading: boolean
}

export function PayTransactionDialog({
  open,
  setOpen,
  transaction,
  onPayTransaction,
  onPayInvoice,
  isLoading,
}: PayTransactionDialogProps) {
  if (!transaction) return null

  const isCreditCardPayment =
    transaction.paymentMethod === PaymentMethod.CREDIT_CARD
  const isInvoicePayment = isCreditCardPayment && transaction.invoiceId

  const handleConfirmPayment = async () => {
    try {
      if (isInvoicePayment && transaction.invoiceId) {
        await onPayInvoice(transaction.invoiceId)
        toast.success('Fatura paga com sucesso!')
      } else {
        await onPayTransaction(transaction.id)
        toast.success('Transação paga com sucesso!')
      }
      setOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar pagamento</DialogTitle>
          <DialogDescription>
            {isInvoicePayment
              ? 'Tem certeza que deseja pagar esta fatura de cartão de crédito?'
              : 'Tem certeza que deseja marcar esta transação como paga?'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {isInvoicePayment && transaction.invoice ? (
            <>
              <div className="rounded-md bg-amber-100 p-3 dark:bg-amber-900/30">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  ⚠️ Atenção: Você está pagando a fatura completa do cartão de
                  crédito.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Fatura:</span>
                <span className="text-sm">
                  {transaction.invoice.month}/{transaction.invoice.year} -{' '}
                  {transaction.creditCard?.cardName}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  Valor total da fatura:
                </span>
                <span className="text-sm">
                  {formatCurrency(Number(transaction.invoice.totalAmount))}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Descrição:</span>
                <span className="text-sm">{transaction.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Valor:</span>
                <span className="text-sm">
                  {formatCurrency(Number(transaction.totalAmount))}
                </span>
              </div>
            </>
          )}
        </div>
        <DialogFooter className="flex sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmPayment}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading
              ? 'Processando...'
              : isInvoicePayment
                ? 'Confirmar pagamento da fatura'
                : 'Confirmar pagamento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
