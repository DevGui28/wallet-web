'use client'

import { Salaries } from '@/app/common/interfaces/salaries'
import { DeleteSalaryDialog } from '@/components/DeleteSalaryDialog'
import Loading from '@/components/LoadingGlobal'
import { handleGetSalaries } from '@/lib/requests'
import { formatNumberToCurrency, formatSalarieDate } from '@/lib/useful'
import Link from 'next/link'
import { useQuery } from 'react-query'

export default function ViewSalariesPage() {
  const { data: salaries, isLoading } = useQuery({
    queryKey: ['salary'],
    queryFn: handleGetSalaries,
  })

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex w-full flex-col">
      <div className="m-auto mb-20 mt-2 flex w-[90vw] flex-col rounded-md bg-white">
        <p className="m-auto my-4 text-lg font-semibold">Salários</p>
        {salaries.length === 0 && (
          <>
            <p className="m-auto my-6 text-lg font-semibold text-gray-400">
              Nenhum salário cadastrado
            </p>
            <Link
              href="/new/salary"
              className="m-auto mb-6 rounded-lg bg-green-600 p-2 text-white hover:bg-green-800"
            >
              Cadastre um salário
            </Link>
          </>
        )}
        {salaries.length !== 0 &&
          salaries.map((salary: Salaries) => (
            <div key={salary.id} className="flex">
              <div className="flex w-full items-center justify-between border-b border-gray-100 p-4">
                <div className="flex w-2/5 flex-col">
                  <p className="poppins-semibold text-sm text-gray-900">
                    {salary.description}
                  </p>
                  <p className="poppins-semibold text-xs text-gray-400">
                    {formatSalarieDate(`${salary.month}`)}
                  </p>
                </div>
                <div className="flex w-2/5 flex-col">
                  <p className="text-md font-extrabold text-green-600">
                    {formatNumberToCurrency(salary.amount)}
                  </p>
                </div>
                <div className="flex w-1/6 justify-center gap-3">
                  <DeleteSalaryDialog id={salary.id} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
