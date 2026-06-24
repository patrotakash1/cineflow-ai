"use client";
import { useState } from "react";
import AppLayout from "../components/AppLayout";

interface Scene {
  scene_number: number;
  heading: string;
  location: string;
  time_of_day: string;
  characters: string[];
  estimated_hours: number;
}

interface ShootDay {
  day_number: number;
  date_label: string;
  call_time: string;
  wrap_time: string;
  primary_location: string;
  scenes: Scene[];
  total_scenes: number;
  unique_locations: number;
  all_characters: string[];
}

interface ScheduleResult {
  project_name: string;
  total_shoot_days: number;
  total_scenes_scheduled: number;
  schedule: ShootDay[];
}

const SAMPLE_SCENES = [
  { scene_number: 1, heading: "INT. COFFEE SHOP - DAY", location: "INT. COFFEE SHOP", time_of_day: "DAY", characters: ["ARJUN", "PRIYA"], action: "A busy Mumbai coffee shop." },
  { scene_number: 2, heading: "EXT. STREET OUTSIDE COFFEE SHOP - NIGHT", location: "EXT. STREET OUTSIDE COFFEE SHOP", time_of_day: "NIGHT", characters: ["ARJUN"], action: "Arjun walks out alone." },
  { scene_number: 3, heading: "INT. ARJUN'S APARTMENT - NIGHT", location: "INT. ARJUN'S APARTMENT", time_of_day: "NIGHT", characters: ["ARJUN"], action: "Small, cluttered." },
  { scene_number: 4, heading: "INT. COFFEE SHOP - MORNING", location: "INT. COFFEE SHOP", time_of_day: "MORNING", characters: ["ARJUN", "PRIYA", "WAITER"], action: "The next morning." },
  { scene_number: 5, heading: "EXT. ROOFTOP - NIGHT", location: "EXT. ROOFTOP", time_of_day: "NIGHT", characters: ["ARJUN", "PRIYA"], action: "A dramatic confrontation." },
  { scene_number: 6, heading: "INT. ARJUN'S APARTMENT - DAY", location: "INT. ARJUN'S APARTMENT", time_of_day: "DAY", characters: ["ARJUN", "MOTHER"], action: "Arjun's mother visits." },
];

