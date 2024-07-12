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
  return Number(
    installmentOrSalary.reduce((acc, cur) => acc + cur.amount, 0).toFixed(2)
  ).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
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

export function formatDate(date: string) {
  const [, month, day] = date.split('-')
  const dayFormatted = day.split('T')[0]
  return `${dayFormatted} de ${months[Number(month) - 1]}`
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
