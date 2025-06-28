import { CreditCardResponse } from './credit-card.interface'
import { TransactionResponse } from './transactions.interface'

export type Invoice = {
  id: string
  userId: string
  creditCardId: string
  month: number
  year: number
  totalAmount: string
  isPaid: boolean
  paidAt: string | null
  dueDate: string
  closingDate: string
  createdAt: string
  updatedAt: string
  creditCard: CreditCardResponse
  transactions: TransactionResponse[]
}

export type InvoiceResponse = {
  paid: Invoice[]
  pending: Invoice[]
}
