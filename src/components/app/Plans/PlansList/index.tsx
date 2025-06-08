'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlanCard } from '../PlanCard/index'

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

export default function PlansList() {
  const plans: Plan[] = [
    {
      id: '1',
      name: 'Gratuito',
      price: 0,
      description: 'Para quem está começando a organizar suas finanças',
      features: [
        { name: 'Até 50 transações por mês', included: true },
        { name: 'Dashboard básico', included: true },
        { name: 'Controle de cartões (até 2)', included: true },
        { name: 'Orçamentos básicos (até 3)', included: true },
        { name: 'Contas a pagar', included: false },
        { name: 'Objetivos financeiros', included: false },
        { name: 'Relatórios avançados', included: false },
        { name: 'Suporte prioritário', included: false },
      ],
      recommended: false,
      buttonText: 'Plano Atual',
    },
    {
      id: '2',
      name: 'Essencial',
      price: 9.9,
      description: 'Para quem busca mais controle financeiro',
      features: [
        { name: 'Transações ilimitadas', included: true },
        { name: 'Dashboard completo', included: true },
        { name: 'Controle de cartões ilimitado', included: true },
        { name: 'Orçamentos completos', included: true },
        { name: 'Contas a pagar', included: true },
        { name: 'Objetivos financeiros (até 5)', included: true },
        { name: 'Relatórios avançados', included: false },
        { name: 'Suporte prioritário', included: false },
      ],
      recommended: true,
      buttonText: 'Fazer Upgrade',
    },
    {
      id: '3',
      name: 'Premium',
      price: 19.9,
      description: 'Para quem deseja controle financeiro total',
      features: [
        { name: 'Transações ilimitadas', included: true },
        { name: 'Dashboard completo', included: true },
        { name: 'Controle de cartões ilimitado', included: true },
        { name: 'Orçamentos completos', included: true },
        { name: 'Contas a pagar', included: true },
        { name: 'Objetivos financeiros ilimitados', included: true },
        { name: 'Relatórios avançados', included: true },
        { name: 'Suporte prioritário', included: true },
      ],
      recommended: false,
      buttonText: 'Fazer Upgrade',
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Escolha seu plano</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
