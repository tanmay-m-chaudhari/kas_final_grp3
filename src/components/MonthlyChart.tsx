import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Transaction } from "../types";
import { format, parseISO } from "date-fns";

export default function MonthlyChart({ transactions }: { transactions: Transaction[] }) {
  const monthMap = new Map<string, { income: number; expenses: number }>();
  transactions.forEach((t) => {
    const month = format(parseISO(t.date), "MMM yyyy");
    if (!monthMap.has(month)) monthMap.set(month, { income: 0, expenses: 0 });
    const entry = monthMap.get(month)!;
    if (t.type === "income") entry.income += t.amount;
    else entry.expenses += t.amount;
  });
  const data = [...monthMap.entries()].map(([month, vals]) => ({ month, ...vals }));

  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#1e293b" }}>Monthly Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
          <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
