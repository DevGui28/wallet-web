import { Installments } from "@/types/installments";
import clsx from "clsx";

export default function RowInstallments({
  installments,
}: {
  installments: Installments[];
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center">
        <p className="p-2"
          style={{ width: "200px" }}>Descrição</p>
        <p className="p-2"
          style={{ width: "200px" }}>Valor</p>
        <p className="p-2"
          style={{ width: "200px" }}>Parcela</p>
      </div>
      {installments.map((installment, index) => (
        <div key={installment.id} className={clsx(
          "flex flex-row items-center cursor-pointer",
          {
            "bg-gray-100": index % 2 === 0,
          },
        )}>
          <p
            className="p-2"
            style={{ width: "200px" }}
          >{installment.expense.description}</p>
          <p className="p-2"
            style={{ width: "200px" }}>{installment.amount}</p>
          <p className="p-2"
            style={{ width: "200px" }}>
            {installment.currentInstallment}/{installment.expense.recurring}
          </p>
        </div>
      ))}
    </div>
  );
}
