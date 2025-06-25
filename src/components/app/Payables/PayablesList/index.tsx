'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from '@phosphor-icons/react'
import { PayablesTable } from '../PayablesTable'
import { PayableDialog } from '../PayableDialog'

export default function PayablesList() {
  const [open, setOpen] = useState(false)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Contas Fixas</CardTitle>
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
          size="sm"
        >
          <Plus size={16} weight="bold" />
          Nova Conta
        </Button>
      </CardHeader>
      <CardContent>
        <PayablesTable />
      </CardContent>
      <PayableDialog open={open} setOpen={setOpen} />
    </Card>
  )
}
