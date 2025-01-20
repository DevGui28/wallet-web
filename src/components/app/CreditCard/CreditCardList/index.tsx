'use client'

import { NotePencil } from '@phosphor-icons/react'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { handleGetCreditCards } from '../../../../api'
import { cn } from '../../../../lib/utils'
import { CreditCardResponse } from '../../../../types/credit-card.interface'
import { Button } from '../../../ui/button'
import { Skeleton } from '../../../ui/skeleton'

export default function CreditCardList() {
  const { data: creditCards, isLoading } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: handleGetCreditCards,
  })

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-96" />
          ))}
        {creditCards &&
          creditCards.map((creditCard: CreditCardResponse) => (
            <CreditCard
              key={creditCard.id}
              creditCard={creditCard}
              edit={true}
            />
          ))}
      </div>
    </div>
  )
}

type CreditCardProps = {
  key?: string
  creditCard: CreditCardResponse
  edit?: boolean
}

export function CreditCard({ key, creditCard, edit = false }: CreditCardProps) {
  return (
    <div
      key={key}
      className={cn(
        'flex min-h-48 w-full max-w-[400px] flex-col justify-between rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-5',
        {
          'from-purple-900 to-purple-950':
            creditCard.cardName.includes('Nubank'),
          'from-orange-500 to-orange-600':
            creditCard.cardName.includes('Inter') ||
            creditCard.cardName.includes('Itaú'),
          'from-red-600 to-red-700':
            creditCard.cardName.includes('Santander') ||
            creditCard.cardName.includes('Bradesco'),
          'from-blue-600 to-blue-800': creditCard.cardName.includes('Caixa'),
        }
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">{creditCard.cardName}</h3>
        {edit && (
          <Link
            href={`/credit-card/${creditCard.id}`}
            className="flex items-center gap-2 text-xs text-white"
          >
            Editar
            <NotePencil size={20} weight="fill" className="text-white" />
          </Link>
        )}
      </div>

      <div className="my-6 text-white">
        <p className="text-end text-lg tracking-widest sm:text-2xl">
          **** **** **** {creditCard.lastDigits || '****'}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-200 sm:text-sm">
          <p>
            Dia de fechamento:{' '}
            <span className="ml-2 font-semibold">{creditCard.closingDay}</span>
          </p>
          <p>
            Vencimento da fatura:{' '}
            <span className="ml-2 font-semibold">{creditCard.dueDay}</span>
          </p>
          <p>
            Limite:
            <span className="ml-2 font-semibold">R$: {creditCard.limit}</span>
          </p>
        </div>
        <div>
          <Button
            variant="secondary"
            className="rounded-lg bg-secondary/30 p-2 text-xs hover:bg-secondary/20"
          >
            Ver fatura
          </Button>
        </div>
      </div>
    </div>
  )
}
