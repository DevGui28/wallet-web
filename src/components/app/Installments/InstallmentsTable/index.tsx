'use client'

import { CaretRight } from '@phosphor-icons/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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
  const search = useSearchParams()
  const [creditCardId, setCreditCardId] = useState<string>(() => {
    return search.get('creditCardId') || ''
  })
  const [date, setDate] = useState<string>(new Date().toISOString())
  const queryClient = useQueryClient()

  const { data: creditCards } = useQuery({
    queryKey: ['credit-cards-detail'],
    queryFn: handleGetCreditCards,
  })

  const { data: creditCardsOptions } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: async () => {
      const data = await handleGetCreditCards()
      return data.map((creditCard) => ({
        value: creditCard.id,
        label: creditCard.cardName,
      }))
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

  const dueDay = creditCards?.find((card) => card.id === creditCardId)?.dueDay

  return (
    <>
      {creditCards && (
        <div className="mb-4 flex w-full flex-col gap-3 sm:gap-4 md:items-center lg:flex-row lg:justify-end">
          <CustomSelect
            className="w-full items-center justify-center text-sm sm:text-base md:max-w-[500px] md:flex-row"
            label="Selecione o cartão de crédito"
            placeholder="Selecione um cartão"
            classinput="w-1/2"
            options={creditCardsOptions || []}
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
              <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-sm">
                Vencimento da Fatura:{' '}
                {dueDay && dueDay <= 9 ? `0${dueDay}` : dueDay}/
                {`${date.split('-')[1]}/${date.split('-')[0]}`}
              </p>
            </div>
          )}
          {creditCardId && data && (
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <Button
                disabled={incomePayed}
                className="h-8 w-full text-xs sm:h-9 sm:text-sm md:w-auto"
                onClick={onPayIncome}
              >
                {incomePayed ? 'Fatura paga' : 'Pagar fatura'}
              </Button>
            </div>
          )}
        </div>
      )}
      <div className="w-full overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 z-10 cursor-default bg-background">
            <TableRow className="text-xs font-bold text-card-foreground">
              {(
                columns[screenCurrent as keyof typeof columns] || columns.xl
              ).map((column) => (
                <TableHead key={column} className="px-2 py-3 sm:px-4 sm:py-4">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!!data?.installments.length &&
              !isLoading &&
              data.installments.map((installment) => (
                <TableRow key={installment.id}>
                  <TableCell className="px-2 py-3 text-left text-xs text-card-foreground sm:px-4 sm:py-4 sm:text-sm">
                    {installment.name}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {transformToCammelCase(installment.description || '-')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {installment.category.name}
                  </TableCell>
                  <TableCell className="hidden px-4 py-4 text-left text-xs text-card-foreground sm:text-sm lg:table-cell">
                    {installment.installmentNumber}/
                    {installment.totalInstallments}
                  </TableCell>
                  <TableCell className="hidden px-4 py-4 text-xs sm:text-sm md:table-cell">
                    {formatDateToString(installment.date, 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-xs font-semibold text-card-foreground sm:px-4 sm:py-4 sm:text-sm">
                    {formatCurrency(installment.amount)}
                  </TableCell>
                  <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                    <Link href={`/installments/${installment.id}`}>
                      <div className="flex justify-center rounded-full hover:bg-card-foreground/5">
                        <CaretRight size={20} className="sm:size-6" />
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            {!data?.installments.length && creditCardId && !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={
                    (
                      columns[screenCurrent as keyof typeof columns] ||
                      columns.xl
                    ).length
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
                    (
                      columns[screenCurrent as keyof typeof columns] ||
                      columns.xl
                    ).length
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
                  className="px-2 py-3 text-left text-xs font-bold text-card-foreground sm:px-4 sm:py-4 sm:text-sm"
                >
                  Total
                </TableCell>
                <TableCell
                  className="px-2 py-3 text-xs font-bold sm:px-4 sm:py-4 sm:text-sm"
                  colSpan={columns.xl.length}
                >
                  {formatCurrency(data.total)}
                </TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
