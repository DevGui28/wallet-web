'use client'

import { useState } from 'react'
import { InvoiceCard } from '../InvoiceCard'
import { useInvoices } from '../../../../hooks/useInvoices'
import { Invoice } from '../../../../types/invoice.interface'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs'

type InvoiceCardProps = {
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

export default function InvoicesList() {
  const [activeTab, setActiveTab] = useState('current')
  const { data: invoices, isLoading } = useInvoices()

  const currentInvoices = invoices?.pending || []
  const paidInvoices = invoices?.paid || []

  const mapInvoiceToCardProps = (invoice: Invoice): InvoiceCardProps => ({
    id: invoice.id,
    cardName: invoice.creditCard.cardName,
    cardLastDigits: invoice.creditCard.lastDigits.toString(),
    month: invoice.month.toString(),
    year: invoice.year.toString(),
    dueDate: invoice.dueDate,
    paidAt: invoice.paidAt,
    totalAmount: Number(invoice.totalAmount),
    status: invoice.isPaid ? 'paid' : 'open',
    transactions: invoice.transactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.name,
      amount: Number(transaction.totalAmount),
      date: transaction.date as string,
      installment: transaction.installmentNumber
        ? `${transaction.installmentNumber}/${transaction.totalInstallments}`
        : undefined,
    })),
  })

  const renderContent = (invoices: Invoice[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    }

    if (invoices.length === 0) {
      return (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={mapInvoiceToCardProps(invoice)}
          />
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-1.5 pb-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle className="text-lg sm:text-xl">Faturas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="current"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4 flex w-full">
            <TabsTrigger value="current" className="flex-1">
              Faturas Abertas
            </TabsTrigger>
            <TabsTrigger value="paid" className="flex-1">
              Faturas Pagas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            {renderContent(currentInvoices, 'Nenhuma fatura em aberto')}
          </TabsContent>
          <TabsContent value="paid">
            {renderContent(paidInvoices, 'Nenhuma fatura paga')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
