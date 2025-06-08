'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Check, PencilSimpleLine, Trash } from '@phosphor-icons/react'

type Payable = {
  id: string
  name: string
  amount: number
  dueDate: string
  recurrence: string
  status: 'paid' | 'pending'
}

export function PayablesTable() {
  const [payables, setPayables] = useState<Payable[]>([
    {
      id: '1',
      name: 'Aluguel',
      amount: 1200,
      dueDate: '2025-06-10',
      recurrence: 'Mensal',
      status: 'pending',
    },
    {
      id: '2',
      name: 'Internet',
      amount: 120,
      dueDate: '2025-06-15',
      recurrence: 'Mensal',
      status: 'pending',
    },
    {
      id: '3',
      name: 'Energia',
      amount: 250,
      dueDate: '2025-06-20',
      recurrence: 'Mensal',
      status: 'paid',
    },
    {
      id: '4',
      name: 'Água',
      amount: 80,
      dueDate: '2025-06-22',
      recurrence: 'Mensal',
      status: 'pending',
    },
    {
      id: '5',
      name: 'Seguro do Carro',
      amount: 350,
      dueDate: '2025-06-25',
      recurrence: 'Anual',
      status: 'pending',
    },
  ])

  const handleToggleStatus = (id: string) => {
    setPayables(
      payables.map((payable) =>
        payable.id === id
          ? {
              ...payable,
              status: payable.status === 'paid' ? 'pending' : 'paid',
            }
          : payable
      )
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Recorrência</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payables.map((payable) => (
            <TableRow key={payable.id}>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleStatus(payable.id)}
                >
                  {payable.status === 'paid' ? (
                    <Check size={18} className="text-success" weight="bold" />
                  ) : (
                    <Checkbox />
                  )}
                </Button>
              </TableCell>
              <TableCell className="font-medium">{payable.name}</TableCell>
              <TableCell>R$ {payable.amount.toFixed(2)}</TableCell>
              <TableCell>{formatDate(payable.dueDate)}</TableCell>
              <TableCell>
                <Badge variant="outline">{payable.recurrence}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <PencilSimpleLine size={16} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
