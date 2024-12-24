'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import { toast } from 'sonner'
import { handlePaySplitOrRecurrence } from '../../../../api'
import { transactionStatusMapper } from '../../../../lib/mappers'
import { formatCurrency, formatDateToString } from '../../../../lib/utils'
import {
  RecurrenceType,
  SplitsOrRecurrences,
} from '../../../../types/transactions.interface'
import { Button } from '../../../ui/button'

type SplitOrRecurrenceTableProps = {
  splitsOrRecurrences: SplitsOrRecurrences[]
}

export default function SplitOrRecurrenceTable({
  splitsOrRecurrences,
}: SplitOrRecurrenceTableProps) {
  const [loading, setLoading] = useState(false)
  async function handlePay(id: string) {
    setLoading(true)
    try {
      await handlePaySplitOrRecurrence(id)
      toast.success('Parcela paga com sucesso!')
    } catch (error) {
      toast.error('Erro ao pagar parcela!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 cursor-default">
        <TableRow className="text-xs font-bold text-card-foreground">
          <TableHead>Parcela</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pago em</TableHead>
          {splitsOrRecurrences[0].type === RecurrenceType.RECURRING && (
            <TableHead>Pagar</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-auto">
        {splitsOrRecurrences.map((splitOrRecurrence) => (
          <TableRow key={splitOrRecurrence.id}>
            <TableCell>{splitOrRecurrence.installmentNumber}</TableCell>
            <TableCell>{formatCurrency(splitOrRecurrence.amount)}</TableCell>
            <TableCell>
              {formatDateToString(splitOrRecurrence.dueDate)}
            </TableCell>
            <TableCell>
              {transactionStatusMapper[splitOrRecurrence.paymentStatus]}
            </TableCell>
            <TableCell>
              {splitOrRecurrence.paidAt
                ? formatDateToString(splitOrRecurrence.paidAt)
                : 'Pendente'}
            </TableCell>
            {splitOrRecurrence.type === RecurrenceType.RECURRING && (
              <TableCell>
                <Button
                  disabled={loading}
                  onClick={() => handlePay(splitOrRecurrence.id)}
                >
                  Pagar
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
