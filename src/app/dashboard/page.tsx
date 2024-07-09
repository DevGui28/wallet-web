"use client";

import RowInstallments from "@/components/RowInstallments";
import { InstallmentsContext } from "@/context/InstallmentsContext";
import { Installments } from "@/types/installments";
import {
  calculateTotalExpenses,
  calculateTotalIncomes,
  months,
} from "@/utils/dashboard";
import { filterInstallments } from "@/utils/filterInstallments";
import clsx from "clsx";
import { useContext, useEffect, useState } from "react";

export default function Dashboard() {
  const {
    installments,
    isLoading,
    filteredInstallments,
    setFilteredInstallments,
    salaries,
  } = useContext(InstallmentsContext);

  const [monthCurrent, setMonthCurrent] = useState(
    months[new Date().getMonth()],
  );

  useEffect(() => {
    setFilteredInstallments(
      filterInstallments(installments, monthCurrent),
    );
  }, [monthCurrent]);

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <div className="flex flex-col items-center">
      <p className="w-[100%] bg-green-700 py-3 text-center text-green-400">
        Total de Receitas
        <span className="ml-2 font-bold">
          R$:{calculateTotalIncomes(salaries)}
        </span>
      </p>
      <p className="w-[100%] bg-red-700 py-3 text-center text-red-400">
        Total de Despesas
        <span className="ml-2 font-bold">
          R$:{calculateTotalExpenses(filteredInstallments)}
        </span>
      </p>
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
                "p-2",
                "border",
                "border-gray-300",
                "rounded-md",
                "m-1",
                "cursor-pointer",
                {
                  "bg-gray-300": month === monthCurrent,
                },
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
  );
}
