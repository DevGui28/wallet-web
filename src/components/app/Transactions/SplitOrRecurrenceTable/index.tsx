import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { transactionStatusMapper } from '../../../../lib/mappers'
import { formatCurrency, formatDateToString } from '../../../../lib/utils'
import { SplitsOrRecurrences } from '../../../../types/transactions.interface'

type SplitOrRecurrenceTableProps = {
  splitsOrRecurrences: SplitsOrRecurrences[]
}

export default function SplitOrRecurrenceTable({
  splitsOrRecurrences,
}: SplitOrRecurrenceTableProps) {
  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 cursor-default">
        <TableRow className="text-xs font-bold text-card-foreground">
          <TableHead>Parcela</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pago em</TableHead>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
