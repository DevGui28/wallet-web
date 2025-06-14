export type BillToPayResponse = {
  id: string
  userId: string
  name: string
  description?: string
  amount: number | string
  dueDate: string | Date
  isPaid: boolean
  paidAt?: string | Date | null
  isRecurring: boolean
  recurrenceDay?: number
  createdAt: string
  updatedAt: string
}
