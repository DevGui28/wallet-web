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
        <div className="bg-primary px-3 py-1 text-center text-xs font-medium text-primary-foreground">
          Recomendado
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <div className="mt-2">
          <span className="text-2xl font-bold">R$ {plan.price.toFixed(2)}</span>
          <span className="text-muted-foreground">/mês</span>
        </div>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              {feature.included ? (
                <Check size={16} className="text-success" weight="bold" />
              ) : (
                <X size={16} className="text-muted-foreground" weight="bold" />
              )}
              <span
                className={cn(
                  'text-sm',
                  !feature.included && 'text-muted-foreground'
                )}
              >
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={plan.recommended ? 'default' : 'outline'}
          disabled={plan.buttonText === 'Plano Atual'}
        >
          {plan.buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
