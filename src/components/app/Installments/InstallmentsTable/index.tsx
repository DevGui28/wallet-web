'use client'

import { CaretRight } from '@phosphor-icons/react'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { handleGetCreditCards, handleGetInstallments } from '../../../../api'
import useMediaQuery from '../../../../hooks/useMediaQuery'
import {
  formatCurrency,
  formatDateToString,
  transformToCammelCase,
} from '../../../../lib/utils'
import { CustomSelect } from '../../../shared/CustomSelect'
import MonthPicker from '../../../shared/MonthPicker'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table'

export function InstallmentsTable() {
  const [creditCardId, setCreditCardId] = useState<string>()
  const [date, setDate] = useState<string>(new Date().toISOString())

  const { data: creditCards } = useQuery({
    queryKey: ['creditCards'],
    queryFn: async () => {
      const data = await handleGetCreditCards()
      setCreditCardId(data[0].id)
      return data
    },
  })

  const { data, isLoading } = useQuery({
    queryKey: ['installments', creditCardId, date],
    queryFn: async () => {
      const data = await handleGetInstallments({
        creditcardId: creditCardId,
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

  const columns = {
    xr: ['Nome', 'Valor', 'Detalhes'],
    small: ['Nome', 'Valor', 'Detalhes'],
    medium: ['Nome', 'Parcela', 'Valor', 'Detalhes'],
    large: ['Nome', 'Parcela', 'Data da compra', 'Valor', 'Detalhes'],
    xl: [
      'Nome',
      'Descrição',
      'Categoria',
      'Parcela',
      'Data da compra',
      'Valor',
      'Detalhes',
    ],
  }

  const screenCurrent = Object.entries(screen).find(([, value]) => value)?.[0]

  return (
    <>
      {creditCards && (
        <div className="mb-4 flex w-full flex-col gap-4 md:items-center lg:flex-row lg:justify-end">
          <CustomSelect
            className="w-full items-center justify-center md:max-w-[500px] md:flex-row"
            label="Selecione o cartão de crédito"
            placeholder="Selecione um cartão"
            classinput="w-1/2"
            options={creditCards.map((creditCard) => ({
              value: creditCard.id,
              label: creditCard.cardName,
            }))}
            value={creditCardId || ''}
            onChange={(value) => setCreditCardId(value)}
          />
          <div className="flex flex-col items-center gap-2 md:flex-row">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Selecione o mês da fatura
            </p>
            <MonthPicker
              currentMonth={new Date(date)}
              onMonthChange={(date) => setDate(date.toISOString())}
            />
          </div>
          {creditCardId && (
            <div className="hidden flex-col items-center gap-2 md:flex-row lg:flex">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Vencimento da Fatura:{' '}
                {
                  creditCards.find((card) => card.id === creditCardId)
                    ?.closingDay
                }
                /{`${date.split('-')[1]}/${date.split('-')[0]}`}
              </p>
            </div>
          )}
        </div>
      )}
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
                  <TableCell className="text-left text-card-foreground">
                    {split.installmentNumber}/{split.totalInstallments}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDateToString(installment.date)}
                  </TableCell>
                  <TableCell className="font-semibold text-card-foreground">
                    {formatCurrency(split.amount)}
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
          ) : creditCardId && !isLoading ? (
            <TableRow>
              <TableCell
                colSpan={
                  (columns[screenCurrent as keyof typeof columns] || columns.xl)
                    .length
                }
                className="text-center text-card-foreground"
              >
                Nenhum parcelamento encontrado
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell
                colSpan={
                  (columns[screenCurrent as keyof typeof columns] || columns.xl)
                    .length
                }
                className="text-center text-card-foreground"
              >
                Selecione um cartão de crédito
              </TableCell>
            </TableRow>
          )}
          {data && (
            <TableRow>
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
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
