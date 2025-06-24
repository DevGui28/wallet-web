import { CategoriesResponse } from './categories.interface'

export interface Budget {
  id: string
  categoryId: string
  limit: number
  spent?: number
  available?: number
  percentUsed?: number
  createdAt: string
  updatedAt: string
  category: CategoriesResponse
}

export interface CreateBudgetDTO {
  categoryId: string
  limit: number
}

export interface UpdateBudgetDTO {
  limit?: number
}

export interface BudgetFilters {
  month?: number
  year?: number
}
