'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type Feature = {
  name: string
  included: boolean
}

type Plan = {
  id: string
  name: string
  price: number
  description: string
  features: Feature[]
  recommended: boolean
  buttonText: string
}

type Props = {
  plan: Plan
}

export function PlanCard({ plan }: Props) {
  return (
    <Card
      className={cn(
        'flex h-full flex-col',
        plan.recommended && 'border-2 border-primary'
      )}
    >
      {plan.recommended && (
        <div className="bg-primary px-2 py-0.5 text-center text-[10px] font-medium text-primary-foreground sm:px-3 sm:py-1 sm:text-xs">
          Recomendado
        </div>
      )}
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <CardTitle className="text-base sm:text-lg md:text-xl">
          {plan.name}
        </CardTitle>
        <div className="mt-1 sm:mt-2">
          <span className="text-lg font-bold sm:text-xl md:text-2xl">
            R$ {plan.price.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground sm:text-sm">/mês</span>
        </div>
        <p className="text-xs text-muted-foreground sm:text-sm">
          {plan.description}
        </p>
      </CardHeader>
      <CardContent className="flex-1 p-3 sm:p-4 md:p-6">
        <ul className="space-y-1 sm:space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              {feature.included ? (
                <Check
                  size={14}
                  className="text-success sm:size-4"
                  weight="bold"
                />
              ) : (
                <X
                  size={14}
                  className="text-muted-foreground sm:size-4"
                  weight="bold"
                />
              )}
              <span
                className={cn(
                  'text-xs sm:text-sm',
                  !feature.included && 'text-muted-foreground'
                )}
              >
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 md:p-6">
        <Button
          className="h-8 w-full text-xs sm:h-9 sm:text-sm"
          variant={plan.recommended ? 'default' : 'outline'}
          disabled={plan.buttonText === 'Plano Atual'}
        >
          {plan.buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
