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
import { Divider } from '@mui/material'
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
    <div className="flex flex-col items-center">
      <div className="flex w-full flex-col items-center bg-[#15d1d1] py-5">
        <h1 className="font-bold uppercase text-white opacity-70">
          Olá!! {welcomePerson(new Date())}
        </h1>
      </div>
      <div className="flex w-full items-center justify-center bg-[#15d1d1]">
        <div className="flex w-2/5 flex-col">
          <p className="text-xs">Total de Salários</p>
          <p className="text-lg font-bold">{calculateTotal(salaries)}</p>
        </div>
        <Divider className="text-white" orientation="vertical" flexItem />
        <div className="flex w-2/5 flex-col items-end">
          <p className="text-xs">Total de Despesas</p>
          <p className="text-lg font-bold">{calculateTotal(installments)}</p>
        </div>
      </div>
      <div className="mt-3 flex w-[100%] items-center justify-center">
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
      <RowInstallments installments={filteredInstallments} />
    </div>
  )
}

export default withAuth(Dashboard)
