export enum CategoriesType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  INVESTMENT = 'INVESTMENT',
}

export type CategoriesResponse = {
  id: string
  name: string
  type: CategoriesType
}
