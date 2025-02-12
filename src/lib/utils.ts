import { type ClassValue, clsx } from 'clsx'
import { formatDate } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import {
  TransactionResponse,
  TransactionType,
} from '../types/transactions.interface'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function transformToCammelCase(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
    index === 0 ? word.toUpperCase() : word.toLowerCase()
  )
}

export function formatDateToString(date: Date | string) {
  return formatDate(new Date(date), 'dd/MM/yyyy')
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

export const optionsLongMonth = {
  locale: {
    localize: {
      month: (n: number) => {
        return [
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
        ][n]
      },
      ordinalNumber: (n: number) => `${n}º`,
      era: (n: number) => (n === 0 ? 'AC' : 'DC'),
      quarter: (n: number) => `${n}º trimestre`,
      day: (n: number) => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][n],
      dayPeriod: (n: string) => (n === 'am' ? 'AM' : 'PM'),
    },
    formatLong: {
      date: () => 'dd/MM/yyyy',
      time: () => 'HH:mm',
      dateTime: () => 'dd/MM/yyyy HH:mm',
    },
  },
}

export const optionsShortMonth = {
  locale: {
    localize: {
      month: (n: number) => {
        return [
          'Jan',
          'Fev',
          'Mar',
          'Abr',
          'Mai',
          'Jun',
          'Jul',
          'Ago',
          'Set',
          'Out',
          'Nov',
          'Dez',
        ][n]
      },
      ordinalNumber: (n: number) => `${n}º`,
      era: (n: number) => (n === 0 ? 'AC' : 'DC'),
      quarter: (n: number) => `${n}º trimestre`,
      day: (n: number) => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][n],
      dayPeriod: (n: string) => (n === 'am' ? 'AM' : 'PM'),
    },
    formatLong: {
      date: () => 'dd/MM/yyyy',
      time: () => 'HH:mm',
      dateTime: () => 'dd/MM/yyyy HH:mm',
    },
  },
}
