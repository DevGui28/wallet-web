import { Installments } from '@/app/common/interfaces/installments'
import { Salaries } from '@/app/common/interfaces/salaries'

export const months = [
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

export function calculateTotal(installmentOrSalary: { amount: number }[]) {
  return formatNumberToCurrency(
    Number(
      installmentOrSalary.reduce((acc, cur) => acc + cur.amount, 0).toFixed(2)
    )
  )
}

export function formatNumberToCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function filterInstallments(
  installment: Installments[],
  month: string,
  year: number
): Installments[] {
  return installment
    .filter((installment: Installments) => {
      const date = new Date(installment.dueDate)
      return (
        installment.isRecurring ||
        (months[date.getMonth()] === month && date.getFullYear() === year)
      )
    })
    .sort((a, b) => {
      if (a.isRecurring) return -1
      return new Date(a.dueDate).getDate() - new Date(b.dueDate).getDate()
    })
}

export function filterSalaries(salaries: Salaries[], month: string) {
  return salaries.filter((salary) => {
    const date = new Date(salary.month)
    return (
      months[date.getMonth()] === month &&
      date.getFullYear() === new Date().getFullYear()
    )
  })
}

export function formatDate(date: string) {
  const [, month, day] = date.split('-')
  const dayFormatted = day.split('T')[0]
  return `${dayFormatted} de ${months[Number(month) - 1]} de ${new Date().getFullYear()}`
}

export function getNextFiveYears() {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = 0; i < 5; i++) {
    years.push(currentYear + i)
  }
  return years
}

export function welcomePerson(date: Date) {
  const hour = date.getHours()
  if (hour >= 6 && hour < 12) {
    return 'Bom dia'
  } else if (hour >= 12 && hour < 18) {
    return 'Boa tarde'
  } else {
    return 'Boa noite'
  }
}

export function formateCurrencyToNumber(value: string): number {
  return Number(value.replace('R$', '').replace('.', '').replace(',', '.'))
}

export function calculatePercentage(
  total: string | number,
  value: string | number
) {
  total = formateCurrencyToNumber(total as string)
  value = formateCurrencyToNumber(value as string)
  if (total === 0) return 0
  return (value / total) * 100
}
