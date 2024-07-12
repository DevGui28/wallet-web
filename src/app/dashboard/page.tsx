'use client'

import TableExpenses from '@/components/TableExpenses'
import RadialChart from '@/components/ui/RadialChart'
import { useInstallments } from '@/hooks/useInstallments'
import { calculateTotal, filterInstallments } from '@/lib/useful'
import { withAuth } from '@/lib/with-auth'
import { useEffect } from 'react'

function Dashboard() {
  const {
    installments,
    setFilteredInstallments,
    filteredInstallments,
    salaries,
    monthCurrent,
  } = useInstallments()

  const totalSalaries = calculateTotal(salaries)
  const totalInstallments = calculateTotal(filteredInstallments)

  useEffect(() => {
    setFilteredInstallments(filterInstallments(installments, monthCurrent))
  }, [monthCurrent])

  return (
    <>
      <div className="-mt-0.5 flex flex-col items-center bg-blue-600 pb-24">
        <div className="my-3 flex w-4/5 max-w-[300px] items-center justify-around bg-blue-600 text-gray-900">
          <div className="flex w-2/5 flex-col">
            <p className="poppins-regular text-xs">Total de Salários</p>
            <p className="poppins-extrabold text-xl text-green-300">
              {totalSalaries}
            </p>
          </div>
          <div className="h-10 w-px bg-gray-100" />
          <div className="flex w-2/5 flex-col items-end">
            <p className="poppins-regular text-xs">Total de Despesas</p>
            <p className="poppins-extrabold text-xl text-red-300">
              {totalInstallments}
            </p>
          </div>
        </div>
        <RadialChart
          totalInstallments={totalInstallments}
          totalSalaries={totalSalaries}
          monthCurrent={monthCurrent}
        />
      </div>
      <TableExpenses />
    </>
  )
}

export default withAuth(Dashboard)
