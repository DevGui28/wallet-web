import { CreditCardResponse } from './credit-card.interface'
import { Invoice } from './invoice.interface'
import { RecurringBillResponse } from './recurring-bill.interface'

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
  INVESTMENT = 'INVESTMENT',
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
  name: string
  description?: string
  creditCardId: string
  categoryId: string
  installmentNumber: number
  amount: number | string
  totalInstallments: number
  dueDate: string | Date
  date: string | Date
  paymentStatus: TransactionStatus
  paidAt: string | Date | null
  createdAt: string
  updatedAt: string
  category: {
    name: string
  }
}

export interface CreateTransaction {
  categoryId: string
  name: string
  description?: string
  paymentMethod: string
  isRecurring?: boolean
  creditCardId?: string
  totalInstallments?: number
  date: string | Date
  totalAmount: number
  type: TransactionType
}

export type TransactionResponse = {
  id: string
  userId: string
  categoryId: string
  name: string
  type: TransactionType
  description?: string
  paymentMethod: PaymentMethod
  date: string | Date
  totalAmount: number | string
  creditCardId?: string
  createdAt: string
  updatedAt: string
  isPaid: boolean
  isRecurring: boolean
  paidAt: string | Date | null
  invoiceId?: string
  totalInstallments?: number
  installmentNumber?: number
  recurringBillId?: string
  category: {
    name: string
  }
  creditCard?: CreditCardResponse
  recurringBill?: RecurringBillResponse
  invoice?: Invoice
}

export interface TransactionFilters {
  categoryId?: string
  paymentMethod?: string
  creditCardId?: string
  type?: TransactionType | 'ALL'
  startDate?: string
  endDate?: string
}

export interface PendingPayments {
  id: string
  userId: string
  name: string
  description?: string
  categoryId: string
  totalAmount: number
  dueDate: string | Date
  status: TransactionStatus
  paymentMethod: PaymentMethod
  paidAt: string | Date | null
  createdAt: string
  updatedAt: string
  category: {
    name: string
  }
}

export type PendingPaymentsResponse = {
  pending: number
  paid: number
  total: number
  installments: PendingPayments[]
}

export type InstallmentsResponse = {
  total: number
  installments: SplitsOrRecurrences[]
}
