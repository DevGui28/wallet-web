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
import {
  handleGetCategories,
  handleGetCreditCards,
  handleGetTransactions,
} from '../../../../api'
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
import { PaymentMethod } from '../../../../types/transactions.interface'
import { CustomSelect } from '../../../shared/CustomSelect'
import MonthPicker from '../../../shared/MonthPicker'
import { Button } from '../../../ui/button'
import { Skeleton } from '../../../ui/skeleton'

export type TransactionFilters = {
  categoryId?: string
  paymentMethod?: PaymentMethod
  creditCardId?: string
  type?: string
  date?: string
}

export default function TransactionsTable() {
  const [filters, setFilters] = useState<TransactionFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const { data: transactions, isLoading } = useQuery({
    queryKey: [
      'transactions',
      filters.type,
      filters.paymentMethod,
      filters.creditCardId,
      filters.categoryId,
      filters.date,
    ],
    queryFn: () => handleGetTransactions(filters),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories', filters.type],
    queryFn: async () => {
      const data = await handleGetCategories((filters.type as any) || 'EXPENSE')
      return data.map((category) => ({
        value: category.id,
        label: category.name,
      }))
    },
  })

  const { data: creditCards } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: async () => {
      const data = await handleGetCreditCards()
      return data.map((creditCard) => ({
        value: creditCard.id,
        label: creditCard.cardName,
      }))
    },
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

  const total = transactions
    ?.filter((transaction) => transaction.paymentMethod !== 'CREDIT_CARD')
    .reduce((acc, transaction) => {
      if (transaction.type === 'INCOME') {
        return acc + Number(transaction.totalAmount)
      }
      return acc - Number(transaction.totalAmount)
    }, 0)

  return (
    <>
      <Header setShowFilters={setShowFilters} showFilters={showFilters} />
      <Filters
        setFilters={setFilters}
        filters={filters}
        showFilters={showFilters}
        creditCards={creditCards}
        categories={categories}
      />
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
          {transactions?.length && !isLoading && (
            <TableRow>
              <TableCell
                colSpan={(
                  columns[screenCurrent as keyof typeof columns] || columns.xl
                ).findIndex((column) => column === 'Valor')}
                className="text-left font-semibold"
              >
                Total
              </TableCell>
              <TableCell className="font-semibold text-card-foreground">
                {formatCurrency(total!)}
              </TableCell>
            </TableRow>
          )}
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
  showFilters: boolean
  creditCards?: { value: string; label: string }[]
  categories?: { value: string; label: string }[]
}

function Filters(props: FiltersProps) {
  const { setFilters, filters, showFilters, creditCards } = props

  const transactionType = [
    {
      label: 'Todos',
      value: 'ALL',
    },
    {
      label: 'Receita',
      value: 'INCOME',
    },
    {
      label: 'Despesa',
      value: 'EXPENSE',
    },
  ]

  const paymentMethods = Object.entries(paymentMethodMapper)
    .filter(([key]) =>
      filters.type === 'INCOME'
        ? !key.includes('CARD') && !key.includes('SLIP') && key !== 'INVOICE'
        : key !== 'CREDIT_CARD'
    )
    .map(([key, value]) => ({
      value: key,
      label: value,
    }))

  return (
    <>
      <div
        className={cn(
          'mb-6 gap-4 duration-1000 animate-in slide-in-from-top',
          showFilters ? 'flex' : 'hidden'
        )}
      >
        <CustomSelect
          label="Tipo da Transação"
          options={transactionType}
          placeholder="Selecione o tipo da transação"
          value={filters.type || ''}
          onChange={(e) => {
            setFilters({
              ...filters,
              type: e,
            })
          }}
        />
        <CustomSelect
          label="Categoria"
          options={props.categories || []}
          placeholder="Selecione a categoria"
          value={filters.categoryId || ''}
          onChange={(e) => {
            setFilters({
              ...filters,
              categoryId: e,
            })
          }}
        />
        <CustomSelect
          label="Método de Pagamento"
          options={paymentMethods}
          placeholder="Selecione o método de pagamento"
          value={filters.paymentMethod || ''}
          onChange={(e) => {
            setFilters({
              ...filters,
              paymentMethod: e as PaymentMethod,
            })
          }}
        />
        {filters.paymentMethod === 'CREDIT_CARD' && creditCards && (
          <CustomSelect
            label="Cartão de Crédito"
            options={creditCards || []}
            placeholder="Selecione o cartão de crédito"
            value={filters.creditCardId || ''}
            onChange={(e) => {
              setFilters({
                ...filters,
                creditCardId: e,
              })
            }}
          />
        )}
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Selecione o mês
          </p>
          <MonthPicker
            currentMonth={new Date(filters.date || new Date().toISOString())}
            onMonthChange={(date) =>
              setFilters({
                ...filters,
                date: date.toISOString(),
              })
            }
          />
        </div>
      </div>
    </>
  )
}

function Header({
  setShowFilters,
  showFilters,
}: {
  setShowFilters: (filters: boolean | ((prev: boolean) => boolean)) => void
  showFilters: boolean
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Button
        onClick={() => setShowFilters((prev) => !prev)}
        className="flex items-center gap-2 rounded-md bg-secondary px-6 py-4 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 hover:text-secondary-foreground/90"
      >
        Filtros
        <CaretRight
          size={20}
          className={cn(
            'rotate-90 transform transition-transform duration-300',
            {
              '-rotate-90': showFilters,
            }
          )}
        />
      </Button>
      <Link href="/transactions/create">
        <div className="flex h-10 items-center gap-2 rounded-md bg-secondary px-6 py-4 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 hover:text-secondary-foreground/90">
          <Plus size={16} weight="bold" />
          Adicionar transação
        </div>
      </Link>
    </div>
  )
}
