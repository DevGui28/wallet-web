'use client'

import { Expense } from '@/app/common/interfaces/expenses'
import { DeleteExpenseDialog } from '@/components/DeleteExpenseDialog'
import Loading from '@/components/LoadingGlobal'
import { handleGetExpenses } from '@/lib/requests'
import { formatDate, formatNumberToCurrency } from '@/lib/useful'
import Link from 'next/link'
import { useQuery } from 'react-query'

export default function ViewExpensesPage() {
  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expense'],
    queryFn: handleGetExpenses,
  })

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex w-full flex-col">
      <div className="m-auto mb-20 mt-2 flex w-[90vw] flex-col rounded-md bg-white">
        <p className="m-auto my-4 text-lg font-semibold">Despesas</p>
        {expenses.length === 0 && (
          <>
            <p className="m-auto my-6 text-lg font-semibold text-gray-400">
              Nenhuma despesa cadastrada
            </p>
            <Link
              href="/new/expense"
              className="m-auto mb-6 rounded-lg bg-red-600 p-2 text-white hover:bg-red-800"
            >
              Cadastre uma despesa
            </Link>
          </>
        )}
        {expenses.map((expense: Expense) => (
          <div key={expense.id} className="flex">
            <div className="flex w-full items-center justify-between border-b border-gray-100 p-4">
              <div className="flex w-2/5 flex-col">
                <p className="poppins-semibold text-sm text-gray-900">
                  {expense.description}
                </p>
                <p className="poppins-regular text-xs text-gray-400">
                  {expense.category.name}
                </p>
              </div>
              <div className="flex w-2/5 flex-col">
                <p className="text-md font-extrabold text-red-600">
                  -{formatNumberToCurrency(expense.amount)}
                </p>
                <p className="poppins-regular text-xs text-gray-400">
                  {formatDate(`${expense.dueDate}`)}
                </p>
              </div>
              <div className="flex w-1/6 justify-center gap-3">
                <DeleteExpenseDialog id={expense.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
