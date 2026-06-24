'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API = '${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/ai'

const SUGGESTIONS = [
  'How can I reduce my shooting budget for Shadows of Tomorrow?',
  'Suggest a shooting order for 5 exterior night scenes',
  'What equipment do I need for a low-budget thriller?',
  'Generate a call sheet template for tomorrow',
  'How many shoot days do I need for a 90-page script?',
  'Tips for shooting in Mumbai on a tight budget',
]

export default function CopilotPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Hi! I am CineFlow AI Copilot powered by Llama 3.3 70B via Groq. Ask me anything about your film production — script breakdown, scheduling, budgeting, crew, or equipment. How can I help with Shadows of Tomorrow today?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login')
      return
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const msg = text || input.trim()
    if (!msg || loading) return

    const userMsg = { role: 'user', content: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(API + '/chat', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
        body: JSON.stringify({
          message: msg,
          history: newMessages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Error')
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Make sure the backend is running at localhost:8000.'
      }])
    }
    setLoading(false)
  }

  async function analyzeScript() {
    if (!file) return
    setAnalyzing(true)
    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch(API + '/analyze-script', {
        method: 'POST',
        body: form
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Error')

      const a = data.analysis
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Script analyzed successfully!\n\n📄 Total Scenes: ${a.total_scenes}\n👥 Characters: ${a.characters?.join(', ')}\n📍 Locations: ${a.locations?.join(', ')}\n🎬 Estimated Shoot Days: ${a.estimated_shoot_days}\n💰 Budget Estimate: ₹${(a.budget_estimate_inr / 100000).toFixed(1)}L\n\nWant me to generate a detailed shooting schedule or breakdown report?`
      }])
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Could not analyze the script. Please upload a valid PDF or TXT file.'
      }])
    }
    setAnalyzing(false)
    setFile(null)
  }

  return (
    <div style={{
      background: '#080810',
      color: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'sans-serif'
    }}>

      {/* Header */}
      <div style={{
        background: '#0a0a0f',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0
      }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: '#C9A84C',
            cursor: 'pointer',
            fontSize: 13
          }}
        >
          ← Dashboard
        </button>
        <div style={{
          width: 32,
          height: 32,
          background: 'rgba(201,168,76,0.15)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16
        }}>🧠</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>AI Copilot</div>
          <div style={{ fontSize: 11, color: '#4ade80' }}>● Llama 3.3 70B · Groq · Free</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
          Shadows of Tomorrow
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 8,
            alignItems: 'flex-start'
          }}>
            {m.role === 'assistant' && (
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'rgba(201,168,76,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                flexShrink: 0,
                marginTop: 2
              }}>🧠</div>
            )}
            <div style={{
              maxWidth: '75%',
              padding: '10px 14px',
              borderRadius: m.role === 'user'
                ? '14px 14px 2px 14px'
                : '14px 14px 14px 2px',
              background: m.role === 'user'
                ? '#C9A84C'
                : 'rgba(255,255,255,0.06)',
              color: m.role === 'user' ? '#000' : '#fff',
              fontSize: 13,
              lineHeight: 1.65,
              whiteSpace: 'pre-wrap'
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'rgba(201,168,76,0.15)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 13
            }}>🧠</div>
            <div style={{
              padding: '10px 14px',
              borderRadius: '14px 14px 14px 2px',
              background: 'rgba(255,255,255,0.06)',
              fontSize: 13,
              color: 'rgba(255,255,255,0.4)'
            }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips — show only at start */}
      {messages.length === 1 && (
        <div style={{
          padding: '0 20px 14px',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap'
        }}>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              style={{
                background: 'rgba(201,168,76,0.08)',
                border: '0.5px solid rgba(201,168,76,0.2)',
                borderRadius: 20,
                padding: '5px 12px',
                color: '#C9A84C',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Script upload bar */}
      <div style={{
        padding: '8px 20px',
        background: '#0a0a0f',
        borderTop: '0.5px solid rgba(255,255,255,0.04)',
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255,255,255,0.05)',
          border: '0.5px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: '6px 12px',
          cursor: 'pointer',
          fontSize: 12,
          color: file ? '#C9A84C' : 'rgba(255,255,255,0.4)'
        }}>
          📄 {file ? file.name : 'Analyze script (PDF / TXT)'}
          <input
            type="file"
            accept=".pdf,.txt,.fountain"
            onChange={e => setFile(e.target.files?.[0] || null)}
            style={{ display: 'none' }}
          />
        </label>
        {file && (
          <button
            onClick={analyzeScript}
            disabled={analyzing}
            style={{
              background: '#C9A84C',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {analyzing ? 'Analyzing...' : 'Analyze →'}
          </button>
        )}
        {file && (
          <button
            onClick={() => setFile(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              fontSize: 16
            }}
          >×</button>
        )}
      </div>

      {/* Input bar */}
      <div style={{
        padding: '12px 20px',
        background: '#0a0a0f',
        borderTop: '0.5px solid rgba(255,255,255,0.06)',
        display: 'flex',
        gap: 8
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder="Ask about your shoot, budget, schedule, crew... (Enter to send)"
          style={{
            flex: 1,
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.06)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            color: '#fff',
            fontSize: 13,
            outline: 'none'
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() ? '#C9A84C' : 'rgba(201,168,76,0.3)',
            color: '#000',
            border: 'none',
            borderRadius: 10,
            padding: '10px 20px',
            fontSize: 13,
            fontWeight: 500,
            cursor: input.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}