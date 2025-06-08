'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from '@phosphor-icons/react'
import { BudgetItem } from '../BudgetItem'
import { BudgetDialog } from '../BudgetDialog'

type Budget = {
  id: string
  category: string
  limit: number
  spent: number
  color: string
}

export default function BudgetsList() {
  const [open, setOpen] = useState(false)
  
  const mockBudgets: Budget[] = [
    {
      id: '1',
      category: 'Alimentação',
      limit: 800,
      spent: 650,
      color: '#FF6B6B',
    },
    {
      id: '2',
      category: 'Transporte',
      limit: 400,
      spent: 380,
      color: '#4ECDC4',
    },
    {
      id: '3',
      category: 'Lazer',
      limit: 300,
      spent: 150,
      color: '#FFD166',
    },
    {
      id: '4',
      category: 'Saúde',
      limit: 500,
      spent: 200,
      color: '#6A0572',
    },
    {
      id: '5',
      category: 'Educação',
      limit: 350,
      spent: 350,
      color: '#1A535C',
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Orçamentos Mensais</CardTitle>
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
          size="sm"
        >
          <Plus size={16} weight="bold" />
          Novo Orçamento
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockBudgets.map((budget) => (
            <BudgetItem key={budget.id} budget={budget} />
          ))}
        </div>
      </CardContent>
      <BudgetDialog open={open} setOpen={setOpen} />
    </Card>
  )
}
