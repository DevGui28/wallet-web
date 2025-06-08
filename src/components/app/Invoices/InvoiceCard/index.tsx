'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, CreditCard, CaretDown, CaretUp } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type Invoice = {
  id: string
  cardName: string
  cardLastDigits: string
  month: string
  year: string
  dueDate: string
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
  const [status, setStatus] = useState(invoice.status)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  }

  const handleToggleStatus = () => {
    setStatus(status === 'open' ? 'paid' : 'open')
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
        status === 'paid'
          ? 'border-success/30 bg-success/5'
          : 'border-primary/30'
      )}
    >
      <CardContent className="p-0">
        <div className="flex flex-col p-3 sm:p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 sm:h-10 sm:w-10">
              <CreditCard size={16} className="text-primary sm:size-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium sm:text-base">
                {invoice.cardName} •••• {invoice.cardLastDigits}
              </h3>
              <p className="text-sm text-muted-foreground">
                {monthName} de {invoice.year}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 md:mt-0 md:gap-4">
            <div className="text-right">
              <p className="font-medium">R$ {invoice.totalAmount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                Vencimento: {formatDate(invoice.dueDate)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {status === 'open' ? (
                <Button
                  onClick={handleToggleStatus}
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
                >
                  <Check size={14} className="sm:size-4" />
                  Pagar
                </Button>
              ) : (
                <Badge variant="outline" className="bg-success/20 text-success">
                  Paga
                </Badge>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <CaretUp size={14} className="sm:size-4" />
                ) : (
                  <CaretDown size={14} className="sm:size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="border-t px-3 py-2 sm:px-4 sm:py-3">
            <h4 className="mb-2 text-sm font-medium sm:text-base">
              Transações
            </h4>
            <div className="space-y-2">
              {invoice.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="max-w-[180px] truncate text-xs font-medium sm:max-w-none sm:text-sm">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                      {transaction.installment &&
                        ` • Parcela ${transaction.installment}`}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-xs font-medium sm:text-sm">
                    R$ {transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium sm:text-base">Total</p>
              <p className="text-sm font-medium sm:text-base">
                R$ {invoice.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
