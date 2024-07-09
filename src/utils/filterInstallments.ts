import { Installments } from "@/types/installments";
import { months } from "./dashboard";

export function filterInstallments(
  installment: Installments[],
  month: string,
): Installments[] {
  return installment.filter((installment: Installments) => {
    const date = new Date(installment.dueDate);
    return installment.isRecurring || months[date.getMonth()] === month;
  });
}
