"use client";

import axiosInstance from "@/api/axiosInstance";
import { Installments } from "@/app/common/interfaces/installments";
import { Salaries } from "@/app/common/interfaces/salaries";
import { months, filterInstallments } from "@/lib/utils";
import { redirect, usePathname } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

interface MyContextProps {
  installments: Installments[];
  filteredInstallments: Installments[];
  setFilteredInstallments: React.Dispatch<React.SetStateAction<Installments[]>>;
  salaries: Salaries[];
}

const InstallmentsContext = createContext<MyContextProps>({} as MyContextProps);

const InstallmentsProvider = ({ children }: { children: React.ReactNode }) => {
  const [installments, setInstallments] = useState<Installments[]>([]);
  const [filteredInstallments, setFilteredInstallments] =
    useState(installments);
  const [salaries, setSalaries] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/login" || pathname === "/register") {
      return;
    }
    async function fetch() {
      try {
        const installments = await axiosInstance.get("/installments");
        const salary = await axiosInstance.get("/salary");
        setInstallments(installments.data);
        setFilteredInstallments(
          filterInstallments(
            installments.data,
            months[new Date().getMonth()],
          ),
        );
        setSalaries(salary.data);
      } catch (error: any) {
        if (error.response.data.statusCode === 401) {
          redirect("/login");
        }        
      }
    }

    fetch();
  }, [pathname]);

  return (
    <InstallmentsContext.Provider
      value={{
        installments,
        filteredInstallments,
        setFilteredInstallments,
        salaries,
      }}
    >
      {children}
    </InstallmentsContext.Provider>
  );
};

export { InstallmentsContext, InstallmentsProvider };
