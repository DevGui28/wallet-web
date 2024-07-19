'use client'

import axiosInstance from '@/api/axiosInstance'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { useInstallments } from '@/hooks/useInstallments'
import { formateCurrencyToNumber, formatNumberToCurrency } from '@/lib/useful'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import clsx from 'clsx'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const INITIAL_INPUTS = {
  description: '',
  amount: '',
  categoryId: '',
  recurring: '',
}

export default function NewSalariesPage() {
  const [inputValue, setInputValue] = useState(INITIAL_INPUTS)
  const [isRecurring, setIsRecurring] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { categories } = useInstallments()
  const { toast } = useToast()

  const insertNewExpense = z.object({
    description: z
      .string()
      .min(3, { message: 'Descrição deve ser maior que 2 caracteres' }),
    amount: z.string().min(1, { message: 'Digite um numero' }),
    categoryId: z.string().min(1, { message: 'Selecione uma categoria' }),
    recurring: z.string().default('1').optional(),
    isRecurring: z.boolean().default(false).optional(),
  })

  type NewExpense = z.infer<typeof insertNewExpense>

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = e.target
    if (name !== 'amount') {
      setInputValue((prev) => ({ ...prev, [name]: value }))
      return
    }
    const numberString = value.replace(/\D/g, '')
    if (numberString === '') {
      setInputValue((prev) => ({ ...prev, amount: '' }))
      return
    }
    const number = parseFloat(numberString) / 100
    setInputValue((prev) => ({
      ...prev,
      amount: formatNumberToCurrency(number),
    }))
  }

  function handleSelectChange(e: SelectChangeEvent) {
    setInputValue((prev) => ({ ...prev, categoryId: e.target.value as string }))
  }

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<NewExpense>({
    resolver: zodResolver(insertNewExpense),
  })

  async function onSubmit(inputs: NewExpense) {
    setIsLoading(true)
    try {
      const condition = !isRecurring ? Number(inputs.recurring) : 1
      const newInputs = {
        ...inputs,
        dueDate: date,
        amount: formateCurrencyToNumber(inputs.amount),
        recurring: condition === 0 ? 1 : condition,
        isRecurring,
      }
      const { data } = await axiosInstance.post('/expense', newInputs)
      if (data) {
        reset()
        setInputValue(INITIAL_INPUTS)
        toast({
          title: 'Sucesso',
          description: 'Despesa adicionada com sucesso',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        variant: 'destructive',
        description:
          error.response?.data.message || 'Ocorreu um erro inesperado',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="mb-14 flex flex-col gap-4 p-4"
    >
      <FormControl fullWidth>
        <InputLabel id="category">Categoria</InputLabel>
        <Select
          {...register('categoryId')}
          type="text"
          name="categoryId"
          value={inputValue.categoryId}
          label="Categoria"
          onChange={handleSelectChange}
          error={!!errors.categoryId}
          labelId="category"
          className="rounded-md border border-gray-300"
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        {...register('amount')}
        type="text"
        label="Valor"
        name="amount"
        value={inputValue.amount}
        onChange={handleChange}
        error={!!errors.amount}
        helperText={errors.amount?.message}
        InputLabelProps={{ shrink: !!inputValue.amount }}
        className="rounded-md border border-gray-300"
      />
      <TextField
        {...register('description')}
        type="text"
        variant="outlined"
        label="Descrição"
        onChange={handleChange}
        name="description"
        value={inputValue.description}
        error={!!errors.description}
        helperText={errors.description?.message}
        className="rounded-md border border-gray-300"
        InputLabelProps={{ shrink: !!inputValue.description }}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[100%] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date &&
              `${format(date, 'dd/MM/yyyy')} - Data do Primeiro Pagamento`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <FormControl className="flex flex-row items-center gap-3">
        <Checkbox
          checked={isRecurring}
          onCheckedChange={() => setIsRecurring(!isRecurring)}
        />
        <span>É uma conta recorrente?</span>
      </FormControl>
      <p className="-mt-3 text-xs text-gray-500">
        Marque se a despesa é recorrente, caso contrário, deixe em branco
      </p>

      {!isRecurring && (
        <TextField
          {...register('recurring')}
          type="number"
          variant="outlined"
          placeholder="Parcelas (1 para despesa única)"
          onChange={handleChange}
          name="recurring"
          value={inputValue.recurring}
          error={!!errors.recurring}
          helperText={errors.recurring?.message}
          className="rounded-md border border-gray-300"
          InputLabelProps={{ shrink: !!inputValue.recurring }}
        />
      )}

      <button
        className={clsx(
          'mt-5 flex items-center justify-center rounded-md p-2 text-white',
          isLoading
            ? 'cursor-not-allowed bg-red-300'
            : 'cursor-pointer bg-red-500'
        )}
        disabled={isLoading}
        type="submit"
      >
        {isLoading && (
          <CircularProgress
            color="inherit"
            size={15}
            className="mr-2 h-1 w-1 animate-spin"
          />
        )}
        {isLoading ? 'Adicionando Despesa' : 'Adicionar Despesa'}
      </button>
    </Box>
  )
}
