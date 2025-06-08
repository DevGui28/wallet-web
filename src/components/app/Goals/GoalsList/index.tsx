'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from '@phosphor-icons/react'
import { GoalCard } from '../GoalCard'
import { GoalDialog } from '../GoalDialog'

type Goal = {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  icon: string
}

export default function GoalsList() {
  const [open, setOpen] = useState(false)

  const mockGoals: Goal[] = [
    {
      id: '1',
      title: 'Viagem para o Japão',
      targetAmount: 15000,
      currentAmount: 5000,
      deadline: '2026-12-31',
      icon: '✈️',
    },
    {
      id: '2',
      title: 'Comprar um carro',
      targetAmount: 50000,
      currentAmount: 20000,
      deadline: '2026-06-30',
      icon: '🚗',
    },
    {
      id: '3',
      title: 'Reforma da casa',
      targetAmount: 30000,
      currentAmount: 10000,
      deadline: '2025-12-31',
      icon: '🏠',
    },
    {
      id: '4',
      title: 'Fundo de emergência',
      targetAmount: 20000,
      currentAmount: 18000,
      deadline: '2025-09-30',
      icon: '🛡️',
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Meus Objetivos</CardTitle>
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
          size="sm"
        >
          <Plus size={16} weight="bold" />
          Novo Objetivo
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </CardContent>
      <GoalDialog open={open} setOpen={setOpen} />
    </Card>
  )
}
