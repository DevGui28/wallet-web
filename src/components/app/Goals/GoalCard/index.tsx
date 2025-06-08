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
      <div className="flex h-24 items-center justify-center bg-primary/10 text-4xl">
        {goal.icon}
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium">{goal.title}</h3>
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
          className="mt-4 flex w-full items-center justify-center gap-2"
          size="sm"
        >
          <CoinVertical size={16} weight="bold" />
          Adicionar Valor
        </Button>
      </CardContent>
    </Card>
  )
}
