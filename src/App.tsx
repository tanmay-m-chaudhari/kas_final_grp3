import React from "react";
import { useTransactions } from "./hooks/useTransactions";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import CategoryChart from "./components/CategoryChart";
import MonthlyChart from "./components/MonthlyChart";

export default function App() {
  const { transactions, addTransaction, deleteTransaction, totalIncome, totalExpenses, balance } = useTransactions();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1e293b" }}>💳 FinanceTracker</h1>
        <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Track your income, expenses, and savings in one place</p>
      </header>

      <SummaryCards balance={balance} totalIncome={totalIncome} totalExpenses={totalExpenses} />
      <TransactionForm onAdd={addTransaction} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <CategoryChart transactions={transactions} />
        <MonthlyChart transactions={transactions} />
      </div>

      <TransactionList transactions={transactions} onDelete={deleteTransaction} />
    </div>
  );
}
