'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from '@phosphor-icons/react'
import { GoalDialog } from '../GoalDialog'

export default function GoalsList() {
  const [open, setOpen] = useState(false)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle className="text-lg sm:text-xl">Meus Objetivos</CardTitle>
        <Button
          onClick={() => setOpen(true)}
          className="flex h-8 w-full items-center justify-center gap-1 text-xs sm:h-9 sm:w-auto sm:gap-2 sm:text-sm"
          size="sm"
        >
          <Plus size={14} weight="bold" className="sm:size-4" />
          Novo Objetivo
        </Button>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {/* {isLoading ? (
          <div className="col-span-full flex h-40 items-center justify-center text-muted-foreground">
            <p className="text-sm font-medium sm:text-base">
              Carregando objetivos...
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <div key={goal.id} className="w-full">
                <GoalCard goal={goal} />
              </div>
            ))}
            {goals.length === 0 && (
              <div className="col-span-full flex h-40 items-center justify-center text-muted-foreground">
                <p className="text-sm font-medium sm:text-base">
                  Nenhum objetivo encontrado
                </p>
              </div>
            )}
          </div>
        )} */}
      </CardContent>
      <GoalDialog open={open} setOpen={setOpen} />
    </Card>
  )
}
