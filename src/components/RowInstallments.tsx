import { Installments } from "@/types/installments";
import clsx from "clsx";

export default function RowInstallments({
  installments,
}: {
  installments: Installments[];
}) {
  return (
    <div className="flex flex-col items-center w-[100vw]">
      <div className="grid grid-cols-3 items-center w-[100%]">
        <p className="p-2 text-center">Descrição</p>
        <p className="p-2 text-center">Valor</p>
        <p className="p-2 text-center">Parcela</p>
      </div>
      {installments.map((installment, index) => (
        <div
          key={installment.id}
          className={clsx("grid grid-cols-3 cursor-pointer items-center w-[100%]", {
            "bg-gray-100": index % 2 === 0,
          })}
        >
          <p className="p-2 text-center">{installment.expense.description}</p>
          <p className="p-2 text-center">{installment.amount}</p>
          <p className="p-2 text-center">{
            installment.isRecurring
              ? "Recorrente"
              : `${installment.currentInstallment}/${installment.expense.recurring}`
            }
          </p>
        </div>
      ))}
    </div>
  );
}
