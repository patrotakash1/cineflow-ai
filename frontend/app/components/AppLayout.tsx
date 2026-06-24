'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const navItems = [
  { icon: '📊', label: 'Dashboard', href: '/dashboard' },
  { icon: '📄', label: 'Script Analyzer', href: '/script' },
  { icon: '🎥', label: 'Shot List', href: '/shotlist' },
  { icon: '📅', label: 'Schedule', href: '/schedule' },
  { icon: '💰', label: 'Budget', href: '/budget' },
  { icon: '👥', label: 'Crew', href: '/crew' },
  { icon: '🔧', label: 'Equipment', href: '/equipment' },
  { icon: '📋', label: 'Daily Reports', href: '/reports' },
  { icon: '🧠', label: 'AI Copilot', href: '/copilot' },
  { icon: '📊', label: 'Analytics', href: '/analytics' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  const Sidebar = () => (
    <div style={{
      width: 220, background: '#0a0a0f',
      borderRight: '0.5px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 0', height: '100%',
      position: isMobile ? 'fixed' : 'relative',
      top: 0, left: 0, zIndex: 100,
      transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
      transition: 'transform 0.25s ease',
    }}>
      <div style={{ padding: '0 16px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: '#C9A84C', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎬</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>CineFlow</div>
              <div style={{ fontSize: 10, color: '#C9A84C', letterSpacing: 1.5 }}>PRODUCTION OS</div>
            </div>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20 }}>✕</button>
          )}
        </div>
      </div>
      <nav style={{ padding: '12px 8px', flex: 1, overflowY: 'auto' }}>
        {navItems.map((item, i) => {
          const isActive = currentPath === item.href
          return (
            <div key={i} onClick={() => { router.push(item.href); if (isMobile) setSidebarOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '8px 8px', borderRadius: 6, cursor: 'pointer', marginBottom: 2,
                background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: isActive ? '#C9A84C' : 'rgba(255,255,255,0.5)',
                fontSize: 13, transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLDivElement).style.color = '#fff' } }}
              onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = 'rgba(255,255,255,0.5)' } }}
            >
              <span>{item.icon}</span>{item.label}
            </div>
          )
        })}
      </nav>
      <div style={{ padding: '12px 16px', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{user?.full_name || 'User'}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8, textTransform: 'capitalize' }}>{user?.role || 'crew_member'}</div>
        <button onClick={logout} style={{ fontSize: 11, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Sign out</button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080810', color: '#fff' }}>
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99 }} />
      )}

      {/* Sidebar */}
      {!isMobile && <div style={{ width: 220, flexShrink: 0 }}><Sidebar /></div>}
      {isMobile && <Sidebar />}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ background: '#0a0a0f', borderBottom: '0.5px solid rgba(255,255,255,0.06)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: '#C9A84C', cursor: 'pointer', fontSize: 22 }}>☰</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, background: '#C9A84C', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🎬</div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>CineFlow</span>
            </div>
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  )
}