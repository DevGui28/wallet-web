'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import { handleGetCreditCards, handleGetInstallments } from '../../../../api'
import useMediaQuery from '../../../../hooks/useMediaQuery'
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

  const { data: installments } = useQuery({
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
      {creditCards && (
        <div className="mb-4 flex w-full flex-col gap-4 md:flex-row md:justify-end">
          <CustomSelect
            className="w-full items-center justify-center md:max-w-[500px] md:flex-row"
            label="Selecione o cartão de crédito"
            placeholder="Selecione um cartão"
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
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            {(columns[screenCurrent as keyof typeof columns] || columns.xl).map(
              (column) => (
                <TableHead key={column}>{column}</TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {installments?.map((installment) =>
            installment.splitsOrRecurrences.map((split) => (
              <TableRow key={split.id}>
                <TableCell>{installment.name}</TableCell>
                <TableCell>{split.amount}</TableCell>
                <TableCell>{split.dueDate}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  )
}
