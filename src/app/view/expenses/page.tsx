'use client'

import axiosInstance from '@/api/axiosInstance'
import { Expense } from '@/app/common/interfaces/expenses'
import { AlertDelete } from '@/components/AlertDialog'
import { EditDialog } from '@/components/EditDialog'
import { formatDate, formatNumberToCurrency } from '@/lib/useful'
import { useEffect, useState } from 'react'

export default function ViewExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    async function fetchExpenses() {
      const { data: expenses } = await axiosInstance.get('/expense')
      setExpenses(expenses)
    }
    fetchExpenses()
  }, [])

  return (
    <div className="flex w-full flex-col bg-white">
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
              <p className="poppins-semibold text-sm text-gray-900">
                {formatNumberToCurrency(expense.amount)}
              </p>
              <p className="poppins-regular text-xs text-gray-400">
                {formatDate(`${expense.dueDate}`)}
              </p>
            </div>
            <div className="flex w-1/6 justify-center gap-3">
              <EditDialog />
              <AlertDelete id={expense.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
