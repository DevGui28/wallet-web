'use client'

import { Card, CardContent } from '@/components/ui/card'
import { PayablesTable } from '../PayablesTable'

export default function PayablesList() {
  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <PayablesTable />
      </CardContent>
    </Card>
  )
}
