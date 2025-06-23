export type CreditCardResponse = {
  id: string
  cardName: string
  limit: string
  lastDigits: number
  closingDay: number
  dueDay: number
  createdAt: string
  updatedAt: string
}

export interface CreateCreditCard {
  cardName: string
  limit?: number | null
  closingDay: number
  dueDay: number
  lastDigits?: number
}

export interface UpdateCreditCard {
  cardName?: string
  limit?: number | null
  closingDay?: number
  dueDay?: number
  lastDigits?: number
}
