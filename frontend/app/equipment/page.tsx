"use client";
import { useState, useEffect } from "react";
import AppLayout from '../components/AppLayout'
interface Equipment {
  id: number;
  name: string;
  category: string;
  brand?: string;
  model_number?: string;
  status: string;
  condition: string;
  assigned_to?: string;
  reserved_for?: string;
  notes?: string;
  daily_rate?: number;
}

const CATEGORIES = ["All", "Camera", "Lens", "Lighting", "Sound", "Grip", "Transport"];
const STATUSES = ["All", "available", "in_use", "maintenance"];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: "Available", color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  in_use: { label: "In Use", color: "#C9A84C", bg: "rgba(201,168,76,0.1)" },
  maintenance: { label: "Maintenance", color: "#f87171", bg: "rgba(248,113,113,0.1)" },
};

const CATEGORY_ICONS: Record<string, string> = {
  Camera: "🎥", Lens: "🔭", Lighting: "💡", Sound: "🎙️", Grip: "🎬", Transport: "🚐",
};

const CONDITION_COLORS: Record<string, string> = {
  excellent: "#4ade80", good: "#C9A84C", fair: "#fb923c", poor: "#f87171",
};

const API = "${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/equipment";

export default function EquipmentPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "Camera", brand: "", model_number: "",
    status: "available", condition: "good",
    assigned_to: "", reserved_for: "", notes: "", daily_rate: ""
  });

  useEffect(() => { fetchEquipment(); }, []);

  async function fetchEquipment() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function createEquipment() {
    if (!form.name.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const payload = { ...form, daily_rate: form.daily_rate ? parseInt(form.daily_rate) : null };
      const res = await fetch(`${API}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setItems(prev => [data, ...prev]);
      setShowForm(false);
      setForm({ name: "", category: "Camera", brand: "", model_number: "", status: "available", condition: "good", assigned_to: "", reserved_for: "", notes: "", daily_rate: "" });
    } catch (e) { console.error(e); }
  }

  async function updateStatus(id: number, status: string) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const updated = await res.json();
      setItems(prev => prev.map(i => i.id === id ? updated : i));
      if (selectedItem?.id === id) setSelectedItem(updated);
    } catch (e) { console.error(e); }
  }

  async function deleteEquipment(id: number) {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setItems(prev => prev.filter(i => i.id !== id));
      setSelectedItem(null);
    } catch (e) { console.error(e); }
  }

  const filtered = items.filter(item => {
    const catMatch = selectedCategory === "All" || item.category === selectedCategory;
    const statMatch = selectedStatus === "All" || item.status === selectedStatus;
    return catMatch && statMatch;
  });

  const stats = {
    total: items.length,
    available: items.filter(i => i.status === "available").length,
    in_use: items.filter(i => i.status === "in_use").length,
    maintenance: items.filter(i => i.status === "maintenance").length,
  };

  return (
    <AppLayout>
      <div style={{ padding: "28px 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "#C9A84C", marginBottom: "4px" }}>🔧 Equipment Manager</h1>
            <p style={{ color: "#64748b", fontSize: "13px" }}>Track and manage all production equipment</p>
          </div>
          <button onClick={() => setShowForm(true)}
            style={{ background: "#C9A84C", color: "#080810", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
            + Add Equipment
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Total Items", value: stats.total, color: "white" },
            { label: "Available", value: stats.available, color: "#4ade80" },
            { label: "In Use", value: stats.in_use, color: "#C9A84C" },
            { label: "Maintenance", value: stats.maintenance, color: "#f87171" },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e293b", borderRadius: "10px", padding: "16px 20px" }}>
              <p style={{ color: "#64748b", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>{s.label}</p>
              <p style={{ color: s.color, fontSize: "28px", fontWeight: "700" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? "#C9A84C" : "transparent",
                  color: selectedCategory === cat ? "#080810" : "#64748b",
                  border: `1px solid ${selectedCategory === cat ? "#C9A84C" : "#334155"}`,
                  padding: "6px 14px", borderRadius: "20px", fontSize: "12px", cursor: "pointer", fontWeight: selectedCategory === cat ? "700" : "400"
                }}>
                {cat !== "All" ? CATEGORY_ICONS[cat] : ""} {cat}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setSelectedStatus(s)}
                style={{
                  background: selectedStatus === s ? (STATUS_CONFIG[s]?.bg || "rgba(255,255,255,0.1)") : "transparent",
                  color: selectedStatus === s ? (STATUS_CONFIG[s]?.color || "white") : "#64748b",
                  border: `1px solid ${selectedStatus === s ? (STATUS_CONFIG[s]?.color || "white") : "#334155"}`,
                  padding: "6px 14px", borderRadius: "20px", fontSize: "12px", cursor: "pointer"
                }}>
                {s === "All" ? "All Status" : STATUS_CONFIG[s]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <p style={{ color: "#64748b", textAlign: "center", marginTop: "60px" }}>Loading equipment...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {filtered.map(item => (
              <div key={item.id} onClick={() => setSelectedItem(item)}
                style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e293b", borderRadius: "10px", padding: "18px", cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e293b")}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "24px" }}>{CATEGORY_ICONS[item.category] || "📦"}</span>
                  <span style={{ backgroundColor: STATUS_CONFIG[item.status]?.bg, color: STATUS_CONFIG[item.status]?.color, borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: "600" }}>
                    {STATUS_CONFIG[item.status]?.label}
                  </span>
                </div>
                <p style={{ color: "white", fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>{item.name}</p>
                <p style={{ color: "#64748b", fontSize: "12px", marginBottom: "12px" }}>{item.brand} {item.model_number}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ backgroundColor: "#1e293b", color: "#94a3b8", borderRadius: "4px", padding: "2px 8px", fontSize: "11px" }}>{item.category}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: CONDITION_COLORS[item.condition], fontSize: "11px" }}>● {item.condition}</span>
                    {item.daily_rate && <span style={{ color: "#C9A84C", fontSize: "12px", fontWeight: "600" }}>₹{item.daily_rate.toLocaleString()}/day</span>}
                  </div>
                </div>
                {item.assigned_to && (
                  <p style={{ color: "#475569", fontSize: "11px", marginTop: "8px" }}>
                    👤 {item.assigned_to} {item.reserved_for ? `— ${item.reserved_for}` : ""}
                  </p>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "#334155" }}>
                No equipment found for selected filters.
              </div>
            )}
          </div>
        )}

        {/* Add Equipment Modal */}
        {showForm && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
            <div style={{ backgroundColor: "#0f0f1a", border: "1px solid #C9A84C", borderRadius: "12px", padding: "28px", width: "500px", maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }}>
              <h2 style={{ color: "#C9A84C", marginBottom: "20px", fontSize: "18px" }}>Add Equipment</h2>
              <input placeholder="Equipment name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", marginBottom: "12px", outline: "none", boxSizing: "border-box" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", outline: "none" }}>
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", outline: "none" }}>
                  <option value="available">Available</option>
                  <option value="in_use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <input placeholder="Brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}
                  style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", outline: "none" }} />
                <input placeholder="Model number" value={form.model_number} onChange={e => setForm({ ...form, model_number: e.target.value })}
                  style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", outline: "none" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <input placeholder="Assigned to" value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                  style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", outline: "none" }} />
                <input placeholder="Daily rate (₹)" value={form.daily_rate} onChange={e => setForm({ ...form, daily_rate: e.target.value })}
                  style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", outline: "none" }} />
              </div>
              <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}
                style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", marginBottom: "12px", outline: "none" }}>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
              <textarea placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={2}
                style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", marginBottom: "20px", outline: "none", resize: "none", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button onClick={() => setShowForm(false)}
                  style={{ background: "transparent", border: "1px solid #334155", color: "#94a3b8", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>Cancel</button>
                <button onClick={createEquipment}
                  style={{ background: "#C9A84C", color: "#080810", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>Add Equipment</button>
              </div>
            </div>
          </div>
        )}

        {/* Equipment Detail Sidebar */}
        {selectedItem && (
          <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "320px", maxWidth: "90vw", backgroundColor: "#0a0a14", borderLeft: "1px solid #1e293b", padding: "24px", overflowY: "auto", zIndex: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "32px" }}>{CATEGORY_ICONS[selectedItem.category]}</span>
              <button onClick={() => setSelectedItem(null)}
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <h2 style={{ color: "white", fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>{selectedItem.name}</h2>
            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "20px" }}>{selectedItem.brand} {selectedItem.model_number}</p>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ color: "#64748b", fontSize: "11px", marginBottom: "8px", textTransform: "uppercase" }}>Status</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button key={key} onClick={() => updateStatus(selectedItem.id, key)}
                    style={{ background: selectedItem.status === key ? cfg.bg : "transparent", border: `1px solid ${selectedItem.status === key ? cfg.color : "#334155"}`, color: selectedItem.status === key ? cfg.color : "#64748b", borderRadius: "6px", padding: "5px 10px", fontSize: "11px", cursor: "pointer" }}>
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: "#0f0f1a", borderRadius: "8px", padding: "14px", marginBottom: "16px" }}>
              {[
                { label: "Category", value: selectedItem.category },
                { label: "Condition", value: selectedItem.condition },
                { label: "Assigned To", value: selectedItem.assigned_to },
                { label: "Reserved For", value: selectedItem.reserved_for },
                { label: "Daily Rate", value: selectedItem.daily_rate ? `₹${selectedItem.daily_rate.toLocaleString()}` : null },
              ].map((d, i) => d.value ? (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "#64748b", fontSize: "12px" }}>{d.label}</span>
                  <span style={{ color: "white", fontSize: "12px" }}>{d.value}</span>
                </div>
              ) : null)}
            </div>
            {selectedItem.notes && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ color: "#64748b", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase" }}>Notes</p>
                <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.6" }}>{selectedItem.notes}</p>
              </div>
            )}
            <button onClick={() => deleteEquipment(selectedItem.id)}
              style={{ width: "100%", background: "transparent", border: "1px solid #7f1d1d", color: "#f87171", padding: "8px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
              🗑 Delete Equipment
            </button>
          </div>
        )}

      </div>
    </AppLayout>
  );
}