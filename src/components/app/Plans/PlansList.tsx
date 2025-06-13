'use client'

import { useState } from 'react'
import { usePlans, useUpdateUserPlan } from '../../../hooks/usePlans'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card'
import { Button } from '../../ui/button'
import { Check } from '@phosphor-icons/react'
import { formatCurrency } from '../../../lib/utils'
import { ConfirmationDialog } from '../Common/ConfirmationDialog'

export default function PlansList() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const { data: plans = [], isLoading } = usePlans()
  const updatePlanMutation = useUpdateUserPlan()

  const handleConfirmPlanChange = async () => {
    if (!selectedPlanId) return

    try {
      await updatePlanMutation.mutateAsync({ planId: selectedPlanId })
    } catch (error) {
      console.error('Erro ao atualizar plano:', error)
    } finally {
      setSelectedPlanId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p>Carregando planos...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`flex flex-col ${plan.isActive ? 'border-primary' : ''}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {plan.name}
              {plan.isActive && (
                <span className="rounded-full bg-primary px-2 py-1 text-xs text-white">
                  Atual
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-6">
              <p className="text-3xl font-bold">{formatCurrency(plan.price)}</p>
              <p className="text-sm text-muted-foreground">por mês</p>
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <ConfirmationDialog
              trigger={
                <Button
                  className="w-full"
                  variant={plan.isActive ? 'outline' : 'default'}
                  disabled={plan.isActive || updatePlanMutation.isPending}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  {plan.isActive ? 'Plano Atual' : 'Escolher Plano'}
                </Button>
              }
              title="Confirmar alteração de plano"
              description={`Tem certeza que deseja mudar para o plano ${plan.name}? ${plan.price > 0 ? 'Será cobrado o valor de ' + formatCurrency(plan.price) + ' mensalmente.' : ''}`}
              confirmText="Confirmar"
              onConfirm={handleConfirmPlanChange}
              isLoading={
                updatePlanMutation.isPending && selectedPlanId === plan.id
              }
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
