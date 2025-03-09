'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { formatCurrency } from '../../../lib/utils'

const data = [
  { name: 'Casa', value: 1200, color: 'hsl(var(--chart-1))' },
  { name: 'Alimentação', value: 450, color: 'hsl(var(--chart-2))' },
  { name: 'Transporte', value: 300, color: 'hsl(var(--chart-3))' },
  { name: 'Entretenimento', value: 200, color: 'hsl(var(--chart-4))' },
  { name: 'Outros', value: 350, color: 'hsl(var(--chart-5))' },
]

export function ExpensesCategory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por categoria</CardTitle>
        <CardDescription>Seus gastos por categoria esse mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                stroke="background"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
