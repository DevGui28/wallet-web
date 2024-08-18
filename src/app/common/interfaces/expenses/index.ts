import { Category } from '../categories'

export type Expense = {
  id: string
  amount: number
  description: string
  dueDate: Date
  category: Category
  recurring: number
  isRecurring: boolean
}
