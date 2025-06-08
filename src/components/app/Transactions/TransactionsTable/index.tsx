'use client'

import { ArrowDown, ArrowUp, CreditCard, TrendUp } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency, formatDateToString } from '../../../../lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table'
import { NewTransactionModal } from '../AddTransactionDialog'

const transactions = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000', // UUID example
    category_id: 'a234b567-c89d-4e5f-6g7h-8i9j0k1l2m3n',
    user_id: 'b234c567-d89e-4f5g-6h7i-8j9k0l1m2n3o',
    description: 'Salário',
    amount: 5000,
    date: new Date(),
    transaction_type: 'INCOME',
    is_recurring: true,
    recurrence_pattern: 'MONTHLY',
    recurrence_start_date: new Date(2024, 0, 1),
    recurrence_end_date: new Date(2024, 11, 31),
    next_occurrence: new Date(2024, 3, 1),
    status: 'PAID',
    created_at: new Date(),
    category: 'Salário',
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    category_id: 'c234d567-e89f-4g5h-6i7j-8k9l0m1n2o3p',
    user_id: 'd234e567-f89g-4h5i-6j7k-8l9m0n1o2p3q',
    description: 'Aluguel',
    amount: 1500,
    date: new Date(),
    transaction_type: 'EXPENSE',
    is_recurring: true,
    recurrence_pattern: 'MONTHLY',
    recurrence_start_date: new Date(2024, 0, 1),
    recurrence_end_date: new Date(2024, 11, 31),
    next_occurrence: new Date(2024, 3, 1),
    status: 'PENDING',
    created_at: new Date(),
    category: 'Moradia',
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440002',
    category_id: 'e234f567-g89h-4i5j-6k7l-8m9n0o1p2q3r',
    user_id: 'f234g567-h89i-4j5k-6l7m-8n9o0p1q2r3s',
    description: 'Investimento em CDB',
    amount: 2000,
    date: new Date(),
    transaction_type: 'INVESTMENT',
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_start_date: null,
    recurrence_end_date: null,
    next_occurrence: null,
    status: 'PAID',
    created_at: new Date(),
    category: 'Investimentos',
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440003',
    category_id: 'g234h567-i89j-4k5l-6m7n-8o9p0q1r2s3t',
    user_id: 'h234i567-j89k-4l5m-6n7o-8p9q0r1s2t3u',
    description: 'Fatura do Cartão de Crédito',
    amount: 1000,
    date: new Date(),
    transaction_type: 'INVOICE',
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_start_date: null,
    recurrence_end_date: null,
    next_occurrence: null,
    status: 'PAID',
    created_at: new Date(),
    category: 'Transferências',
  },
]

const transactionTypeIcons = {
  INCOME: <ArrowUp className="h-5 w-5 text-green-500" />,
  EXPENSE: <ArrowDown className="h-5 w-5 text-red-500" />,
  INVESTMENT: <TrendUp className="h-5 w-5 text-blue-500" />,
  INVOICE: <CreditCard className="h-5 w-5 text-purple-500" />,
}

const transactionTypeLabels = {
  INCOME: 'Receita',
  EXPENSE: 'Despesa',
  INVESTMENT: 'Investimento',
  INVOICE: 'Fatura',
}

const statusColors = {
  PENDING:
    'bg-yellow-300 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-300',
  PAID: 'bg-green-300 text-green-800 dark:bg-green-700 dark:text-green-300',
  LATE: 'bg-red-300 text-red-800 dark:bg-red-700 dark:text-red-300',
}

const statusLabels = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  LATE: 'Atrasado',
}

const recurrencePatternLabels = {
  MONTHLY: 'Mensal',
  YEARLY: 'Anual',
}

export default function TransactionsTable() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar transação por descrição, categoria ou data"
            className="w-full rounded-lg bg-muted py-2 pl-10 pr-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <NewTransactionModal />
      </div>

      <div className="w-full rounded-2xl bg-card">
        <div className="overflow-x-auto">
          <Table className="w-full rounded-2xl">
            <TableHeader>
              <TableRow className="border-muted">
                <TableHead className="px-4 py-4 text-left">Data</TableHead>
                <TableHead className="px-4 py-4 text-left">Descrição</TableHead>
                <TableHead className="hidden px-4 py-4 text-left xl:table-cell">
                  Categoria
                </TableHead>
                <TableHead className="hidden px-4 py-4 text-left xl:table-cell">
                  Tipo
                </TableHead>
                <TableHead className="hidden px-4 py-4 text-left xl:table-cell">
                  Recorrência
                </TableHead>
                <TableHead className="hidden px-4 py-4 text-left xl:table-cell">
                  Status
                </TableHead>
                <TableHead className="px-4 py-4 text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions
                .filter(
                  (transaction) =>
                    search === '' ||
                    transaction.description
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    transaction.category
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    transaction.date
                      .toLocaleString('pt-BR')
                      .toLowerCase()
                      .includes(search.toLowerCase())
                )
                .map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="border-b border-muted"
                  >
                    <TableCell className="px-4 py-4">
                      {formatDateToString(transaction.date, 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {
                          transactionTypeIcons[
                            transaction.transaction_type as keyof typeof transactionTypeIcons
                          ]
                        }
                        {transaction.description}
                      </div>
                    </TableCell>
                    <TableCell className="hidden px-4 py-4 xl:table-cell">
                      {transaction.category}
                    </TableCell>
                    <TableCell className="hidden px-4 py-4 xl:table-cell">
                      {
                        transactionTypeLabels[
                          transaction.transaction_type as keyof typeof transactionTypeLabels
                        ]
                      }
                    </TableCell>
                    <TableCell className="hidden px-4 py-4 xl:table-cell">
                      {transaction.is_recurring &&
                      transaction.recurrence_pattern ? (
                        <div className="space-y-1">
                          <span className="text-sm font-medium">
                            {
                              recurrencePatternLabels[
                                transaction.recurrence_pattern as keyof typeof recurrencePatternLabels
                              ]
                            }
                          </span>
                          {transaction.next_occurrence && (
                            <p className="text-xs text-muted-foreground">
                              Próximo:{' '}
                              {format(
                                transaction.next_occurrence,
                                'dd/MM/yyyy'
                              )}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden px-4 py-4 xl:table-cell">
                      <span
                        className={`rounded-full px-2 py-1 text-sm ${
                          statusColors[
                            transaction.status as keyof typeof statusColors
                          ]
                        }`}
                      >
                        {
                          statusLabels[
                            transaction.status as keyof typeof statusLabels
                          ]
                        }
                      </span>
                    </TableCell>
                    <TableCell
                      className={`px-4 py-4 text-right font-medium ${
                        transaction.transaction_type === 'INCOME'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {transaction.transaction_type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(transaction.amount.toFixed(2))}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
