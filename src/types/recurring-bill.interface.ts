export type RecurringBillResponse = {
  id: string
  userId: string
  name: string
  description?: string
  amount: number | string
  recurrenceDay: number
  createdAt: string
  updatedAt: string
}
