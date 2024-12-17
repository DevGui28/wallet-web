'use client'

import { CalendarBlank } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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
}: Props<T, K>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-[6px] flex flex-col">
          {label && <FormLabel className="mb-1">{label}</FormLabel>}
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
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                locale={ptBR}
                disabled={(date) => date > maxDate || date < minDate}
                initialFocus
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
