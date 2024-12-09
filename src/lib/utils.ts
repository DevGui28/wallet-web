import { type ClassValue, clsx } from 'clsx'
import { add, formatDate } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import {
  TransactionResponse,
  TransactionType,
} from '../components/app/Transactions/interfaces'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function transformToCammelCase(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
    index === 0 ? word.toUpperCase() : word.toLowerCase()
  )
}

export function formatDateToString(date: Date | string) {
  return transformToCammelCase(
    formatDate(add(new Date(date), { days: 1 }), 'EEE - dd/MM/yyyy ')
  )
}

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}

export function sumTotal(transactions: TransactionResponse[]) {
  return formatCurrency(
    transactions.reduce((acc, curr) => {
      if (curr.type === TransactionType.EXPENSE) {
        return acc - Number(curr.totalAmount)
      }
      return acc + Number(curr.totalAmount)
    }, 0)
  )
}
