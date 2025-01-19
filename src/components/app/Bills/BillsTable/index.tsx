'use client'

import { CaretRight } from '@phosphor-icons/react'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { toast } from 'sonner'
import { handleGetBills, handlePaySplitOrRecurrence } from '../../../../api'
import useMediaQuery from '../../../../hooks/useMediaQuery'
import {
  cn,
  formatCurrency,
  formatDateToString,
  transformToCammelCase,
} from '../../../../lib/utils'
import MonthPicker from '../../../shared/MonthPicker'
import { Button } from '../../../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table'

export function BillsTable() {
  const [date, setDate] = useState<string>(new Date().toISOString())
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ['bills', date],
    queryFn: async () => {
      const data = await handleGetBills({
        date,
      })
      return data
    },
  })

  const screen = {
    xr: useMediaQuery(510),
    small: useMediaQuery(640),
    medium: useMediaQuery(768),
    large: useMediaQuery(1024),
    xl: useMediaQuery(1280),
  }

  const handlePay = async (id: string) => {
    try {
      await handlePaySplitOrRecurrence(id, new Date())
      toast.success('Conta paga com sucesso')
      queryClient.invalidateQueries('bills')
    } catch (error) {
      toast.error('Erro ao pagar conta' + error)
    }
  }

  const columns = {
    xr: ['Nome', 'Valor', 'Detalhes'],
    small: ['Nome', 'Valor', 'Detalhes'],
    medium: ['Nome', 'Valor', 'Detalhes'],
    large: ['Nome', 'Data da transação', 'Valor', 'Pagar', 'Detalhes'],
    xl: [
      'Nome',
      'Descrição',
      'Categoria',
      'Data da transação',
      'Valor',
      'Pagar',
      'Detalhes',
    ],
  }

  const screenCurrent = Object.entries(screen).find(([, value]) => value)?.[0]

  return (
    <>
      <div className="mb-4 flex w-full flex-col gap-4 md:items-center lg:flex-row lg:justify-end">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Selecione o mês de referência
          </p>
          <MonthPicker
            currentMonth={new Date(date)}
            onMonthChange={(date) => setDate(date.toISOString())}
          />
        </div>
      </div>

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
        <TableBody>
          {data ? (
            data.installments.map((installment) =>
              installment.splitsOrRecurrences.map((split) => (
                <TableRow key={split.id}>
                  <TableCell className="text-left text-card-foreground">
                    {installment.name}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {transformToCammelCase(
                      installment.description || 'Sem descrição'
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {installment.category.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {split.type === 'RECURRING'
                      ? 'Recorrente'
                      : formatDateToString(installment.date)}
                  </TableCell>
                  <TableCell className="font-semibold text-card-foreground">
                    {formatCurrency(split.amount)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Button
                      className={cn(
                        'rounded-full bg-secondary text-xs font-medium text-secondary-foreground',
                        {
                          'bg-accent text-accent-foreground':
                            split.paymentStatus === 'PENDING',
                        }
                      )}
                      onClick={() => handlePay(split.id)}
                      disabled={split.paymentStatus === 'PAID'}
                    >
                      {split.paymentStatus === 'PAID' ? 'Pago' : 'Pagar'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Link href={`/transactions/${installment.id}`}>
                      <div className="ml-2 flex w-1/2 justify-center rounded-full hover:bg-card-foreground/5">
                        <CaretRight size={25} />
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )
          ) : (
            <TableRow>
              <TableCell
                colSpan={
                  (columns[screenCurrent as keyof typeof columns] || columns.xl)
                    .length
                }
                className="text-center text-card-foreground"
              >
                Nenhuma conta ou boleto encontrado
              </TableCell>
            </TableRow>
          )}
          {data && (
            <TableRow className="bg-card-foreground/5 hover:bg-card-foreground/10">
              <TableCell
                colSpan={(
                  columns[screenCurrent as keyof typeof columns] || columns.xl
                ).findIndex((column) => column === 'Valor')}
                className="text-left font-bold text-card-foreground"
              >
                Total
              </TableCell>
              <TableCell className="font-bold">
                {formatCurrency(data.total)}
              </TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
