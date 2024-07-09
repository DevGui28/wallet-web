import { Installments } from "@/types/installments";
import { Salaries } from "@/types/salaries";

export const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const calculateTotalExpenses = (installments: Installments[]) => {
  return installments.reduce((acc, installment) => acc + installment.amount, 0).toFixed(2);
}

export const calculateTotalIncomes = (salaries: Salaries[]) => {
  return salaries.reduce((acc, salary) => acc + salary.amount, 0).toFixed(2);
}