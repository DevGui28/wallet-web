'use client'

import { useState } from 'react'
import { FunnelSimple, X } from '@phosphor-icons/react'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { CustomSelect } from '../../shared/CustomSelect'
import {
  TransactionFilters,
  TransactionType,
} from '../../../types/transactions.interface'
import { getMonth, getYear } from 'date-fns'
import { CalendarBlank } from '@phosphor-icons/react'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { formatDateToString } from '../../../lib/utils'

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
  const [dateFilter, setDateFilter] = useState<Date | undefined>(
    search.date ? new Date(search.date) : undefined
  )
  const [currentMonth, setCurrentMonth] = useState<number>(
    dateFilter ? getMonth(dateFilter) : getMonth(new Date())
  )
  const [currentYear, setCurrentYear] = useState<number>(
    dateFilter ? getYear(dateFilter) : getYear(new Date())
  )

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
    setDateFilter(undefined)
  }

  const activeFiltersCount = Object.keys(search).reduce((count, key) => {
    const k = key as keyof TransactionFilters
    if (k === 'type' && search[k] === 'ALL') return count
    if (k === 'paymentMethod' && search[k] === 'ALL') return count
    if (search[k]) return count + 1
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 3xl:grid-cols-5">
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
            <div className="flex max-h-[70px] flex-col gap-2">
              <span className="text-sm font-medium">Data</span>
              <div className="relative">
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex w-full items-center justify-between pl-3 text-left font-normal"
                    >
                      {dateFilter ? (
                        formatDateToString(dateFilter, 'MMMM yyyy')
                      ) : (
                        <span>Selecione mês/ano</span>
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
                        <h4 className="font-medium">Selecione mês e ano</h4>
                        {dateFilter && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => {
                              setDateFilter(undefined)
                              const newSearch = { ...search }
                              delete newSearch.date
                              setSearch(newSearch)
                            }}
                          >
                            Limpar
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium">Mês</label>
                          <Select
                            value={String(currentMonth)}
                            onValueChange={(value) => {
                              const month = parseInt(value)
                              setCurrentMonth(month)
                              const year =
                                currentYear || new Date().getFullYear()
                              const updatedDate = new Date(year, month)
                              setDateFilter(updatedDate)
                              setSearch({
                                ...search,
                                date: updatedDate.toISOString(),
                              })
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione o mês" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Janeiro</SelectItem>
                              <SelectItem value="1">Fevereiro</SelectItem>
                              <SelectItem value="2">Março</SelectItem>
                              <SelectItem value="3">Abril</SelectItem>
                              <SelectItem value="4">Maio</SelectItem>
                              <SelectItem value="5">Junho</SelectItem>
                              <SelectItem value="6">Julho</SelectItem>
                              <SelectItem value="7">Agosto</SelectItem>
                              <SelectItem value="8">Setembro</SelectItem>
                              <SelectItem value="9">Outubro</SelectItem>
                              <SelectItem value="10">Novembro</SelectItem>
                              <SelectItem value="11">Dezembro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs font-medium">Ano</label>
                          <Select
                            value={String(currentYear)}
                            onValueChange={(value) => {
                              const year = parseInt(value)
                              setCurrentYear(year)
                              const month =
                                currentMonth || new Date().getMonth()
                              const updatedDate = new Date(year, month)
                              setDateFilter(updatedDate)
                              setSearch({
                                ...search,
                                date: updatedDate.toISOString(),
                              })
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione o ano" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() - i
                                return (
                                  <SelectItem key={year} value={String(year)}>
                                    {year}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
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
