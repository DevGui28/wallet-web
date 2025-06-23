'use client'

import { useState, useEffect } from 'react'
import { FunnelSimple, X } from '@phosphor-icons/react'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { CustomSelect } from '../../shared/CustomSelect'
import {
  TransactionFilters,
  TransactionType,
} from '../../../types/transactions.interface'
import { differenceInDays, format } from 'date-fns'
import { CalendarBlank } from '@phosphor-icons/react'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Calendar } from '../../ui/calendar'

interface TransactionsFilterProps {
  search: TransactionFilters
  setSearch: (filters: TransactionFilters) => void
  categories: { label: string; value: string }[]
  creditCards: { label: string; value: string }[]
}

export default function TransactionsFilter({
  search,
  setSearch,
  categories,
  creditCards,
}: TransactionsFilterProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    search.startDate ? new Date(search.startDate) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    search.endDate ? new Date(search.endDate) : undefined
  )
  const [dateError, setDateError] = useState<string | null>(null)

  const transactionTypes = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Receitas', value: TransactionType.INCOME },
    { label: 'Despesas', value: TransactionType.EXPENSE },
    { label: 'Investimentos', value: TransactionType.INVESTMENT },
  ]

  const paymentMethods = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Boleto', value: 'BANK_SLIP' },
    { label: 'Cartão de Crédito', value: 'CREDIT_CARD' },
    { label: 'Cartão de Débito', value: 'DEBIT_CARD' },
    { label: 'Dinheiro', value: 'CASH' },
    { label: 'Pix', value: 'PIX' },
    { label: 'Transferência', value: 'BANK_TRANSFER' },
    { label: 'Outro', value: 'OTHER' },
  ]

  const clearFilters = () => {
    setSearch({} as TransactionFilters)
    setStartDate(undefined)
    setEndDate(undefined)
    setDateError(null)
  }

  const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
    setDateError(null)

    if (start && end) {
      // Verificar se o período é maior que 60 dias
      const diffDays = Math.abs(differenceInDays(end, start))
      if (diffDays > 60) {
        setDateError('O período máximo é de 60 dias')
        return
      }

      setSearch({
        ...search,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      })
    } else if (!start && !end) {
      const newSearch = { ...search }
      delete newSearch.startDate
      delete newSearch.endDate
      setSearch(newSearch)
    }
  }

  useEffect(() => {
    if (startDate && endDate) {
      handleDateChange(startDate, endDate)
    }
  }, [startDate, endDate])

  const activeFiltersCount = Object.keys(search).reduce((count, key) => {
    const k = key as keyof TransactionFilters
    if (k === 'type' && search[k] === 'ALL') return count
    if (k === 'paymentMethod' && search[k] === 'ALL') return count
    if (
      (k === 'startDate' || k === 'endDate') &&
      search.startDate &&
      search.endDate
    ) {
      // Contar apenas uma vez para o filtro de data (quando ambos estão presentes)
      return k === 'startDate' ? count + 1 : count
    }
    if (search[k] && k !== 'endDate') return count + 1
    return count
  }, 0)

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FunnelSimple className="h-5 w-5" />
            <h3 className="font-medium">Filtros</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={clearFilters}
            >
              <X className="mr-1 h-4 w-4" />
              Limpar filtros
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
          <div>
            <CustomSelect
              label="Tipo"
              placeholder="Todos os tipos"
              options={transactionTypes}
              value={search.type || 'ALL'}
              onChange={(value) =>
                setSearch({ ...search, type: value as TransactionType })
              }
            />
          </div>

          {/* {search.type !== 'ALL' && search.type !== undefined && ( */}
          <div>
            <CustomSelect
              label="Categoria"
              placeholder="Todas as categorias"
              options={categories || []}
              value={search.categoryId || null}
              onChange={(value) => setSearch({ ...search, categoryId: value })}
            />
          </div>
          {/* )} */}

          <div>
            <CustomSelect
              label="Método de pagamento"
              placeholder="Todos os métodos"
              options={paymentMethods}
              value={search.paymentMethod || 'ALL'}
              onChange={(value) => {
                const newSearch = { ...search, paymentMethod: value }
                if (value !== 'CREDIT_CARD') {
                  delete newSearch.creditCardId
                }
                setSearch(newSearch)
              }}
            />
          </div>

          {search.paymentMethod === 'CREDIT_CARD' && (
            <div>
              <CustomSelect
                label="Cartão de crédito"
                placeholder="Todos os cartões"
                options={creditCards}
                value={search.creditCardId || null}
                onChange={(value) =>
                  setSearch({ ...search, creditCardId: value })
                }
              />
            </div>
          )}

          <div className="flex flex-col justify-end">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Período</span>
              <div className="relative">
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex w-full items-center justify-between pl-3 text-left font-normal"
                    >
                      {startDate && endDate ? (
                        <span>
                          {format(startDate, 'dd/MM/yyyy')} -{' '}
                          {format(endDate, 'dd/MM/yyyy')}
                        </span>
                      ) : (
                        <span>Selecione o período</span>
                      )}
                      <CalendarBlank
                        weight="bold"
                        className="ml-auto h-4 w-4 opacity-50"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-3"
                    align="start"
                    side="bottom"
                  >
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Selecione o período</h4>
                        {(startDate || endDate) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => {
                              setStartDate(undefined)
                              setEndDate(undefined)
                              setDateError(null)
                              const newSearch = { ...search }
                              delete newSearch.startDate
                              delete newSearch.endDate
                              setSearch(newSearch)
                            }}
                          >
                            Limpar
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-xs font-medium">
                            Data inicial
                          </label>
                          <div className="mt-1">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={(date) => {
                                setStartDate(date)
                                // Verificar se a data final existe
                                if (date && endDate) {
                                  // Se a diferença entre as datas for maior que 60 dias, limpa a data final
                                  const diffDays = Math.abs(
                                    differenceInDays(date, endDate as Date)
                                  )
                                  if (diffDays > 60) {
                                    setEndDate(undefined)
                                  }
                                }
                              }}
                              disabled={() => false}
                              initialFocus
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium">
                            Data final
                          </label>
                          <div className="mt-1">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              disabled={(date) => {
                                if (startDate) {
                                  // Verificar apenas o limite de 60 dias
                                  const diffDays = differenceInDays(
                                    date,
                                    startDate
                                  )
                                  return Math.abs(diffDays) > 60
                                }
                                return false
                              }}
                              initialFocus
                            />
                          </div>
                        </div>

                        {dateError && (
                          <div className="text-sm font-medium text-red-500">
                            {dateError}
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
