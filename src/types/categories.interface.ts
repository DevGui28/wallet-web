export enum CategoriesType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

export type CategoriesResponse = {
  id: string
  name: string
  type: CategoriesType
}
