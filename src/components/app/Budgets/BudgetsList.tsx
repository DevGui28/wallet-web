'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Budget } from '../../../types/budgets.interface'
import { useBudgets, useDeleteBudget } from '../../../hooks/useBudgets'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { PencilSimple, Plus, Trash } from '@phosphor-icons/react'
import { formatCurrency } from '../../../lib/utils'
import { Progress } from '../../ui/progress'
import { CreateBudgetDialog } from '../../../components/app/Budgets/CreateBudgetDialog'
import { EditBudgetDialog } from '../../../components/app/Budgets/EditBudgetDialog'
import { ConfirmationDialog } from '../Common/ConfirmationDialog'

export default function BudgetsList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null)

  const month = currentDate.getMonth() + 1
  const year = currentDate.getFullYear()

  const { data: budgets = [], isLoading } = useBudgets({ month, year })
  const deleteBudgetMutation = useDeleteBudget()
  const handleOpenEditDialog = (budget: Budget) => {
    setSelectedBudget(budget)
    setIsEditDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingBudgetId) return

    try {
      await deleteBudgetMutation.mutateAsync(deletingBudgetId)
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error)
    } finally {
      setDeletingBudgetId(null)
    }
  }

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setSelectedBudget(null)
  }

  const formatMonth = (date: Date) => {
    return format(date, 'MMMM yyyy', { locale: ptBR })
  }

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handlePreviousMonth}>
            Anterior
          </Button>
          <h2 className="text-xl font-semibold capitalize">
            {formatMonth(currentDate)}
          </h2>
          <Button variant="outline" onClick={handleNextMonth}>
            Próximo
          </Button>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <p>Carregando orçamentos...</p>
        </div>
      ) : budgets.length === 0 ? (
        <Card>
          <CardContent className="flex h-40 flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">
              Nenhum orçamento encontrado para este mês.
            </p>
            <div className="flex flex-col gap-4">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Orçamento
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <Card key={budget.id}>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium">{budget.category}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditDialog(budget)}
                    >
                      <PencilSimple className="h-4 w-4" />
                    </Button>
                    <ConfirmationDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingBudgetId(budget.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      }
                      title="Confirmar exclusão"
                      description="Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita."
                      confirmText="Excluir"
                      onConfirm={handleConfirmDelete}
                      isLoading={
                        deleteBudgetMutation.isPending &&
                        deletingBudgetId === budget.id
                      }
                      variant="destructive"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Limite
                    </span>
                    <span className="font-medium">
                      {formatCurrency(budget.limit)}
                    </span>
                  </div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Gasto</span>
                    <span className="font-medium">
                      {formatCurrency(budget.spent || 0)}
                    </span>
                  </div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Disponível
                    </span>
                    <span className="font-medium">
                      {formatCurrency(budget.available || 0)}
                    </span>
                  </div>
                </div>
                <Progress
                  value={budget.percentage || 0}
                  className="h-2"
                  indicatorClassName={
                    (budget.percentage || 0) > 100
                      ? 'bg-destructive'
                      : (budget.percentage || 0) > 80
                        ? 'bg-warning'
                        : 'bg-primary'
                  }
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  {budget.percentage?.toFixed(0) || 0}% utilizado
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateBudgetDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
        currentMonth={currentDate.getMonth() + 1}
        currentYear={currentDate.getFullYear()}
      />

      {selectedBudget && (
        <EditBudgetDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          budget={selectedBudget}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}
