"use client";
import { useState } from "react";
import AppLayout from "../components/AppLayout";

export default function ShotListPage() {
  const [sceneName, setSceneName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("Day");
  const [shots, setShots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/shotlist/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ scene_name: sceneName, description, location, time_of_day: timeOfDay }),
      });
      const data = await response.json();
      setShots(data.shots);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const SHOT_TYPE_COLORS: Record<string, string> = {
    "Wide Shot": "#60a5fa", "Medium Shot": "#4ade80", "Close-Up": "#C9A84C",
    "Extreme Close-Up": "#f97316", "Over The Shoulder": "#a78bfa",
    "Point of View": "#f472b6", "Two Shot": "#34d399",
    "Aerial/Drone": "#38bdf8", "Tracking Shot": "#fb923c", "Dutch Angle": "#f87171",
  };

  return (
    <AppLayout>
      <div style={{ padding: "28px 24px" }}>

        {/* Header */}
        <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "#C9A84C", marginBottom: "8px" }}>
          🎬 Shot List Generator
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "32px" }}>
          Enter scene details and AI will generate a professional shot list
        </p>

        {/* Form */}
        <div style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e293b", borderRadius: "12px", padding: "24px", marginBottom: "32px", maxWidth: "600px" }}>
          <input placeholder="Scene Name" value={sceneName} onChange={e => setSceneName(e.target.value)}
            style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "12px 16px", color: "white", fontSize: "14px", marginBottom: "12px", outline: "none", boxSizing: "border-box" }} />

          <textarea placeholder="Scene Description — more detail = better shots" value={description} onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "12px 16px", color: "white", fontSize: "14px", marginBottom: "12px", outline: "none", resize: "none", boxSizing: "border-box" }} />

          <input placeholder="Location (e.g. Rooftop, Coffee Shop)" value={location} onChange={e => setLocation(e.target.value)}
            style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "12px 16px", color: "white", fontSize: "14px", marginBottom: "12px", outline: "none", boxSizing: "border-box" }} />

          <select value={timeOfDay} onChange={e => setTimeOfDay(e.target.value)}
            style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "12px 16px", color: "white", fontSize: "14px", marginBottom: "20px", outline: "none" }}>
            <option value="Day">Day</option>
            <option value="Night">Night</option>
            <option value="Golden Hour">Golden Hour</option>
            <option value="Dawn">Dawn</option>
            <option value="Dusk">Dusk</option>
          </select>

          <button onClick={generate} disabled={loading}
            style={{ background: loading ? "#64748b" : "#C9A84C", color: "#080810", border: "none", padding: "12px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "⏳ Generating..." : "✨ Generate Shot List"}
          </button>
        </div>

        {/* Shot Cards */}
        {shots.length > 0 && (
          <div>
            <h2 style={{ fontSize: "16px", color: "#64748b", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              {shots.length} Shots Generated
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {shots.map((shot, index) => (
                <div key={index} style={{ background: "#0f0f1a", border: "1px solid #1e293b", borderRadius: "10px", padding: "18px" }}>
                  <div style={{ marginBottom: "12px" }}>
                    <span style={{
                      background: SHOT_TYPE_COLORS[shot.shot_type] ? `${SHOT_TYPE_COLORS[shot.shot_type]}22` : "rgba(255,255,255,0.08)",
                      color: SHOT_TYPE_COLORS[shot.shot_type] || "white",
                      borderRadius: "4px", padding: "3px 10px", fontSize: "12px", fontWeight: "600"
                    }}>
                      {shot.shot_type}
                    </span>
                    <span style={{ color: "#64748b", fontSize: "11px", marginLeft: "8px" }}>#{index + 1}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {shot.lens && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b", fontSize: "12px" }}>🔭 Lens</span>
                        <span style={{ color: "#94a3b8", fontSize: "12px" }}>{shot.lens}</span>
                      </div>
                    )}
                    {shot.camera_movement && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b", fontSize: "12px" }}>🎬 Movement</span>
                        <span style={{ color: "#94a3b8", fontSize: "12px" }}>{shot.camera_movement}</span>
                      </div>
                    )}
                    {shot.duration && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b", fontSize: "12px" }}>⏱ Duration</span>
                        <span style={{ color: "#C9A84C", fontSize: "12px" }}>{shot.duration}</span>
                      </div>
                    )}
                    {shot.priority && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b", fontSize: "12px" }}>⭐ Priority</span>
                        <span style={{ color: shot.priority === "High" ? "#f87171" : shot.priority === "Medium" ? "#C9A84C" : "#4ade80", fontSize: "12px" }}>{shot.priority}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}