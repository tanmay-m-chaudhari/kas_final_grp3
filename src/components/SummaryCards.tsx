import React from "react";

interface Props {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function SummaryCards({ balance, totalIncome, totalExpenses }: Props) {
  const cards = [
    { label: "Current Balance", value: balance, color: balance >= 0 ? "#10b981" : "#ef4444", bg: balance >= 0 ? "#ecfdf5" : "#fef2f2", icon: "💰" },
    { label: "Total Income", value: totalIncome, color: "#10b981", bg: "#ecfdf5", icon: "📈" },
    { label: "Total Expenses", value: totalExpenses, color: "#ef4444", bg: "#fef2f2", icon: "📉" },
    { label: "Savings Rate", value: totalIncome > 0 ? ((balance / totalIncome) * 100) : 0, color: "#6366f1", bg: "#eef2ff", icon: "🎯", isPercent: true },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
      {cards.map(({ label, value, color, bg, icon, isPercent }) => (
        <div key={label} style={{ background: bg, borderRadius: "12px", padding: "1.25rem", border: `1px solid ${color}22` }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{label}</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color }}>
            {isPercent ? `${value.toFixed(1)}%` : fmt(value)}
          </div>
        </div>
      ))}
    </div>
  );
}
