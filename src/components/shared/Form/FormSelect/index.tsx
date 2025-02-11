import { ReactNode, useMemo } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '../../../../lib/utils'

type Props<T extends FieldValues, K extends Path<T>> = {
  readonly form: UseFormReturn<T>
  readonly name: K
  readonly data: { label: string; value: T[K] }[] | undefined
  readonly label?: string
  readonly disabled?: boolean
  readonly placeholder?: string
  readonly description?: ReactNode
  readonly className?: string
}

export default function FormSelect<T extends FieldValues, K extends Path<T>>({
  form,
  name,
  data,
  label = '',
  disabled = false,
  placeholder = label,
  description,
  className,
}: Props<T, K>) {
  const isDisabled = useMemo(() => disabled, [disabled])

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full', className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={field.onChange}
            disabled={isDisabled}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {!!data?.length &&
                data.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
