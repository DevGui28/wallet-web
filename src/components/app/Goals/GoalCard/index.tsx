'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { CoinVertical, PencilSimpleLine, Trash } from '@phosphor-icons/react'
import { AddValueDialog } from '../AddValueDialog'
import { GoalEditDialog } from '../GoalEditDialog'
import { DeleteGoalDialog } from '../DeleteGoalDialog'
import { Goal } from '../../../../hooks/useGoals'
import { formatCurrency } from '../../../../lib/utils'

type Props = {
  goal: Goal
}

export function GoalCard({ goal }: Props) {
  const [openAddValueDialog, setOpenAddValueDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const percentage = Math.round(
    (Number(goal.savedValue) / Number(goal.targetValue)) * 100
  )
  const remaining = Number(goal.targetValue) - Number(goal.savedValue)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <h3 className="truncate text-sm font-medium sm:text-base">
              {goal.name}
            </h3>
            {goal.description && (
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {goal.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1 sm:gap-2">
            <PencilSimpleLine
              size={14}
              className="cursor-pointer text-muted-foreground hover:text-primary sm:size-4"
              onClick={() => setOpenEditDialog(true)}
              weight="bold"
            />
            <Trash
              size={14}
              className="cursor-pointer text-muted-foreground hover:text-destructive sm:size-4"
              onClick={() => setOpenDeleteDialog(true)}
              weight="bold"
            />
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between gap-1 text-xs sm:text-sm">
          <span className="font-medium text-primary">
            {percentage}% concluído
          </span>
          <span className="text-muted-foreground">
            Meta: {formatDate(goal.deadline?.toString() || '')}
          </span>
        </div>

        <Progress value={percentage} className="h-2" />

        <div className="mt-2 text-xs text-muted-foreground">
          {formatCurrency(goal.savedValue)} de{' '}
          {formatCurrency(goal.targetValue)}
        </div>

        <div className="mt-2 text-xs">Faltam {formatCurrency(remaining)}</div>

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
        />
        <GoalEditDialog
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          goal={goal}
        />
        <DeleteGoalDialog
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          goal={goal}
        />
      </CardContent>
    </Card>
  )
}
