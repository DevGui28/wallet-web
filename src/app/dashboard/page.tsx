'use client'

import RowInstallments from '@/components/RowInstallments'
import { useInstallments } from '@/hooks/useInstallments'
import {
  calculateTotal,
  filterInstallments,
  months,
  welcomePerson,
} from '@/lib/utils'
import { withAuth } from '@/lib/with-auth'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

function Dashboard() {
  const {
    installments,
    filteredInstallments,
    setFilteredInstallments,
    salaries,
  } = useInstallments()

  const [monthCurrent, setMonthCurrent] = useState(
    months[new Date().getMonth()]
  )

  useEffect(() => {
    setFilteredInstallments(filterInstallments(installments, monthCurrent))
  }, [monthCurrent])

  return (
    <>
      <div className="-mt-0.5 flex flex-col items-center bg-blue-600 pb-5">
        <div className="flex w-full flex-col p-5">
          <h1 className="poppins-bold text-gray-900">
            Ei, Bem vindo(a) devolta!
          </h1>
          <p className="-mt-1.5 text-sm font-medium text-gray-900">
            {welcomePerson(new Date())}
          </p>
        </div>
        <div className="flex w-4/5 items-center justify-around bg-blue-600 text-gray-900">
          <div className="flex w-2/5 flex-col">
            <p className="poppins-regular text-xs">Total de Salários</p>
            <p className="poppins-extrabold text-xl text-gray-100">
              {calculateTotal(salaries)}
            </p>
          </div>
          <div className="h-10 w-px bg-gray-100" />
          <div className="flex w-2/5 flex-col items-end">
            <p className="poppins-regular text-xs">Total de Despesas</p>
            <p className="poppins-extrabold text-xl text-gray-100">
              {calculateTotal(installments)}
            </p>
          </div>
        </div>
        <div className="mt-3 flex w-full items-center justify-center">
          <p className="pr-2 text-right">Filtrar por mês:</p>
          <select
            name="month"
            id="month"
            onChange={(e) => setMonthCurrent(e.target.value)}
            value={monthCurrent}
          >
            {months.map((month) => (
              <option
                key={month}
                value={month}
                className={clsx(
                  'm-1 cursor-pointer rounded-md border border-gray-300 p-2',
                  {
                    'bg-gray-300': month === monthCurrent,
                  }
                )}
                onClick={() => setMonthCurrent(month)}
              >
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <RowInstallments installments={filteredInstallments} />
    </>
  )
}

export default withAuth(Dashboard)
