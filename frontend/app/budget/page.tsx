"use client";
import { useEffect, useState } from "react";
import AppLayout from '../components/AppLayout'
export default function BudgetPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  async function loadData() {
    try {
      const categoriesResponse = await fetch("http://localhost:8000/api/budget/categories");
      const summaryResponse = await fetch("http://localhost:8000/api/budget/summary");
      setCategories(await categoriesResponse.json());
      setSummary(await summaryResponse.json());
    } catch (error) { console.log(error); }
  }

  useEffect(() => { loadData(); }, []);

  return (
    <AppLayout>
      <div style={{ padding: 24 }}>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#C9A84C", marginBottom: 24 }}>
          🎬 Budget Management
        </h1>

        {summary && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Total Budget", value: `₹${summary.total_allocated}`, color: "white" },
              { label: "Spent", value: `₹${summary.total_spent}`, color: "#f87171" },
              { label: "Remaining", value: `₹${summary.remaining}`, color: "#4ade80" },
              { label: "Usage", value: `${summary.percent_used}%`, color: "#C9A84C" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#0f172a", borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ color: "#64748b", fontSize: 13, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Departments</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {categories.map((item) => {
            const percentage = Math.min((item.spent / item.allocated) * 100, 100);
            return (
              <div key={item.id} style={{ background: "#0f172a", borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{item.name}</span>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>₹{item.spent} / ₹{item.allocated}</span>
                </div>
                <div style={{ height: 8, background: "#1e293b", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${percentage}%`, height: "100%", background: "#C9A84C", borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </AppLayout>
  );
}