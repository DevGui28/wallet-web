'use client'

import { CaretRight } from '@phosphor-icons/react'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { toast } from 'sonner'
import {
  handleGetCreditCards,
  handleGetInstallments,
  handlePayIncome,
} from '../../../../api'
import useMediaQuery from '../../../../hooks/useMediaQuery'
import {
  formatCurrency,
  formatDateToString,
  transformToCammelCase,
} from '../../../../lib/utils'
import { CustomSelect } from '../../../shared/CustomSelect'
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

export function InstallmentsTable() {
  const [creditCardId, setCreditCardId] = useState<string>()
  const [date, setDate] = useState<string>(new Date().toISOString())
  const queryClient = useQueryClient()

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
    queryFn: () =>
      handleGetInstallments({
        creditcardId: creditCardId,
        date,
      }),
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

  const onPayIncome = async () => {
    try {
      const pay = await handlePayIncome({
        creditCardId: creditCardId!,
        paidAt: new Date(),
        dueDate: new Date(date),
      })
      if (pay.message) {
        throw new Error(pay.message)
      }
      queryClient.invalidateQueries(['installments', 'transactions'])
      toast.success('Fatura paga com sucesso')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao pagar fatura')
    }
  }

  const screenCurrent = Object.entries(screen).find(([, value]) => value)?.[0]

  const incomePayed = data?.installments.every(
    (installment) => installment.paidAt
  )

  const closingDay = creditCards?.find(
    (card) => card.id === creditCardId
  )?.closingDay

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
            <div className="flex-col items-center gap-2 md:flex-row lg:flex">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Vencimento da Fatura:{' '}
                {closingDay && closingDay <= 9 ? `0${closingDay}` : closingDay}/
                {`${date.split('-')[1]}/${date.split('-')[0]}`}
              </p>
            </div>
          )}
          {creditCardId && data && (
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <Button
                disabled={incomePayed}
                className="w-full md:w-auto"
                onClick={onPayIncome}
              >
                {incomePayed ? 'Fatura paga' : 'Pagar fatura'}
              </Button>
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
          {!!data?.installments.length &&
            !isLoading &&
            data.installments.map((installment) => (
              <TableRow key={installment.id}>
                <TableCell className="text-left text-card-foreground">
                  {installment.name}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {transformToCammelCase(installment.description || '-')}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {installment.category.name}
                </TableCell>
                <TableCell className="hidden text-left text-card-foreground lg:table-cell">
                  {installment.installmentNumber}/
                  {installment.totalInstallments}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDateToString(installment.date)}
                </TableCell>
                <TableCell className="font-semibold text-card-foreground">
                  {formatCurrency(installment.amount)}
                </TableCell>
                <TableCell>
                  <Link href={`/installments/${installment.id}`}>
                    <div className="ml-2 flex w-1/2 justify-center rounded-full hover:bg-card-foreground/5">
                      <CaretRight size={25} />
                    </div>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          {!data?.installments.length && creditCardId && !isLoading && (
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
          )}
          {!creditCardId && !isLoading && (
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
          {!!data?.installments.length && !isLoading && (
            <TableRow className="bg-card-foreground/5 hover:bg-card-foreground/10">
              <TableCell
                colSpan={(
                  columns[screenCurrent as keyof typeof columns] || columns.xl
                ).findIndex((column) => column === 'Valor')}
                className="text-left font-bold text-card-foreground"
              >
                Total
              </TableCell>
              <TableCell className="font-bold" colSpan={columns.xl.length}>
                {formatCurrency(data.total)}
              </TableCell>
              <TableCell />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
