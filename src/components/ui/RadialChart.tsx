'use client'

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formateCurrencyToNumber, formatNumberToCurrency } from '@/lib/useful'

const chartConfig = {
  salary: {
    label: 'Renda',
    color: 'hsl(124, 65%, 44%)',
  },
  installment: {
    label: 'Despesa',
    color: 'hsl(0, 69%, 48%)',
  },
} satisfies ChartConfig

type Props = {
  totalInstallments: string
  totalSalaries: string
  monthCurrent: string
}

export default function Component({
  totalInstallments,
  totalSalaries,
  monthCurrent,
}: Props) {
  const salary = formateCurrencyToNumber(totalSalaries)
  const installment = formateCurrencyToNumber(totalInstallments)

  const chartData = [
    { month: monthCurrent, salary: salary - installment, installment },
  ]
  const totalExpenses = formatNumberToCurrency(salary - installment).replace(
    'R$',
    ''
  )

  if (installment === 0 || salary === 0) {
    return null
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Resumo</CardTitle>
        <CardDescription>{monthCurrent}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalExpenses}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Renda
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="salary"
              stackId="a"
              fill="var(--color-salary)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="installment"
              fill="var(--color-installment)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="-mt-20 flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Monstrando as despesas e salários do mês
        </div>
      </CardFooter>
    </Card>
  )
}
