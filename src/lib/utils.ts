import { Installments } from '@/app/common/interfaces/installments'

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

export const calculateTotal = (installmentOrSalary: { amount: number }[]) => {
  return installmentOrSalary
    .reduce((acc, cur) => acc + cur.amount, 0)
    .toFixed(2)
}

export function filterInstallments(
  installment: Installments[],
  month: string
): Installments[] {
  return installment.filter((installment: Installments) => {
    const date = new Date(installment.dueDate)
    return installment.isRecurring || months[date.getMonth()] === month
  })
}

export default function formatDate(date: string) {
  const [year, month, day] = date.split('-')
  const dayFormatted = day.split('T')[0]
  return `${dayFormatted} de ${months[Number(month) - 1]} de ${year}`
}
