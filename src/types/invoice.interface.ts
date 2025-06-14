export type InvoiceResponse = {
  id: string
  userId: string
  creditCardId: string
  month: number
  year: number
  totalAmount: number | string
  isPaid: boolean
  paidAt?: string | Date | null
  dueDate: string | Date
  closingDate: string | Date
  createdAt: string
  updatedAt: string
}
