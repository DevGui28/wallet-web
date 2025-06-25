export const months = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

export const getYearOptions = (currentYear: number, range = 1) => {
  return Array.from({ length: range * 2 + 5 }, (_, i) => {
    const year = currentYear - range + i
    return {
      value: year.toString(),
      label: year.toString(),
    }
  })
}

export const getMonthStartEndDates = (year: number, month: number) => {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  }
}
