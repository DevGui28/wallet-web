"use client";

import RowInstallments from "@/components/RowInstallments";
import { InstallmentsContext } from "@/context/InstallmentsContext";
import { months } from "@/utils/dashboard";
import clsx from "clsx";
import { useContext, useEffect, useState } from "react";

export default function Dashboard() {
  const {
    installments,
    isLoading,
    filteredInstallments,
    setFilteredInstallments,
  } = useContext(InstallmentsContext);

  const [monthCurrent, setMonthCurrent] = useState(
    months[new Date().getMonth()],
  );

  const handleFilter = (month: string, installments: any) => {
    const installmentsFilter = installments.filter((installment: any) => {
      const date = new Date(installment.dueDate);
      return months[date.getMonth() + 1] === month;
    });
    setFilteredInstallments(installmentsFilter);
    setMonthCurrent(month);
  };

  useEffect(() => {
    handleFilter(monthCurrent, installments);
    if (monthCurrent === "Todos") {
      setFilteredInstallments(installments);
    }
  }, [monthCurrent]);

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <div className="flex flex-col items-center">
      <select name="month" id="month"
      onChange={(e) => setMonthCurrent(e.target.value)}
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
      <RowInstallments installments={filteredInstallments} />
      </div>
  );
}
