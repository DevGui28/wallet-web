import { CreditCardResponse } from './credit-card.interface'

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
  BANK_SLIP = 'BANK_SLIP',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PIX = 'PIX',
  OTHER = 'OTHER',
}

export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum RecurrenceType {
  INSTALLMENT = 'INSTALLMENT',
  RECURRING = 'RECURRING',
}

export type SplitsOrRecurrences = {
  id: string
  transactionId: string
  creditCardId: string
  type: RecurrenceType
  installmentNumber: number
  amount: string
  totalInstallments: number
  dueDate: string
  paymentStatus: TransactionStatus
  paidAt: string | Date | null
  createdAt: string
  updatedAt: string
}

export type TransactionResponse = {
  id: string
  userId: string
  name: string
  type: TransactionType
  description?: string | null
  paymentMethod: PaymentMethod
  date: string
  totalAmount: string
  isSplitOrRecurring: boolean
  createdAt: string
  updatedAt: string
  category: {
    name: string
  }
  creditCard?: CreditCardResponse
  splitsOrRecurrences: SplitsOrRecurrences[]
}

export interface CreateTransaction {
  categoryId: string
  name: string
  description?: string
  paymentMethod: string
  creditCardId?: string
  totalInstallments?: number
  isSplitOrRecurring?: boolean
  date: string | Date
  totalAmount: number
  type: TransactionType
}

export type IncomesResponse = {
  total: number
  installments: TransactionResponse[]
}
