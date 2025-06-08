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
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium">{budget.category}</h3>
          <div className="flex gap-2">
            <PencilSimpleLine
              size={16}
              className="cursor-pointer text-muted-foreground hover:text-primary"
            />
            <Trash
              size={16}
              className="cursor-pointer text-muted-foreground hover:text-destructive"
            />
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between text-sm">
          <span className={getStatusColor()}>{percentage}%</span>
          <span className="text-muted-foreground">
            R$ {budget.spent.toFixed(2)} / R$ {budget.limit.toFixed(2)}
          </span>
        </div>

        <Progress
          value={percentage}
          className="h-2"
          indicatorClassName={
            percentage >= 90
              ? 'bg-destructive'
              : percentage >= 75
                ? 'bg-warning'
                : 'bg-success'
          }
        />

        <div className="mt-2 text-xs text-muted-foreground">
          {remaining > 0
            ? `Restante: R$ ${remaining.toFixed(2)}`
            : 'Orçamento excedido!'}
        </div>
      </CardContent>
    </Card>
  )
}
