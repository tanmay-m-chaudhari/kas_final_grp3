export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  color: string;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
}
