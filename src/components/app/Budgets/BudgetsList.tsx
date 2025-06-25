'use client'

import { useState } from 'react'
import { Budget, UpdateBudgetDTO } from '../../../types/budgets.interface'
import {
  useBudgets,
  useUpdateBudget,
  useDeleteBudget,
} from '../../../hooks/useBudgets'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { PencilSimple, Plus, Trash } from '@phosphor-icons/react'
import { formatCurrency } from '../../../lib/utils'
import { Progress } from '../../ui/progress'
import { CreateBudgetDialog } from '../../../components/app/Budgets/CreateBudgetDialog'
import { EditBudgetDialog } from '../../../components/app/Budgets/EditBudgetDialog'
import { ConfirmationDialog } from '../Common/ConfirmationDialog'
import { toast } from 'sonner'
import { CustomSelect } from '../../shared/CustomSelect'
import { months, getYearOptions } from '../../../lib/date-utils'

export function BudgetsList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null)

  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  const yearOptions = getYearOptions(currentDate.getFullYear())

  const { data: budgets, isLoading } = useBudgets(selectedMonth, selectedYear)
  const updateBudgetMutation = useUpdateBudget()
  const deleteBudgetMutation = useDeleteBudget()

  const handleOpenEditDialog = (budget: Budget) => {
    setSelectedBudget(budget)
    setIsEditDialogOpen(true)
  }

  const handleUpdateBudget = (id: string, data: UpdateBudgetDTO) => {
    updateBudgetMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false)
          setSelectedBudget(null)
          toast.success('Orçamento atualizado com sucesso!')
        },
        onError: (error) => {
          toast.error('Erro ao atualizar orçamento')
          console.error(error)
        },
      }
    )
  }

  const handleConfirmDelete = () => {
    if (!deletingBudgetId) return

    deleteBudgetMutation.mutate(deletingBudgetId, {
      onSuccess: () => {
        toast.success('Orçamento excluído com sucesso!')
        setDeletingBudgetId(null)
      },
      onError: (error) => {
        toast.error('Erro ao excluir orçamento')
        console.error(error)
        setDeletingBudgetId(null)
      },
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">Orçamentos</CardTitle>
          </div>
          <div className="flex flex-col items-center gap-6 sm:flex-row md:items-end">
            <div className="flex flex-row items-end gap-2">
              <CustomSelect
                label="Mês"
                placeholder="Mês"
                value={selectedMonth.toString()}
                onChange={(value) => setSelectedMonth(parseInt(value))}
                options={months}
                className="w-[120px]"
              />

              <CustomSelect
                label="Ano"
                placeholder="Ano"
                value={selectedYear.toString()}
                onChange={(value) => setSelectedYear(parseInt(value))}
                options={yearOptions}
                className="w-[100px]"
              />
            </div>
            <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Orçamento
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm font-medium sm:text-base">
              Carregando orçamentos...
            </p>
          </div>
        ) : budgets?.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">
              Nenhum orçamento encontrado para este mês.
            </p>
            <div className="flex flex-col gap-4">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Orçamento
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgets?.map((budget) => (
              <Card key={budget.id}>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {budget.category.name}
                    </h3>
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
                      <span className="text-sm text-muted-foreground">
                        Gasto
                      </span>
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
                    value={budget.percentUsed || 0}
                    className="h-2"
                    indicatorClassName={
                      (budget.percentUsed || 0) > 100
                        ? 'bg-destructive'
                        : (budget.percentUsed || 0) > 80
                          ? 'bg-warning'
                          : 'bg-primary'
                    }
                  />
                  <div className="mt-1 text-right text-xs text-muted-foreground">
                    {budget.percentUsed?.toFixed(0) || 0}% utilizado
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <CreateBudgetDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {selectedBudget && (
        <EditBudgetDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          budget={selectedBudget}
          onSuccess={(id, data) => handleUpdateBudget(id, data)}
        />
      )}
    </Card>
  )
}
