export interface RecurringBill {
  id: string
  userId: string
  name: string
  description: string
  amount: number
  recurrenceDay: number
  createdAt: string
  updatedAt: string
}

export interface CreateRecurringBillDTO {
  name: string
  description: string
  amount: number
  recurrenceDay: number
}

export interface UpdateRecurringBillDTO {
  amount?: number
  recurrenceDay?: number
}
