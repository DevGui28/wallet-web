'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from 'react-query'
import { handleGetTransactions } from '../../../../api'
import {
  paymentMethodMapper,
  transactionTypeMapper,
} from '../../../../lib/mappers'
import {
  cn,
  formatCurrency,
  formatDateToString,
  transformToCammelCase,
} from '../../../../lib/utils'

export default function TransactionsTable() {
  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: handleGetTransactions,
  })

  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 cursor-default">
        <TableRow className="text-xs font-bold text-card-foreground">
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Método de Pagamento</TableHead>
          <TableHead>Cartão de Crédito</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-auto">
        {transactions?.map((transactions) => (
          <TableRow
            key={transactions.id}
            className={cn(
              'cursor-default text-xs font-medium text-card-foreground'
            )}
          >
            <TableCell className="text-left font-medium text-card-foreground">
              {transactions.name}
            </TableCell>
            <TableCell>
              {transformToCammelCase(
                transactions.description || 'Sem descrição'
              )}
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  'rounded-sm px-3 py-2 text-center',
                  transactions.type === 'INCOME'
                    ? 'bg-green-500/90 text-green-50'
                    : 'bg-red-500/90 text-red-50'
                )}
              >
                {transactionTypeMapper[transactions.type]}
              </span>
            </TableCell>
            <TableCell className="font-semibold text-card-foreground">
              {transactions.type === 'INCOME' ? '+' : '-'}
              {formatCurrency(transactions.totalAmount)}
            </TableCell>
            <TableCell>{transactions.category.name}</TableCell>
            <TableCell>{formatDateToString(transactions.date)}</TableCell>
            <TableCell>
              {paymentMethodMapper[transactions.paymentMethod]}
            </TableCell>
            <TableCell>{transactions.creditCard?.cardName || '-'}</TableCell>
          </TableRow>
        ))}
        {!transactions && (
          <TableRow>
            <TableCell colSpan={8} className="text-center font-semibold">
              Nenhuma transação encontrada
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
