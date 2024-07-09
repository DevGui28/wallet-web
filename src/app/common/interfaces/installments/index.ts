export type Installments = {
  id: string
  amount: number
  dueDate: string
  currentInstallment: number
  isRecurring: boolean
  paid: boolean
  expense: {
    description: string
    recurring: number
    category: {
      name: string
    }
  }
}

export type InstallmentsResponse = {
  data: Installments[]
}
