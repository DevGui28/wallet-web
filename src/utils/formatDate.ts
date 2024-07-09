import { months } from "./dashboard";

export default function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  const dayFormatted = day.split("T")[0];
  return `${dayFormatted} de ${months[Number(month) - 1]} de ${year}`;
};