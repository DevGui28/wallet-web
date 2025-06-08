'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { CoinVertical, PencilSimpleLine, Trash } from '@phosphor-icons/react'

type Goal = {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  icon: string
}

type Props = {
  goal: Goal
}

export function GoalCard({ goal }: Props) {
  const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100)
  const remaining = goal.targetAmount - goal.currentAmount

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex h-20 items-center justify-center bg-primary/10 text-3xl sm:h-24 sm:text-4xl">
        {goal.icon}
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-medium sm:text-base">
            {goal.title}
          </h3>
          <div className="flex shrink-0 gap-1 sm:gap-2">
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

        <div className="mb-2 flex items-center justify-between gap-1 text-xs sm:text-sm">
          <span className="font-medium text-primary">
            {percentage}% concluído
          </span>
          <span className="text-muted-foreground">
            Meta: {formatDate(goal.deadline)}
          </span>
        </div>

        <Progress value={percentage} className="h-2" />

        <div className="mt-2 text-xs text-muted-foreground">
          R$ {goal.currentAmount.toFixed(2)} de R${' '}
          {goal.targetAmount.toFixed(2)}
        </div>

        <div className="mt-2 text-xs">Faltam R$ {remaining.toFixed(2)}</div>

        <Button
          className="mt-3 flex h-8 w-full items-center justify-center gap-1 text-xs sm:mt-4 sm:h-9 sm:gap-2 sm:text-sm"
          size="sm"
        >
          <CoinVertical size={14} weight="bold" className="sm:size-4" />
          Adicionar Valor
        </Button>
      </CardContent>
    </Card>
  )
}
