import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { cn, formatCurrency } from '../../../lib/utils'
import { CreditCard, Clock, Check } from '@phosphor-icons/react'
import { format, differenceInDays } from 'date-fns'
import DashboardButtomSeeMore from './DashboardButtomSeeMore'
import { CreditCardInvoice } from '../../../types/dashboard.interface'

type DashboardInvoicesProps = {
  data: CreditCardInvoice[]
}

export default function DashboardInvoices({ data }: DashboardInvoicesProps) {
  return (
    <Card className="col-span-1 flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Faturas de Cartão do mês</CardTitle>
          <CreditCard className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          {!data?.length ? (
            <p className="text-center text-sm text-muted-foreground">
              Nenhuma fatura pendente.
            </p>
          ) : (
            data.map((invoice) => (
              <div className="space-y-4 py-2" key={invoice.id}>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold">{invoice.cardName}</span>
                    <div>
                      <span className="text-sm">
                        Vencimento -
                        {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm">Valor</span>
                    <span
                      className={cn(
                        'font-medium text-destructive',
                        invoice.isPaid && 'text-foreground'
                      )}
                    >
                      {formatCurrency(invoice.totalAmount)}
                    </span>
                  </div>
                </div>

                {differenceInDays(new Date(invoice.dueDate), new Date()) <= 7 &&
                  !invoice.isPaid && (
                    <div className="mt-2 rounded-md bg-destructive/10 p-2 text-center text-sm text-destructive">
                      <Clock className="mr-1 inline h-4 w-4" />
                      Vence em{' '}
                      {differenceInDays(
                        new Date(invoice.dueDate),
                        new Date()
                      )}{' '}
                      dias
                    </div>
                  )}
                {invoice.isPaid && (
                  <div className="mt-2 rounded-md bg-green-500/10 p-2 text-center text-sm text-green-500">
                    <Check className="mr-1 inline h-4 w-4" />
                    Pago
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </div>
      <div className="flex justify-end pb-6 pr-6">
        <DashboardButtomSeeMore link="/invoices" />
      </div>
    </Card>
  )
}
