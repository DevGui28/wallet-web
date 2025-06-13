export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  features: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateUserPlanDTO {
  planId: string
}
