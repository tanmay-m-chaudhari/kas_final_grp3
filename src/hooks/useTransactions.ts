import { useState, useEffect, useCallback } from "react";
import { Transaction } from "../types";

const STORAGE_KEY = "finance_tracker_transactions";

const SEED_DATA: Transaction[] = [
  { id: "s1", description: "Monthly Salary", amount: 5000, type: "income", category: "Salary", date: "2024-06-01" },
  { id: "s2", description: "Freelance Project", amount: 1200, type: "income", category: "Freelance", date: "2024-06-05" },
  { id: "s3", description: "Rent Payment", amount: 1500, type: "expense", category: "Housing", date: "2024-06-01" },
  { id: "s4", description: "Grocery Shopping", amount: 320, type: "expense", category: "Food", date: "2024-06-07" },
  { id: "s5", description: "Netflix Subscription", amount: 15, type: "expense", category: "Entertainment", date: "2024-06-08" },
  { id: "s6", description: "Electricity Bill", amount: 85, type: "expense", category: "Utilities", date: "2024-06-10" },
  { id: "s7", description: "Gym Membership", amount: 50, type: "expense", category: "Health", date: "2024-06-11" },
  { id: "s8", description: "Restaurant Dinner", amount: 95, type: "expense", category: "Food", date: "2024-06-14" },
  { id: "s9", description: "Monthly Salary", amount: 5000, type: "income", category: "Salary", date: "2024-07-01" },
  { id: "s10", description: "Rent Payment", amount: 1500, type: "expense", category: "Housing", date: "2024-07-01" },
  { id: "s11", description: "Grocery Shopping", amount: 290, type: "expense", category: "Food", date: "2024-07-09" },
  { id: "s12", description: "Online Course", amount: 199, type: "expense", category: "Education", date: "2024-07-12" },
  { id: "s13", description: "Side Hustle", amount: 400, type: "income", category: "Freelance", date: "2024-07-15" },
  { id: "s14", description: "Internet Bill", amount: 60, type: "expense", category: "Utilities", date: "2024-07-18" },
  { id: "s15", description: "Monthly Salary", amount: 5000, type: "income", category: "Salary", date: "2024-08-01" },
  { id: "s16", description: "Rent Payment", amount: 1500, type: "expense", category: "Housing", date: "2024-08-01" },
  { id: "s17", description: "Flight Tickets", amount: 450, type: "expense", category: "Travel", date: "2024-08-05" },
  { id: "s18", description: "Grocery Shopping", amount: 310, type: "expense", category: "Food", date: "2024-08-08" },
  { id: "s19", description: "Bonus Payment", amount: 2000, type: "income", category: "Salary", date: "2024-08-15" },
  { id: "s20", description: "New Laptop", amount: 1200, type: "expense", category: "Technology", date: "2024-08-20" },
];

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Transaction[];
    } catch { /* ignore */ }
    return SEED_DATA;
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)); } catch { /* ignore */ }
  }, [transactions]);

  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    const { v4: uuidv4 } = require("uuid");
    setTransactions((prev) => [{ ...tx, id: uuidv4() }, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return { transactions, addTransaction, deleteTransaction, totalIncome, totalExpenses, balance };
}
