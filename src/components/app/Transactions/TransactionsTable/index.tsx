'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { setDefaultOptions } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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
  sumTotal,
  transformToCammelCase,
} from '../../../../lib/utils'
import { Badge } from '../../../ui/badge'

export default function TransactionsTable() {
  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: handleGetTransactions,
  })

  console.log({ transactions })
  setDefaultOptions({ locale: ptBR })
  return (
    <Table>
      <TableCaption>Uma lista com todas suas transações</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold text-muted-foreground">
            Nome
          </TableHead>
          <TableHead className="w-36 font-bold text-muted-foreground">
            Descrição
          </TableHead>
          <TableHead className="font-bold text-muted-foreground">
            Tipo
          </TableHead>
          <TableHead className="font-bold text-muted-foreground">
            Categoria
          </TableHead>
          <TableHead className="font-bold text-muted-foreground">
            Data
          </TableHead>
          <TableHead className="font-bold text-muted-foreground">
            Método de Pagamento
          </TableHead>
          <TableHead className="font-bold text-muted-foreground">
            Cartão de Crédito
          </TableHead>
          <TableHead className="font-bold text-muted-foreground">
            Valor
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions?.map((transactions) => (
          <TableRow key={transactions.id}>
            <TableCell className="font-medium">{transactions.name}</TableCell>
            <TableCell>
              {transformToCammelCase(
                transactions.description || 'Sem descrição'
              )}
            </TableCell>
            <TableCell>
              <Badge
                className={cn(
                  'text-sm',
                  transactions.type === 'INCOME'
                    ? 'bg-green-400 text-green-800 hover:bg-green-400/80'
                    : 'bg-red-400 text-red-800 hover:bg-red-400/80'
                )}
              >
                {transactionTypeMapper[transactions.type]}
              </Badge>
            </TableCell>
            <TableCell>{transactions.category.name}</TableCell>
            <TableCell>{formatDateToString(transactions.date)}</TableCell>
            <TableCell>
              {paymentMethodMapper[transactions.paymentMethod]}
            </TableCell>
            <TableCell>{transactions.creditCard?.cardName || '-'}</TableCell>
            <TableCell className="text-right">
              {transactions.type === 'INCOME' ? '+' : '-'}
              {formatCurrency(transactions.totalAmount)}
            </TableCell>
          </TableRow>
        ))}
        {!transactions && (
          <TableRow>
            <TableCell colSpan={8}>Nenhuma transação encontrada</TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7}>Total</TableCell>
          <TableCell className="text-right">
            {sumTotal(transactions || [])}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
