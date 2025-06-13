export interface Budget {
  id: string
  category: string
  limit: number
  month: number
  year: number
  spent?: number
  available?: number
  percentage?: number
  createdAt: string
  updatedAt: string
}

export interface CreateBudgetDTO {
  category: string
  limit: number
  month: number
  year: number
}

export interface UpdateBudgetDTO {
  limit?: number
}

export interface BudgetFilters {
  month?: number
  year?: number
}
