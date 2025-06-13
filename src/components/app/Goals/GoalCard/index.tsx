'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { CoinVertical, PencilSimpleLine, Trash } from '@phosphor-icons/react'
import { AddValueDialog } from '../AddValueDialog'
import { GoalEditDialog } from '../GoalEditDialog'
import { Goal } from '../../../../api/goals'
import { useAddValueToGoal, useDeleteGoal } from '../../../../hooks/useGoals'

type Props = {
  goal: Goal
}

export function GoalCard({ goal }: Props) {
  const [openAddValueDialog, setOpenAddValueDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100)
  const remaining = goal.targetAmount - goal.currentAmount

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  }

  const addValueMutation = useAddValueToGoal()
  const deleteGoalMutation = useDeleteGoal()

  const handleAddValue = async (goalId: string, amount: number) => {
    try {
      await addValueMutation.mutateAsync({ id: goalId, amount })
      return Promise.resolve()
    } catch (error) {
      console.error('Erro ao adicionar valor ao objetivo:', error)
      return Promise.reject(error)
    }
  }

  const handleDeleteGoal = async () => {
    try {
      await deleteGoalMutation.mutateAsync(goal.id)
    } catch (error) {
      console.error('Erro ao excluir objetivo:', error)
    }
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
              onClick={() => setOpenEditDialog(true)}
            />
            <Trash
              size={14}
              className="cursor-pointer text-muted-foreground hover:text-destructive sm:size-4"
              onClick={handleDeleteGoal}
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
          onClick={() => setOpenAddValueDialog(true)}
        >
          <CoinVertical size={14} weight="bold" className="sm:size-4" />
          Adicionar Valor
        </Button>
        <AddValueDialog
          open={openAddValueDialog}
          setOpen={setOpenAddValueDialog}
          goal={goal}
          onAddValue={handleAddValue}
        />
        <GoalEditDialog
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          goal={goal}
        />
      </CardContent>
    </Card>
  )
}
