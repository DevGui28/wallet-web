'use client'

import axiosInstance from '@/api/axiosInstance'
import { formateCurrencyToNumber, formatNumberToCurrency } from '@/lib/useful'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, TextField } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function NewSalariesPage() {
  const [inputValue, setInputValue] = useState({
    description: '',
    amount: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [suceess, setSuccess] = useState<string | null>(null)

  const insertNewSalary = z.object({
    description: z
      .string()
      .min(3, { message: 'Descrição deve ser maior que 2 caracteres' }),
    amount: z.string().min(1, { message: 'Digite um numero' }),
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
    handleSubmit,
    formState: { errors },
  } = useForm<NewSalary>({
    resolver: zodResolver(insertNewSalary),
  })

  async function onSubmit(inputs: NewSalary) {
    setError(null)
    try {
      const newInputs = {
        ...inputs,
        amount: formateCurrencyToNumber(inputs.amount),
      }
      const { data } = await axiosInstance.post('/salary', newInputs)
      if (data) {
        setInputValue({ description: '', amount: '' })
        setSuccess('Salário adicionado com sucesso')
      }
    } catch (error: any) {
      setError(error.response?.data.message || 'Ocorreu um erro inesperado')
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

      <button type="submit" className="rounded-md bg-blue-500 p-2 text-white">
        Adicionar Salário
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {suceess && <p className="text-green-500">{suceess}</p>}
    </Box>
  )
}
