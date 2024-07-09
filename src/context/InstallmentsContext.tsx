"use client";

import axiosInstance from "@/api/axiosInstance";
import { Installments } from "@/types/installments";
import React, { createContext, useEffect, useState } from "react";

interface MyContextProps {
  installments: Installments[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  filteredInstallments: Installments[];
  setFilteredInstallments: React.Dispatch<React.SetStateAction<Installments[]>>;
}

const InstallmentsContext = createContext<MyContextProps>({
  installments: [],
  isLoading: true,
  setIsLoading: () => {},
  filteredInstallments: [],
  setFilteredInstallments: () => {},
});

const InstallmentsProvider = ({ children }: { children: React.ReactNode }) => {
  const [installments, setInstallments] = useState<Installments[]>([]);
  const [filteredInstallments, setFilteredInstallments] =
    useState(installments);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInstallments() {
      setIsLoading(true);
      const { data } = await axiosInstance.get("/installments");
      setInstallments(data);
      setIsLoading(false);
    }
    fetchInstallments();
  }, []);

  return (
    <InstallmentsContext.Provider
      value={{
        installments,
        isLoading,
        setIsLoading,
        filteredInstallments,
        setFilteredInstallments,
      }}
    >
      {children}
    </InstallmentsContext.Provider>
  );
};

export { InstallmentsContext, InstallmentsProvider };
