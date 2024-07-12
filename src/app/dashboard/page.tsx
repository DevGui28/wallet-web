'use client'

import { useInstallments } from '@/hooks/useInstallments'
import {
  calculateTotal,
  filterInstallments,
  formatDate,
  months,
  welcomePerson,
} from '@/lib/utils'
import { withAuth } from '@/lib/with-auth'
import { useEffect, useState } from 'react'

function Dashboard() {
  const { installments, setFilteredInstallments, salaries } = useInstallments()

  const [monthCurrent, setMonthCurrent] = useState(
    months[new Date().getMonth()]
  )

  useEffect(() => {
    setFilteredInstallments(filterInstallments(installments, monthCurrent))
  }, [monthCurrent])

  return (
    <>
      <div className="-mt-0.5 flex flex-col items-center bg-blue-600 pb-24">
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
            <p className="poppins-extrabold text-xl text-gray-300">
              {calculateTotal(salaries)}
            </p>
          </div>
          <div className="h-10 w-px bg-gray-100" />
          <div className="flex w-2/5 flex-col items-end">
            <p className="poppins-regular text-xs">Total de Despesas</p>
            <p className="poppins-extrabold text-xl text-gray-300">
              {calculateTotal(installments)}
            </p>
          </div>
        </div>
      </div>
      <div className="-mt-16 flex min-h-full flex-col items-center rounded-t-[4rem] bg-gray-100">
        <div className="mt-5 flex w-4/5 items-center justify-between p-5">
          <h1 className="poppins-bold text-gray-900">Despesas</h1>
          <select
            value={monthCurrent}
            onChange={(e) => setMonthCurrent(e.target.value)}
            className="poppins-regular rounded-md border-2 border-gray-300 bg-gray-100 px-2 py-1 text-gray-900"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-4/5 flex-col items-center rounded-lg bg-white">
          {installments.length > 0 ? (
            installments.map((installment) => (
              <div
                key={installment.id}
                className="flex w-full items-center justify-between border-b border-gray-100 p-5"
              >
                <div className="flex flex-col">
                  <p className="poppins-semibold text-gray-900">
                    {installment.expense.category.name}
                  </p>
                  <p className="poppins-regular text-sm text-gray-400">
                    {installment.expense.description}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="poppins-bold text-gray-900">
                    R${installment.amount.toFixed(2)}
                  </p>
                  <p className="poppins-regular text-right text-xs text-gray-400">
                    {installment.isRecurring
                      ? 'Recorrente'
                      : formatDate(installment.dueDate)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex w-full items-center justify-center p-5">
              <p className="poppins-bold text-gray-900">
                Nenhuma despesa encontrada
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default withAuth(Dashboard)
