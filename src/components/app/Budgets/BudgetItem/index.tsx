'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PencilSimpleLine, Trash } from '@phosphor-icons/react'

type Budget = {
  id: string
  category: string
  limit: number
  spent: number
  color: string
}

type Props = {
  budget: Budget
}

export function BudgetItem({ budget }: Props) {
  const percentage = Math.round((budget.spent / budget.limit) * 100)
  const remaining = budget.limit - budget.spent

  const getStatusColor = () => {
    if (percentage >= 90) return 'text-destructive'
    if (percentage >= 75) return 'text-warning'
    return 'text-success'
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-2" style={{ backgroundColor: budget.color }} />
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-1 sm:mb-2 sm:gap-2">
          <h3 className="truncate text-xs font-medium sm:text-sm md:text-base">
            {budget.category}
          </h3>
          <div className="flex gap-1 sm:gap-2">
            <PencilSimpleLine
              size={14}
              className="cursor-pointer text-muted-foreground hover:text-primary sm:size-4"
            />
            <Trash
              size={14}
              className="cursor-pointer text-muted-foreground hover:text-destructive sm:size-4"
            />
          </div>
        </div>

        <div className="mb-1 flex flex-wrap items-center justify-between gap-1 text-xs sm:mb-2 sm:text-sm">
          <span className={`${getStatusColor()} font-medium`}>
            {percentage}%
          </span>
          <span className="text-[10px] text-muted-foreground sm:text-xs">
            R$ {budget.spent.toFixed(2)} / R$ {budget.limit.toFixed(2)}
          </span>
        </div>

        <Progress
          value={percentage}
          className="h-1.5 sm:h-2"
          indicatorClassName={
            percentage >= 90
              ? 'bg-destructive'
              : percentage >= 75
                ? 'bg-warning'
                : 'bg-success'
          }
        />

        <div className="mt-1 text-[10px] text-muted-foreground sm:mt-2 sm:text-xs">
          {remaining > 0
            ? `Restante: R$ ${remaining.toFixed(2)}`
            : 'Orçamento excedido!'}
        </div>
      </CardContent>
    </Card>
  )
}
