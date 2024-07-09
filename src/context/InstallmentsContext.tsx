"use client";

import axiosInstance from "@/api/axiosInstance";
import { Installments } from "@/types/installments";
import { Salaries } from "@/types/salaries";
import { months } from "@/utils/dashboard";
import { filterInstallments } from "@/utils/filterInstallments";
import React, { createContext, useEffect, useState } from "react";

interface MyContextProps {
  installments: Installments[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  filteredInstallments: Installments[];
  setFilteredInstallments: React.Dispatch<React.SetStateAction<Installments[]>>;
  salaries: Salaries[];
}

const InstallmentsContext = createContext<MyContextProps>({
  installments: [],
  isLoading: true,
  setIsLoading: () => {},
  filteredInstallments: [],
  setFilteredInstallments: () => {},
  salaries: [],
});

const InstallmentsProvider = ({ children }: { children: React.ReactNode }) => {
  const [installments, setInstallments] = useState<Installments[]>([]);
  const [filteredInstallments, setFilteredInstallments] =
    useState(installments);
  const [isLoading, setIsLoading] = useState(true);
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
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
      setIsLoading(false);
    }

    fetch();
  }, []);

  return (
    <InstallmentsContext.Provider
      value={{
        installments,
        isLoading,
        setIsLoading,
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
