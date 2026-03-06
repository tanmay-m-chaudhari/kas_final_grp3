import React, { useState } from "react";
import { Transaction } from "../types";
import { format, parseISO } from "date-fns";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: Props) {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((t) => {
    const matchesType = filter === "all" || t.type === filter;
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>Transactions ({filtered.length})</h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
            style={{ padding: "0.4rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.8rem" }} />
          {(["all", "income", "expense"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "0.4rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.8rem", cursor: "pointer",
                background: filter === f ? "#6366f1" : "#f8fafc", color: filter === f ? "#fff" : "#64748b", fontWeight: filter === f ? 600 : 400 }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>No transactions found</div>
        ) : filtered.map((t) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0",
            borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%",
                background: t.type === "income" ? "#ecfdf5" : "#fef2f2",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                {t.type === "income" ? "📈" : "📉"}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1e293b" }}>{t.description}</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  {t.category} · {format(parseISO(t.date), "MMM d, yyyy")}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontWeight: 700, color: t.type === "income" ? "#10b981" : "#ef4444", fontSize: "0.95rem" }}>
                {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
              </span>
              <button onClick={() => onDelete(t.id)}
                style={{ background: "none", border: "1px solid #fee2e2", borderRadius: "6px", cursor: "pointer",
                  color: "#ef4444", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
