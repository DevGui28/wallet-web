'use client';

import axiosInstance from "@/api/axiosInstance";
import BasicTable from "@/components/TableInstallments";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [installments, setInstallments] = useState();

  useEffect(() => {
    async function fetchInstallments() {
      const {data} = await axiosInstance.get("/installments");
      setInstallments(data);
    }
    fetchInstallments();
  }, []);

  if (!installments) {
    return <h1>Loading</h1>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <BasicTable installments={installments} />
    </div>
  );
}
