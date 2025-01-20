'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CaretRight, Plus } from '@phosphor-icons/react'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { handleGetTransactions } from '../../../../api'
import useMediaQuery from '../../../../hooks/useMediaQuery'
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
import {
  PaymentMethod,
  TransactionType,
} from '../../../../types/transactions.interface'
import { Skeleton } from '../../../ui/skeleton'

export type TransactionFilters = {
  categoryId?: string
  paymentMethod?: PaymentMethod
  creditCardId?: string
  type?: TransactionType
  month?: number
  year?: number
}

export default function TransactionsTable() {
  const [filters, setFilters] = useState<TransactionFilters>({})
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => handleGetTransactions(filters),
  })

  const screen = {
    xr: useMediaQuery(510),
    small: useMediaQuery(640),
    medium: useMediaQuery(768),
    large: useMediaQuery(1024),
    xl: useMediaQuery(1280),
  }

  const columns = {
    xr: ['Nome', 'Valor', 'Detalhes'],
    small: ['Nome', 'Tipo', 'Valor', 'Detalhes'],
    medium: ['Nome', 'Tipo', 'Valor', 'Data', 'Detalhes'],
    large: ['Nome', 'Tipo', 'Valor', 'Data', 'Detalhes'],
    xl: [
      'Nome',
      'Descrição',
      'Tipo',
      'Valor',
      'Categoria',
      'Data',
      'Método de Pagamento',
      'Cartão de Crédito',
      'Detalhes',
    ],
  }

  const screenCurrent = Object.entries(screen).find(([, value]) => value)?.[0]

  return (
    <>
      <Header />
      <Filters setFilters={setFilters} filters={filters} />
      <Table>
        <TableHeader className="sticky top-0 z-10 cursor-default">
          <TableRow className="text-xs font-bold text-card-foreground">
            {(columns[screenCurrent as keyof typeof columns] || columns.xl).map(
              (column) => (
                <TableHead key={column}>{column}</TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-auto">
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="cursor-default">
                {(
                  columns[screenCurrent as keyof typeof columns] || columns.xl
                ).map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton className="h-4" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {transactions?.map((transactions) => (
            <TableRow
              key={transactions.id}
              className="cursor-default text-xs font-medium text-card-foreground"
            >
              <TableCell className="text-left text-card-foreground">
                {transactions.name}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {transformToCammelCase(
                  transactions.description || 'Sem descrição'
                )}
              </TableCell>
              <TableCell className="hidden xr:table-cell">
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
              <TableCell className="hidden lg:table-cell">
                {transactions.category.name}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {formatDateToString(transactions.date)}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {paymentMethodMapper[transactions.paymentMethod]}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {transactions.creditCard?.cardName || '-'}
              </TableCell>
              <TableCell>
                <Link href={`/transactions/${transactions.id}`}>
                  <div className="ml-2 flex w-1/2 justify-center rounded-full hover:bg-card-foreground/5">
                    <CaretRight size={25} />
                  </div>
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {!transactions?.length && !isLoading && (
            <TableRow>
              <TableCell
                colSpan={
                  (columns[screenCurrent as keyof typeof columns] || columns.xl)
                    .length
                }
                className="text-center font-semibold"
              >
                Nenhuma transação encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}

type FiltersProps = {
  setFilters: (filters: TransactionFilters) => void
  filters: TransactionFilters
}

function Filters(props: FiltersProps) {
  const { setFilters, filters } = props

  return (
    <div className="mb-4 flex gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="type" className="text-sm text-card-foreground">
          Tipo
        </label>
        <select
          id="type"
          name="type"
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value as TransactionType })
          }
          className="rounded-md bg-card/90 px-2 py-1 text-sm text-card-foreground"
        >
          <option value="">Todos</option>
          <option value="INCOME">Receita</option>
          <option value="EXPENSE">Despesa</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="paymentMethod" className="text-sm text-card-foreground">
          Método de Pagamento
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={filters.paymentMethod}
          onChange={(e) =>
            setFilters({
              ...filters,
              paymentMethod: e.target.value as PaymentMethod,
            })
          }
          className="rounded-md bg-card/90 px-2 py-1 text-sm text-card-foreground"
        >
          <option value="">Todos</option>
          <option value="DEBIT_CARD">Cartão de Débito</option>
          <option value="CREDIT_CARD">Cartão de Crédito</option>
          <option value="CASH">Dinheiro</option>
          <option value="PIX">PIX</option>
        </select>
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Link href="/transactions/create">
        <div className="flex h-10 items-center gap-2 rounded-md bg-secondary px-6 py-4 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 hover:text-secondary-foreground/90">
          <Plus size={16} weight="bold" />
          Adicionar transação
        </div>
      </Link>
    </div>
  )
}
