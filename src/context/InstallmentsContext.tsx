'use client'

import axiosInstance from '@/api/axiosInstance'
import { Category } from '@/app/common/interfaces/categories'
import { Installments } from '@/app/common/interfaces/installments'
import { Salaries } from '@/app/common/interfaces/salaries'
import { handleGetInstallments, handleGetSalaries } from '@/lib/requests'
import { filterInstallments, filterSalaries, months } from '@/lib/useful'
import { redirect, usePathname } from 'next/navigation'
import React, { createContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'

interface MyContextProps {
  installments: Installments[]
  filteredInstallments: Installments[]
  setFilteredInstallments: React.Dispatch<React.SetStateAction<Installments[]>>
  salaries: Salaries[]
  filteredSalaries: Salaries[]
  setFilteredSalaries: React.Dispatch<React.SetStateAction<Salaries[]>>
  setMonthCurrent: React.Dispatch<React.SetStateAction<string>>
  monthCurrent: string
  categories: Category[]
  setYearCurrent: React.Dispatch<React.SetStateAction<number>>
  yearCurrent: number
}

const InstallmentsContext = createContext<MyContextProps>({} as MyContextProps)

const InstallmentsProvider = ({ children }: { children: React.ReactNode }) => {
  const [installments, setInstallments] = useState<Installments[]>([])
  const [filteredInstallments, setFilteredInstallments] = useState(installments)
  const [filteredSalaries, setFilteredSalaries] = useState<Salaries[]>([])
  const [monthCurrent, setMonthCurrent] = useState(
    months[new Date().getMonth()]
  )
  const [yearCurrent, setYearCurrent] = useState(new Date().getFullYear())
  const [salaries, setSalaries] = useState([])
  const [categories, setCategories] = useState([])
  const pathname = usePathname()

  const { data: installmentsData, isLoading: loadingInstallments } = useQuery({
    queryKey: ['installments'],
    queryFn: handleGetInstallments,
  })

  const { data: salariesData, isLoading: loadingSalaries } = useQuery({
    queryKey: ['salaries'],
    queryFn: handleGetSalaries,
  })

  useEffect(() => {
    if (pathname === '/login' || pathname === '/register') {
      return
    }

    async function fetch() {
      if (loadingInstallments || loadingSalaries) {
        return
      }

      try {
        const category = await axiosInstance.get('/category')
        setInstallments(installmentsData)
        setFilteredInstallments(
          filterInstallments(
            installmentsData,
            months[new Date().getMonth()],
            yearCurrent
          )
        )
        setFilteredSalaries(
          filterSalaries(salariesData, months[new Date().getMonth()])
        )
        setCategories(category.data)
        setSalaries(salariesData)
      } catch (error: any) {
        if (error.response?.data.statusCode === 401) {
          redirect('/auth')
        }
      }
    }

    fetch()
  }, [installmentsData, salariesData])

  return (
    <InstallmentsContext.Provider
      value={{
        installments,
        filteredInstallments,
        setFilteredInstallments,
        salaries,
        setMonthCurrent,
        monthCurrent,
        categories,
        filteredSalaries,
        setFilteredSalaries,
        setYearCurrent,
        yearCurrent,
      }}
    >
      {children}
    </InstallmentsContext.Provider>
  )
}

export { InstallmentsContext, InstallmentsProvider }
