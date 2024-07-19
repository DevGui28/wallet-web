'use client'

import axiosInstance from '@/api/axiosInstance'
import { useToast } from '@/components/ui/use-toast'
import { formateCurrencyToNumber, formatNumberToCurrency } from '@/lib/useful'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, CircularProgress, TextField } from '@mui/material'
import clsx from 'clsx'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const INITIAL_INPUTS = {
  description: '',
  amount: '',
}

export default function NewSalariesPage() {
  const [inputValue, setInputValue] = useState(INITIAL_INPUTS)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { toast } = useToast()

  const insertNewSalary = z.object({
    description: z
      .string()
      .min(3, { message: 'Descrição deve ser maior que 2 caracteres' }),
    amount: z.string().min(8, { message: 'Digite um valor maior que R$:9,99' }),
  })

  type NewSalary = z.infer<typeof insertNewSalary>

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = e.target
    if (name === 'description') {
      setInputValue((prev) => ({ ...prev, description: value }))
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

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<NewSalary>({
    resolver: zodResolver(insertNewSalary),
  })

  async function onSubmit(inputs: NewSalary) {
    setIsLoading(true)
    try {
      const newInputs = {
        ...inputs,
        amount: formateCurrencyToNumber(inputs.amount),
      }

      console.log(newInputs)

      const { data } = await axiosInstance.post('/salary', newInputs)
      if (data) {
        toast({
          title: 'Sucesso',
          description: 'Salário adicionado com sucesso',
        })
        reset()
        setInputValue(INITIAL_INPUTS)
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
      className="flex flex-col gap-4 p-4"
    >
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

      <button
        className={clsx(
          'mt-5 flex items-center justify-center rounded-md p-2 text-white',
          isLoading
            ? 'cursor-not-allowed bg-green-400'
            : 'cursor-pointer bg-green-600'
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
        {isLoading ? 'Adicionando Salário' : 'Adicionar Salário'}
      </button>
    </Box>
  )
}
