'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, CreditCard, CaretDown, CaretUp } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { usePayInvoice } from '@/hooks/useInvoices'
import { Loader2 } from 'lucide-react'

type Invoice = {
  id: string
  cardName: string
  cardLastDigits: string
  month: string
  year: string
  dueDate: string
  paidAt: string | null
  totalAmount: number
  status: 'open' | 'paid'
  transactions: {
    id: string
    description: string
    amount: number
    date: string
    installment?: string
  }[]
}

type Props = {
  invoice: Invoice
}

export function InvoiceCard({ invoice }: Props) {
  const [expanded, setExpanded] = useState(false)
  const { mutate: payInvoice, isPending } = usePayInvoice()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  }

  const handlePayInvoice = () => {
    payInvoice(invoice.id)
  }

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const monthName = months[parseInt(invoice.month) - 1]

  return (
    <Card
      className={cn(
        'overflow-hidden border-2',
        invoice.status === 'paid'
          ? 'border-emerald-600 bg-emerald-600/5'
          : 'border-card-foreground/10 bg-card-foreground/5'
      )}
    >
      <CardContent className="p-0">
        <div className="flex flex-col p-3 sm:p-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 sm:h-10 sm:w-10',
                  {
                    'bg-purple-700': invoice.cardName.includes('Nubank'),
                    'bg-orange-500':
                      invoice.cardName.includes('Inter') ||
                      invoice.cardName.includes('Itaú'),
                    'bg-red-600':
                      invoice.cardName.includes('Santander') ||
                      invoice.cardName.includes('Bradesco'),
                    'bg-blue-600': invoice.cardName.includes('Caixa'),
                  }
                )}
              >
                <CreditCard size={14} className="text-foreground sm:size-5" />
              </div>
              <div>
                <h3 className="text-xs font-medium sm:text-base">
                  {invoice.cardName} •••• {invoice.cardLastDigits}
                </h3>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {monthName} de {invoice.year}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-9 sm:w-9"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <CaretUp size={14} className="sm:size-4" />
              ) : (
                <CaretDown size={14} className="sm:size-4" />
              )}
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium sm:text-base">
                R$ {invoice.totalAmount.toFixed(2)}
              </p>
              {invoice.paidAt && (
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Pago em: {formatDate(invoice.paidAt)}
                </p>
              )}
              <p className="text-xs text-muted-foreground sm:text-sm">
                Vencimento: {formatDate(invoice.dueDate)}
              </p>
            </div>

            <div>
              {invoice.status === 'open' ? (
                <Button
                  onClick={handlePayInvoice}
                  size="sm"
                  variant="default"
                  className="h-8 gap-1 bg-emerald-600 px-2 text-xs text-gray-50 hover:bg-emerald-700 hover:text-gray-50 sm:h-9 sm:px-3 sm:text-sm"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 size={14} className="animate-spin sm:size-4" />
                  ) : (
                    <Check size={14} className="sm:size-4" />
                  )}
                  Pagar
                </Button>
              ) : (
                <Badge
                  variant="outline"
                  className="border-success bg-success text-gray-50"
                >
                  Paga
                </Badge>
              )}
            </div>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-card-foreground/10 px-3 py-2 sm:px-4 sm:py-3">
            <h4 className="mb-2 text-xs font-medium sm:text-base">
              Transações
            </h4>
            <div className="max-h-[250px] space-y-2 overflow-y-auto pr-1">
              {invoice.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between gap-2 py-1"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium sm:text-sm">
                      {transaction.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground sm:text-xs">
                      {formatDate(transaction.date)}
                      {transaction.installment &&
                        ` • Parcela ${transaction.installment}`}
                    </p>
                  </div>
                  <p className="whitespace-nowrap pl-2 text-xs font-medium sm:text-sm">
                    R$ {transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-2 sm:my-3" />

            <div className="flex items-center justify-between">
              <p className="text-xs font-medium sm:text-base">Total</p>
              <p className="text-xs font-medium sm:text-base">
                R$ {invoice.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
