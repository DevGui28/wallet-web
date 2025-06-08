'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from '@phosphor-icons/react'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { handleGetCreditCards } from '../../../api'
import { Button } from '../../ui/button'
import { CreditCard } from './CreditCardList'

export default function CreditCardListNew() {
  const { data: creditCards, isLoading } = useQuery({
    queryKey: ['credit-cards-detail'],
    queryFn: handleGetCreditCards,
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Cartões de Crédito</CardTitle>
          <Link href="/credit-card/create">
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Adicionar cartão
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-wrap justify-center gap-4">
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-40 w-96 animate-pulse rounded-lg bg-muted"
              ></div>
            ))}
          {!!creditCards?.length &&
            creditCards.map((creditCard) => (
              <CreditCard
                key={creditCard.id}
                creditCard={creditCard}
                edit={true}
              />
            ))}
          {!creditCards?.length && !isLoading && (
            <div className="flex h-40 w-full items-center justify-center rounded-lg bg-card shadow-sm">
              <p className="text-lg font-semibold text-muted-foreground">
                Nenhum cartão de crédito cadastrado
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