export default function SchedulePage() {
  const [shootDays, setShootDays] = useState(3);
  const savedScenes = typeof window !== "undefined" && localStorage.getItem("script_scenes");
  const savedFilename = typeof window !== "undefined" && localStorage.getItem("script_filename");
  const scenesToUse = savedScenes ? JSON.parse(savedScenes) : SAMPLE_SCENES;
  const projectName = savedFilename ? savedFilename.replace(".docx", "").replace(".pdf", "") : "Shadows of Tomorrow";
  const [callTime, setCallTime] = useState("07:00 AM");
  const [wrapTime, setWrapTime] = useState("07:00 PM");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScheduleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  async function generateSchedule() {
    setLoading(true); setError(null); setResult(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/schedule/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ scenes: scenesToUse, shoot_days: shootDays, call_time: callTime, wrap_time: wrapTime, project_name: projectName }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || "Failed"); }
      const data = await res.json();
      setResult(data); setExpandedDay(1);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <AppLayout>
      <div style={{ padding: "28px 24px" }}>

        {/* Header */}
        <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "#C9A84C", marginBottom: "8px" }}>
          📅 Shooting Schedule Generator
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "32px" }}>
          Scenes are auto-grouped by location to minimise travel cost and setup time.
        </p>

        {/* Config Panel */}
        <div style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e293b", borderRadius: "12px", padding: "24px", marginBottom: "32px", display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Total Shoot Days</label>
            <input type="number" min={1} max={60} value={shootDays} onChange={e => setShootDays(Number(e.target.value))}
              style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "16px", width: "100px", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Call Time</label>
            <input type="text" value={callTime} onChange={e => setCallTime(e.target.value)}
              style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", width: "120px", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Wrap Time</label>
            <input type="text" value={wrapTime} onChange={e => setWrapTime(e.target.value)}
              style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", width: "120px", outline: "none" }} />
          </div>
          <button onClick={generateSchedule} disabled={loading}
            style={{ background: loading ? "#64748b" : "#C9A84C", color: "#080810", border: "none", padding: "10px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "⏳ Generating..." : "⚡ Generate Schedule"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: "#2d0a0a", border: "1px solid #7f1d1d", borderRadius: "8px", padding: "16px", color: "#fca5a5", marginBottom: "32px" }}>
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "28px" }}>
              {[
                { label: "PROJECT", value: result.project_name },
                { label: "SHOOT DAYS", value: result.total_shoot_days },
                { label: "SCENES SCHEDULED", value: result.total_scenes_scheduled },
              ].map((s, i) => (
                <div key={i} style={{ backgroundColor: "#0f0f1a", border: "1px solid #C9A84C", borderRadius: "10px", padding: "16px 20px" }}>
                  <p style={{ color: "#64748b", fontSize: "11px", letterSpacing: "0.8px", marginBottom: "6px" }}>{s.label}</p>
                  <p style={{ color: "#C9A84C", fontSize: "20px", fontWeight: "700" }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {result.schedule.map((day) => (
                <div key={day.day_number} style={{ backgroundColor: "#0f0f1a", border: `1px solid ${expandedDay === day.day_number ? "#C9A84C" : "#1e293b"}`, borderRadius: "10px", overflow: "hidden", transition: "border-color 0.2s" }}>
                  <div onClick={() => setExpandedDay(expandedDay === day.day_number ? null : day.day_number)}
                    style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                      <div style={{ backgroundColor: "#C9A84C", color: "#080810", borderRadius: "8px", padding: "4px 12px", fontSize: "13px", fontWeight: "700", minWidth: "60px", textAlign: "center" }}>
                        DAY {day.day_number}
                      </div>
                      <div>
                        <p style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>📍 {day.primary_location}</p>
                        <p style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>
                          {day.call_time} — {day.wrap_time} · {day.total_scenes} scenes · {day.unique_locations} location{day.unique_locations > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      {day.all_characters.slice(0, 3).map((char, i) => (
                        <span key={i} style={{ backgroundColor: "#1e293b", color: "#94a3b8", borderRadius: "20px", padding: "2px 10px", fontSize: "11px" }}>👤 {char}</span>
                      ))}
                      {day.all_characters.length > 3 && <span style={{ color: "#64748b", fontSize: "12px" }}>+{day.all_characters.length - 3} more</span>}
                      <span style={{ color: "#64748b", fontSize: "18px" }}>{expandedDay === day.day_number ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {expandedDay === day.day_number && (
                    <div style={{ borderTop: "1px solid #1e293b", padding: "16px 20px" }}>
                      {day.scenes.map((scene, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid #1e293b", marginBottom: "8px", flexWrap: "wrap" }}>
                          <span style={{ backgroundColor: "#1e293b", color: "#C9A84C", borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: "700", minWidth: "52px", textAlign: "center" }}>
                            SC {scene.scene_number}
                          </span>
                          <div style={{ flex: 1, minWidth: 120 }}>
                            <p style={{ color: "#C9A84C", fontSize: "12px", fontFamily: "monospace" }}>{scene.heading}</p>
                            {scene.characters.length > 0 && (
                              <p style={{ color: "#64748b", fontSize: "11px", marginTop: "3px" }}>👥 {scene.characters.join(", ")}</p>
                            )}
                          </div>
                          <span style={{ backgroundColor: scene.time_of_day === "NIGHT" ? "#1a1a3e" : "#1a2e1a", color: scene.time_of_day === "NIGHT" ? "#818cf8" : "#4ade80", borderRadius: "6px", padding: "2px 10px", fontSize: "11px" }}>
                            {scene.time_of_day}
                          </span>
                          <span style={{ color: "#64748b", fontSize: "12px" }}>⏱ {scene.estimated_hours}h</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "28px", textAlign: "center" }}>
              <button onClick={() => setResult(null)}
                style={{ background: "transparent", border: "1px solid #334155", color: "#94a3b8", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
                ↩ Generate New Schedule
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}