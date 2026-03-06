import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Transaction } from "../types";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#14b8a6"];

export default function CategoryChart({ transactions }: { transactions: Transaction[] }) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const categoryMap = new Map<string, number>();
  expenses.forEach((t) => categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + t.amount));
  const data = [...categoryMap.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return <div style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>No expense data yet</div>;
  }

  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#1e293b" }}>Spending by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={3} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Amount"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
