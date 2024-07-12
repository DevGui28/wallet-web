import { Installments } from '@/app/common/interfaces/installments'
import clsx from 'clsx'

export default function RowInstallments({
  installments,
}: {
  installments: Installments[]
}) {
  return (
    <div className="flex w-screen flex-col items-center">
      <div className="grid w-full grid-cols-3 items-center">
        <p className="p-2 text-center">Descrição</p>
        <p className="p-2 text-center">Valor</p>
        <p className="p-2 text-center">Parcela</p>
      </div>
      {installments.map((installment, index) => (
        <div
          key={installment.id}
          className={clsx(
            'grid w-screen cursor-pointer grid-cols-3 items-center',
            {
              'bg-gray-100': index % 2 === 0,
            }
          )}
        >
          <p className="p-2 text-center">{installment.expense.description}</p>
          <p className="p-2 text-center">{installment.amount}</p>
          <p className="p-2 text-center">
            {installment.isRecurring
              ? 'Recorrente'
              : `${installment.currentInstallment}/${installment.expense.recurring}`}
          </p>
        </div>
      ))}
    </div>
  )
}
