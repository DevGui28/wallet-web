'use client'

import { Goal, useGoals } from '../../../../hooks/useGoals'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  goal: Goal | null
}

export function DeleteGoalDialog({ open, setOpen, goal }: Props) {
  const { useDeleteGoal } = useGoals()
  const deleteGoalMutation = useDeleteGoal()

  const handleDelete = () => {
    if (!goal) return

    deleteGoalMutation.mutate(goal.id, {
      onSuccess: () => {
        setOpen(false)
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl">
            Excluir Meta
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm">
            Tem certeza que deseja excluir esta meta? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-end">
          <AlertDialogCancel
            className="h-8 text-xs sm:h-9 sm:text-sm"
            disabled={deleteGoalMutation.isPending}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="h-8 bg-destructive text-xs hover:bg-destructive/90 sm:h-9 sm:text-sm"
            onClick={handleDelete}
            disabled={deleteGoalMutation.isPending}
          >
            {deleteGoalMutation.isPending ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
