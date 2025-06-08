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
        <div className="flex flex-col p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <CreditCard size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium">
                {invoice.cardName} •••• {invoice.cardLastDigits}
              </h3>
              <p className="text-sm text-muted-foreground">
                {monthName} de {invoice.year}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between md:mt-0 md:gap-4">
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
                  className="gap-1"
                >
                  <Check size={16} />
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
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
              </Button>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="border-t px-4 py-3">
            <h4 className="mb-2 font-medium">Transações</h4>
            <div className="space-y-2">
              {invoice.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                      {transaction.installment &&
                        ` • Parcela ${transaction.installment}`}
                    </p>
                  </div>
                  <p className="font-medium">
                    R$ {transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="flex items-center justify-between">
              <p className="font-medium">Total</p>
              <p className="font-medium">R$ {invoice.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
