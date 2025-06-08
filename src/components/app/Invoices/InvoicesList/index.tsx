'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InvoiceCard } from '../InvoiceCard'

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

export default function InvoicesList() {
  const [activeTab, setActiveTab] = useState('current')

  const mockInvoices: Invoice[] = [
    {
      id: '1',
      cardName: 'Nubank',
      cardLastDigits: '1234',
      month: '06',
      year: '2025',
      dueDate: '2025-06-10',
      totalAmount: 1250.75,
      status: 'open',
      transactions: [
        {
          id: '101',
          description: 'Supermercado Extra',
          amount: 350.25,
          date: '2025-05-15',
        },
        {
          id: '102',
          description: 'Netflix',
          amount: 39.9,
          date: '2025-05-20',
        },
        {
          id: '103',
          description: 'Restaurante Sabor & Arte',
          amount: 120.5,
          date: '2025-05-22',
        },
        {
          id: '104',
          description: 'Amazon',
          amount: 240.1,
          date: '2025-05-25',
          installment: '1/3',
        },
        {
          id: '105',
          description: 'Farmácia',
          amount: 85.3,
          date: '2025-05-28',
        },
        {
          id: '106',
          description: 'Uber',
          amount: 45.7,
          date: '2025-05-30',
        },
        {
          id: '107',
          description: 'Posto de Gasolina',
          amount: 200.0,
          date: '2025-06-01',
        },
        {
          id: '108',
          description: 'Livraria Cultura',
          amount: 169.0,
          date: '2025-06-02',
        },
      ],
    },
    {
      id: '2',
      cardName: 'Itaú',
      cardLastDigits: '5678',
      month: '06',
      year: '2025',
      dueDate: '2025-06-15',
      totalAmount: 850.3,
      status: 'open',
      transactions: [
        {
          id: '201',
          description: 'Lojas Americanas',
          amount: 150.25,
          date: '2025-05-18',
        },
        {
          id: '202',
          description: 'Spotify',
          amount: 19.9,
          date: '2025-05-20',
        },
        {
          id: '203',
          description: 'Padaria São Paulo',
          amount: 45.75,
          date: '2025-05-25',
        },
        {
          id: '204',
          description: 'Magazine Luiza',
          amount: 399.9,
          date: '2025-05-28',
          installment: '1/5',
        },
        {
          id: '205',
          description: 'Uber Eats',
          amount: 65.5,
          date: '2025-05-30',
        },
        {
          id: '206',
          description: 'Cinema',
          amount: 60.0,
          date: '2025-06-01',
        },
        {
          id: '207',
          description: 'Estacionamento',
          amount: 25.0,
          date: '2025-06-03',
        },
        {
          id: '208',
          description: 'Petshop',
          amount: 84.0,
          date: '2025-06-05',
        },
      ],
    },
    {
      id: '3',
      cardName: 'Santander',
      cardLastDigits: '9012',
      month: '05',
      year: '2025',
      dueDate: '2025-05-20',
      totalAmount: 1450.6,
      status: 'paid',
      transactions: [
        {
          id: '301',
          description: 'Supermercado Pão de Açúcar',
          amount: 420.35,
          date: '2025-04-10',
        },
        {
          id: '302',
          description: 'Amazon Prime',
          amount: 14.9,
          date: '2025-04-15',
        },
        {
          id: '303',
          description: 'Restaurante Sabor Mineiro',
          amount: 95.8,
          date: '2025-04-18',
        },
        {
          id: '304',
          description: 'Casas Bahia',
          amount: 599.9,
          date: '2025-04-20',
          installment: '2/6',
        },
        {
          id: '305',
          description: 'Drogaria São Paulo',
          amount: 120.65,
          date: '2025-04-22',
        },
        {
          id: '306',
          description: '99 Táxi',
          amount: 35.0,
          date: '2025-04-25',
        },
        {
          id: '307',
          description: 'Posto Ipiranga',
          amount: 150.0,
          date: '2025-04-28',
        },
        {
          id: '308',
          description: 'Saraiva',
          amount: 89.9,
          date: '2025-04-30',
        },
      ],
    },
  ]

  const currentInvoices = mockInvoices.filter(
    (invoice) => invoice.status === 'open'
  )
  const paidInvoices = mockInvoices.filter(
    (invoice) => invoice.status === 'paid'
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Faturas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="current"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="current">Faturas Abertas</TabsTrigger>
            <TabsTrigger value="paid">Faturas Pagas</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <div className="grid gap-4">
              {currentInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
              {currentInvoices.length === 0 && (
                <div className="flex h-40 items-center justify-center text-muted-foreground">
                  Nenhuma fatura aberta encontrada
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="paid">
            <div className="grid gap-4">
              {paidInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
              {paidInvoices.length === 0 && (
                <div className="flex h-40 items-center justify-center text-muted-foreground">
                  Nenhuma fatura paga encontrada
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
