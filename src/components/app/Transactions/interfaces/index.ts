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
  creditCard?: {
    cardName: string
  }
}

export type CategoriesResponse = {
  id: string
  name: string
  type: TransactionType
}
