'use client'

import { CalendarBlank } from '@phosphor-icons/react'
import {
  format,
  getMonth,
  getYear,
  isValid,
  parse,
  setMonth,
  setYear,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { cn } from '../../../../lib/utils'
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
  className,
}: Props<T, K>) {
  const [date, setDate] = useState<Date | undefined>(
    form.getValues(name) as Date | undefined
  )
  const [inputValue, setInputValue] = useState<string>(
    date ? format(date, 'dd/MM/yyyy') : ''
  )

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value[name]) {
        setDate(value[name] as Date)
        setInputValue(format(value[name] as Date, 'dd/MM/yyyy'))
      }
    })

    return () => subscription.unsubscribe()
  }, [form, name])

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

  const years = Array.from(
    { length: maxDate.getFullYear() - minDate.getFullYear() + 1 },
    (_, i) => minDate.getFullYear() + i
  )

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex w-full flex-col', className)}>
          {label && (
            <FormLabel className="text-xs font-medium sm:text-sm">
              {label}
              {optional ? ' (opcional)' : ''}
            </FormLabel>
          )}
          <Popover modal={modal}>
            <PopoverTrigger asChild>
              <FormControl>
                <div className="relative flex w-full items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      const value = e.target.value
                      setInputValue(value)

                      if (value.length === 10) {
                        try {
                          const parsedDate = parse(
                            value,
                            'dd/MM/yyyy',
                            new Date()
                          )
                          if (isValid(parsedDate)) {
                            setDate(parsedDate)
                            field.onChange(parsedDate)
                          }
                        } catch (error) {
                          // Ignora erros de parsing
                        }
                      }
                    }}
                    placeholder={placeholder}
                    className={cn(
                      'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                      'placeholder:text-muted-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      'disabled:cursor-not-allowed disabled:opacity-50'
                    )}
                    disabled={form.formState.isSubmitting}
                  />
                  <CalendarBlank className="absolute right-3 h-4 w-4 opacity-50" />
                </div>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="bottom">
              <div className="flex w-full items-center justify-between gap-2 p-3">
                <Select
                  value={date ? months[getMonth(date)] : undefined}
                  onValueChange={handleMonthChange}
                >
                  <SelectTrigger className="w-full">
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
                  <SelectTrigger className="w-full">
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
                  if (date) {
                    setInputValue(format(date, 'dd/MM/yyyy'))
                  } else {
                    setInputValue('')
                  }
                }}
                onMonthChange={(newMonth) => {
                  setDate(newMonth)
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
          {description && (
            <FormDescription className="text-xs">{description}</FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  )
}
