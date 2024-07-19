export type Salaries = {
  id: string
  amount: number
  description: string
  month: Date
}

export type SalariesResponse = {
  data: Salaries[]
}
