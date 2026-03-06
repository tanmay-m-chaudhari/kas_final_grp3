import React, { useState } from "react";
import { Transaction, TransactionType } from "../types";

interface Props {
  onAdd: (tx: Omit<Transaction, "id">) => void;
}

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
  expense: ["Housing", "Food", "Transport", "Utilities", "Health", "Entertainment", "Education", "Technology", "Travel", "Other"],
};

export default function TransactionForm({ onAdd }: Props) {
  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) { setError("Description is required"); return; }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { setError("Enter a valid amount"); return; }
    onAdd({ description: description.trim(), amount: Number(amount), type, category, date });
    setDescription(""); setAmount(""); setError("");
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#1e293b" }}>Add Transaction</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
        <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
          {(["expense", "income"] as TransactionType[]).map((t) => (
            <button key={t} type="button" onClick={() => handleTypeChange(t)}
              style={{ flex: 1, padding: "0.5rem", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                background: type === t ? (t === "income" ? "#10b981" : "#ef4444") : "#f8fafc",
                color: type === t ? "#fff" : "#64748b" }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"
          style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.875rem" }} />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (USD)" min="0" step="0.01"
          style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.875rem" }} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.875rem", background: "#fff" }}>
          {CATEGORIES[type].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.875rem" }} />
        <button type="submit"
          style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "none", background: "#6366f1", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}>
          + Add
        </button>
      </form>
      {error && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
}
