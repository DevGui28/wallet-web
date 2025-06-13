'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from '@phosphor-icons/react'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { handleCreateCreditCard, handleGetCreditCards } from '../../../api'
import { Button } from '../../ui/button'
import { CreditCard } from './CreditCardList'
import { AddCreditCardDialog } from './AddCreditCardDialog'

export default function CreditCardListNew() {
  const [openAddCardDialog, setOpenAddCardDialog] = useState(false)
  const queryClient = useQueryClient()

  const { data: creditCards, isLoading } = useQuery({
    queryKey: ['credit-cards-detail'],
    queryFn: handleGetCreditCards,
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-xl">Cartões de Crédito</CardTitle>
          <Button
            variant="default"
            size="sm"
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
            onClick={() => setOpenAddCardDialog(true)}
          >
            <Plus className="h-5 w-5" />
            Adicionar cartão
          </Button>

          <AddCreditCardDialog
            open={openAddCardDialog}
            setOpen={setOpenAddCardDialog}
            onAddCreditCard={async (data) => {
              try {
                await handleCreateCreditCard(data)
                queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
                queryClient.invalidateQueries({
                  queryKey: ['credit-cards-detail'],
                })
                return Promise.resolve()
              } catch (error) {
                return Promise.reject(error)
              }
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-wrap justify-center gap-4">
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-40 w-full animate-pulse rounded-lg bg-muted sm:w-80 md:w-96"
              ></div>
            ))}
          {!!creditCards?.length &&
            creditCards.map((creditCard) => (
              <div key={creditCard.id} className="w-full sm:w-auto">
                <CreditCard creditCard={creditCard} edit={true} />
              </div>
            ))}
          {!creditCards?.length && !isLoading && (
            <div className="flex h-40 w-full items-center justify-center rounded-lg bg-card shadow-sm">
              <p className="text-base font-semibold text-muted-foreground sm:text-lg">
                Nenhum cartão de crédito cadastrado
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
