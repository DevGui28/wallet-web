export type CreditCardResponse = {
  id: string
  cardName: string
  limit: string
  closingDay: number
  dueDay: number
  createdAt: string
  updatedAt: string
}

export interface CreateCreditCard {
  cardName: string
  limit: number
  closingDay: number
  dueDay: number
}
