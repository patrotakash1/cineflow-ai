"use client";
import { useState, useEffect } from "react";
import AppLayout from '../components/AppLayout'

interface Comment {
  id: number;
  task_id: number;
  author: string;
  content: string;
  created_at: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  department?: string;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  comments: Comment[];
}

const COLUMNS = [
  { id: "todo", label: "To Do", color: "#64748b", bg: "rgba(100,116,139,0.1)" },
  { id: "inprogress", label: "In Progress", color: "#C9A84C", bg: "rgba(201,168,76,0.1)" },
  { id: "review", label: "Review", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  { id: "done", label: "Done", color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
];

const DEPARTMENTS = ["Camera", "Lighting", "Sound", "Art", "Costume", "Direction", "Production", "VFX"];
const PRIORITIES = ["low", "medium", "high"];

const PRIORITY_COLORS: Record<string, string> = {
  low: "#4ade80", medium: "#C9A84C", high: "#f87171",
};

const DEPT_COLORS: Record<string, string> = {
  Camera: "#60a5fa", Lighting: "#C9A84C", Sound: "#a78bfa",
  Art: "#f472b6", Costume: "#fb923c", Direction: "#4ade80",
  Production: "#94a3b8", VFX: "#22d3ee",
};

const API = "${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/crew";

export default function CrewPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium",
    department: "", assigned_to: "", due_date: "", status: "todo",
  });

  function getHeaders(): Record<string, string> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  useEffect(() => { fetchTasks(); }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/tasks`, { headers: getHeaders() });
      const data = await res.json();
      setTasks(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function createTask() {
    if (!form.title.trim()) return;
    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST", headers: getHeaders(), body: JSON.stringify(form),
      });
      const data = await res.json();
      setTasks(prev => [data, ...prev]);
      setForm({ title: "", description: "", priority: "medium", department: "", assigned_to: "", due_date: "", status: "todo" });
      setShowForm(false);
    } catch (e) { console.error(e); }
  }

  async function moveTask(taskId: number, newStatus: string) {
    try {
      const res = await fetch(`${API}/tasks/${taskId}`, {
        method: "PATCH", headers: getHeaders(), body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      if (selectedTask?.id === taskId) setSelectedTask(updated);
    } catch (e) { console.error(e); }
  }

  async function deleteTask(taskId: number) {
    try {
      await fetch(`${API}/tasks/${taskId}`, { method: "DELETE", headers: getHeaders() });
      setTasks(prev => prev.filter(t => t.id !== taskId));
      if (selectedTask?.id === taskId) setSelectedTask(null);
    } catch (e) { console.error(e); }
  }

  async function addComment() {
    if (!newComment.trim() || !commentAuthor.trim() || !selectedTask) return;
    try {
      const res = await fetch(`${API}/tasks/${selectedTask.id}/comments`, {
        method: "POST", headers: getHeaders(),
        body: JSON.stringify({ author: commentAuthor, content: newComment }),
      });
      const comment = await res.json();
      const updatedTask = { ...selectedTask, comments: [...selectedTask.comments, comment] };
      setSelectedTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === selectedTask.id ? updatedTask : t));
      setNewComment("");
    } catch (e) { console.error(e); }
  }

  function onDragStart(taskId: number) { setDraggedId(taskId); }
  function onDragOver(e: React.DragEvent) { e.preventDefault(); }
  function onDrop(e: React.DragEvent, status: string) {
    e.preventDefault();
    if (draggedId !== null) { moveTask(draggedId, status); setDraggedId(null); }
  }

  const tasksByStatus = (status: string) => tasks.filter(t => t.status === status);

  return (
    <AppLayout>
      <div style={{ padding: "28px 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "#C9A84C", marginBottom: "4px" }}>👥 Crew Workspace</h1>
            <p style={{ color: "#64748b", fontSize: "13px" }}>Drag cards between columns to update task status</p>
          </div>
          <button onClick={() => setShowForm(true)}
            style={{ background: "#C9A84C", color: "#080810", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
            + New Task
          </button>
        </div>

        {/* New Task Modal */}
        {showForm && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
            <div style={{ backgroundColor: "#0f0f1a", border: "1px solid #C9A84C", borderRadius: "12px", padding: "28px", width: "480px", maxWidth: "95vw" }}>
              <h2 style={{ color: "#C9A84C", marginBottom: "20px", fontSize: "18px" }}>Create New Task</h2>
              <input placeholder="Task title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", marginBottom: "12px", outline: "none", boxSizing: "border-box" }} />
              <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3} style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", marginBottom: "12px", outline: "none", resize: "none", boxSizing: "border-box" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                  style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: form.department ? "white" : "#64748b", fontSize: "14px", outline: "none" }}>
                  <option value="">Department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                  style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", outline: "none" }}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)} Priority</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <input placeholder="Assign to" value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                  style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", outline: "none" }} />
                <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })}
                  style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button onClick={() => setShowForm(false)}
                  style={{ background: "transparent", border: "1px solid #334155", color: "#94a3b8", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>Cancel</button>
                <button onClick={createTask}
                  style={{ background: "#C9A84C", color: "#080810", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>Create Task</button>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        {loading ? (
          <p style={{ color: "#64748b", textAlign: "center", marginTop: "60px" }}>Loading tasks...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", overflowX: "auto" }}>
            {COLUMNS.map(col => (
              <div key={col.id} onDragOver={onDragOver} onDrop={e => onDrop(e, col.id)}
                style={{ backgroundColor: "#0a0a14", border: `1px solid ${col.color}22`, borderRadius: "12px", padding: "16px", minHeight: "400px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: col.color }} />
                    <span style={{ color: col.color, fontWeight: "600", fontSize: "13px" }}>{col.label}</span>
                  </div>
                  <span style={{ backgroundColor: col.bg, color: col.color, borderRadius: "20px", padding: "1px 8px", fontSize: "11px", fontWeight: "700" }}>
                    {tasksByStatus(col.id).length}
                  </span>
                </div>
                {tasksByStatus(col.id).map(task => (
                  <div key={task.id} draggable onDragStart={() => onDragStart(task.id)} onClick={() => setSelectedTask(task)}
                    style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e293b", borderRadius: "8px", padding: "12px", marginBottom: "10px", cursor: "grab", transition: "border-color 0.15s", opacity: draggedId === task.id ? 0.4 : 1 }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#C9A84C")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e293b")}>
                    {task.department && (
                      <span style={{ backgroundColor: `${DEPT_COLORS[task.department] || "#64748b"}22`, color: DEPT_COLORS[task.department] || "#64748b", borderRadius: "4px", padding: "1px 7px", fontSize: "10px", fontWeight: "600", display: "inline-block", marginBottom: "8px" }}>
                        {task.department}
                      </span>
                    )}
                    <p style={{ color: "white", fontSize: "13px", fontWeight: "500", marginBottom: "8px", lineHeight: "1.4" }}>{task.title}</p>
                    {task.description && (
                      <p style={{ color: "#64748b", fontSize: "11px", marginBottom: "8px", lineHeight: "1.5" }}>
                        {task.description.length > 80 ? task.description.substring(0, 80) + "..." : task.description}
                      </p>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      <span style={{ color: PRIORITY_COLORS[task.priority], fontSize: "10px", fontWeight: "600", textTransform: "uppercase" }}>● {task.priority}</span>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {task.comments.length > 0 && <span style={{ color: "#64748b", fontSize: "11px" }}>💬 {task.comments.length}</span>}
                        {task.assigned_to && (
                          <span style={{ backgroundColor: "#1e293b", color: "#94a3b8", borderRadius: "20px", padding: "1px 8px", fontSize: "10px" }}>👤 {task.assigned_to}</span>
                        )}
                      </div>
                    </div>
                    {task.due_date && <p style={{ color: "#475569", fontSize: "10px", marginTop: "6px" }}>📅 {task.due_date}</p>}
                  </div>
                ))}
                {tasksByStatus(col.id).length === 0 && (
                  <div style={{ border: "1px dashed #1e293b", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
                    <p style={{ color: "#334155", fontSize: "12px" }}>Drop tasks here</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Task Detail Sidebar */}
        {selectedTask && (
          <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "360px", maxWidth: "90vw", backgroundColor: "#0a0a14", borderLeft: "1px solid #1e293b", padding: "24px", overflowY: "auto", zIndex: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600", flex: 1, paddingRight: "12px" }}>{selectedTask.title}</h2>
              <button onClick={() => setSelectedTask(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "20px", lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "#64748b", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase" }}>Status</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {COLUMNS.map(col => (
                  <button key={col.id} onClick={() => moveTask(selectedTask.id, col.id)}
                    style={{ background: selectedTask.status === col.id ? col.bg : "transparent", border: `1px solid ${selectedTask.status === col.id ? col.color : "#334155"}`, color: selectedTask.status === col.id ? col.color : "#64748b", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", cursor: "pointer" }}>
                    {col.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: "#0f0f1a", borderRadius: "8px", padding: "14px", marginBottom: "16px" }}>
              {[
                { label: "Department", value: selectedTask.department },
                { label: "Assigned To", value: selectedTask.assigned_to },
                { label: "Priority", value: selectedTask.priority },
                { label: "Due Date", value: selectedTask.due_date },
              ].map((d, i) => d.value ? (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "#64748b", fontSize: "12px" }}>{d.label}</span>
                  <span style={{ color: "white", fontSize: "12px" }}>{d.value}</span>
                </div>
              ) : null)}
            </div>
            {selectedTask.description && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ color: "#64748b", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase" }}>Description</p>
                <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.6" }}>{selectedTask.description}</p>
              </div>
            )}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "#64748b", fontSize: "11px", marginBottom: "12px", textTransform: "uppercase" }}>Comments ({selectedTask.comments.length})</p>
              {selectedTask.comments.map(c => (
                <div key={c.id} style={{ backgroundColor: "#0f0f1a", borderRadius: "8px", padding: "10px 12px", marginBottom: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#C9A84C", fontSize: "12px", fontWeight: "600" }}>👤 {c.author}</span>
                    <span style={{ color: "#334155", fontSize: "10px" }}>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: "12px", lineHeight: "1.5" }}>{c.content}</p>
                </div>
              ))}
              <div style={{ marginTop: "12px" }}>
                <input placeholder="Your name" value={commentAuthor} onChange={e => setCommentAuthor(e.target.value)}
                  style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "6px", padding: "8px 12px", color: "white", fontSize: "12px", marginBottom: "8px", outline: "none", boxSizing: "border-box" }} />
                <textarea placeholder="Write a comment..." value={newComment} onChange={e => setNewComment(e.target.value)}
                  rows={2} style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "6px", padding: "8px 12px", color: "white", fontSize: "12px", marginBottom: "8px", outline: "none", resize: "none", boxSizing: "border-box" }} />
                <button onClick={addComment}
                  style={{ width: "100%", background: "#C9A84C", color: "#080810", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}>
                  Post Comment
                </button>
              </div>
            </div>
            <button onClick={() => deleteTask(selectedTask.id)}
              style={{ width: "100%", background: "transparent", border: "1px solid #7f1d1d", color: "#f87171", padding: "8px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", marginTop: "8px" }}>
              🗑 Delete Task
            </button>
          </div>
        )}

      </div>
    </AppLayout>
  );
}