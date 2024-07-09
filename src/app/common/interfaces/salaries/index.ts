export type Salaries = {
  id: string;
  amount: number;
  description: string;
};

export type SalariesResponse = {
  data: Salaries[];
};
