'use client'

import { CalendarBlank } from '@phosphor-icons/react'
import { format, getMonth, getYear, setMonth, setYear } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../ui/button'
import { Calendar } from '../../../ui/calendar'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select'

type Props<T extends FieldValues, K extends Path<T>> = {
  readonly form: UseFormReturn<T>
  readonly name: K
  readonly label?: string
  readonly placeholder?: string
  readonly className?: string
  readonly minDate?: Date
  readonly maxDate?: Date
  readonly description?: string
  readonly modal?: boolean
  readonly future?: boolean
  readonly optional?: boolean
}

export default function FormDatePicker<
  T extends FieldValues,
  K extends Path<T>,
>({
  form,
  name,
  label = '',
  placeholder = 'dd/mm/aaaa',
  minDate = new Date('1900-01-01'),
  maxDate = new Date(),
  description,
  modal,
  optional = false,
  future = false,
}: Props<T, K>) {
  const [date, setDate] = useState<Date | undefined>(
    form.getValues(name) as Date | undefined
  )

  const years = Array.from(
    { length: maxDate.getFullYear() - minDate.getFullYear() + 1 },
    (_, i) => minDate.getFullYear() + i
  )

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const handleMonthChange = (month: string) => {
    if (!date) return
    const monthIndex = months.findIndex((m) => m === month)
    const newDate = setMonth(date, monthIndex)
    setDate(newDate)
  }

  const handleYearChange = (year: string) => {
    if (!date) return
    const newDate = setYear(date, parseInt(year))
    setDate(newDate)
  }
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-[6px] flex flex-col">
          {label && (
            <FormLabel className="mb-1">
              {label}
              {optional ? ' (opcional)' : ''}
            </FormLabel>
          )}
          <Popover modal={modal}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-card-foreground'
                  )}
                >
                  {field.value ? (
                    format(field.value, 'PPP', { locale: ptBR })
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarBlank
                    weight="bold"
                    className="ml-auto h-4 w-4 opacity-50"
                  />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="bottom">
              <div className="flex items-center justify-between space-x-2 p-3">
                <Select
                  value={date ? months[getMonth(date)] : undefined}
                  onValueChange={handleMonthChange}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={date ? getYear(date).toString() : undefined}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="w-[90px]">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date)
                  setDate(date)
                }}
                locale={ptBR}
                disabled={
                  future
                    ? (date) => date > maxDate
                    : (date) => date > maxDate || date < minDate
                }
                initialFocus
                month={date}
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
