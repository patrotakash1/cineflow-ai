'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../components/AppLayout'
export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    if (stored) setUser(JSON.parse(stored))
    fetchDashboard()
  }, [])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  async function fetchDashboard() {
    try {
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/dashboard/')
      const data = await res.json()
      setDashboardData(data)
    } catch (error) { console.log(error) }
  }

  const quickActions = [
    { icon: '🎥', title: 'Shot List', href: '/shotlist' },
    { icon: '👥', title: 'Crew', href: '/crew' },
    { icon: '📋', title: 'Reports', href: '/reports' },
    { icon: '🤖', title: 'Copilot', href: '/copilot' },
  ]

  return (
    <AppLayout>
      <div style={{ padding: 24 }}>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input
            placeholder='Search scenes, crew, reports...'
            style={{ flex: 1, background: '#0f172a', color: 'white', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', fontSize: 14, outline: 'none' }}
          />
          <button style={{ background: '#C9A84C', border: 'none', borderRadius: 12, padding: '12px 18px', cursor: 'pointer', fontWeight: 600 }}>
            🔎 Search
          </button>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
          {quickActions.map((item, index) => (
            <div key={index} onClick={() => router.push(item.href)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 18, cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,168,76,0.08)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#C9A84C' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 28 }}>{item.icon}</div>
              <div style={{ marginTop: 8, fontSize: 14 }}>{item.title}</div>
            </div>
          ))}
        </div>

        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>Production Dashboard</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Welcome back, {user?.full_name?.split(' ')[0] || 'Director'} 👋</div>
          </div>
          <button style={{ background: '#C9A84C', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>+ New Project</button>
        </div>

        {/* Production Health Banner */}
        <div style={{ background: 'linear-gradient(90deg,#C9A84C,#9e7f33)', borderRadius: 14, padding: '20px', color: '#000', marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>🎬 Production Health: Excellent (91%)</div>
          <div style={{ marginTop: 8 }}>On track to finish 2 days early.</div>
        </div>

        {/* AI Insight Banner */}
        <div style={{ background: 'rgba(201,168,76,0.08)', border: '0.5px solid rgba(201,168,76,0.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 20 }}>🧠</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 12, color: '#C9A84C', fontWeight: 500 }}>{dashboardData ? dashboardData.ai_insight.title : 'Loading...'}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{dashboardData ? dashboardData.ai_insight.message : ''}</div>
          </div>
          <button style={{ background: '#C9A84C', color: '#000', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Apply fix</button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Scenes', value: dashboardData ? `${dashboardData.stats.scenes_completed} / ${dashboardData.stats.total_scenes}` : '--', delta: '↑ 6 this week', color: '#4ade80' },
            { label: 'Budget Used', value: dashboardData ? dashboardData.stats.budget_used : '--', delta: dashboardData ? `of ${dashboardData.stats.budget_total} total` : '--', color: 'rgba(255,255,255,0.3)' },
            { label: 'Shoot Days', value: dashboardData ? dashboardData.stats.shoot_days : '--', delta: 'On schedule', color: '#4ade80' },
            { label: 'Crew Active', value: dashboardData ? dashboardData.stats.crew_active : '--', delta: '↓ 2 absent', color: '#f87171' },
          ].map((m, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500 }}>{m.value}</div>
              <div style={{ fontSize: 11, color: m.color, marginTop: 4 }}>{m.delta}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 16, marginBottom: 18, fontWeight: 600 }}>🔔 Recent Activity</div>
          {(dashboardData ? dashboardData.activity : []).map((item: { title: string; time: string }, index: number) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>{item.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{item.time}</div>
            </div>
          ))}
        </div>

        {/* Budget + Scene Lineup */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Budget by Department</div>
            {[
              { label: 'Camera & Lenses', used: '₹3.2L', total: '₹4L', pct: 80, color: '#C9A84C' },
              { label: 'Lighting', used: '₹1.8L', total: '₹3L', pct: 60, color: '#4ade80' },
              { label: 'Locations', used: '₹2.4L', total: '₹3.5L', pct: 68, color: '#60a5fa' },
              { label: 'Travel & Food', used: '₹2.1L', total: '₹3L', pct: 70, color: '#a78bfa' },
              { label: 'Makeup', used: '₹0.9L', total: '₹2L', pct: 45, color: '#f87171' },
            ].map((b, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                  <span>{b.label}</span><span>{b.used}/{b.total}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${b.pct}%`, height: '100%', background: b.color, borderRadius: 99 }}></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Today's Scene Lineup</div>
            {[
              { num: 'SC 14', name: 'Rooftop confrontation', loc: 'Ext. Building C — Day', status: 'Done', color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
              { num: 'SC 15', name: 'Rain alley chase', loc: 'Ext. Lane 4 — Night', status: 'In Progress', color: '#C9A84C', bg: 'rgba(201,168,76,0.1)' },
              { num: 'SC 16', name: 'Interrogation room', loc: 'Int. Studio A — Night', status: 'Pending', color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.05)' },
              { num: 'SC 17', name: 'Hospital reveal', loc: "Int. St. Mary's — Day", status: 'Pending', color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.05)' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, border: '0.5px solid rgba(255,255,255,0.06)', marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', width: 30 }}>{s.num}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{s.loc}</div>
                </div>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: s.bg, color: s.color, fontWeight: 500 }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  )
}