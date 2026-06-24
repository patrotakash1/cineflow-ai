'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || 'Login failed'); return; }
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111111',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: '#1c1c1c',
        border: '1px solid #2a2a2a',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{
            width: '44px', height: '44px',
            background: '#C9A84C',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '18px', color: '#000'
          }}>C</div>
          <div>
            <p style={{ color: '#fff', fontWeight: '600', fontSize: '18px', margin: 0 }}>CineFlow</p>
            <p style={{ color: '#C9A84C', fontSize: '11px', letterSpacing: '0.1em', margin: 0 }}>PRODUCTION OS</p>
          </div>
        </div>

        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '600', margin: '0 0 6px' }}>Welcome back</h1>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 28px' }}>Sign in to your production dashboard</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#888', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="arjun@cineflow.com"
              required
              style={{
                width: '100%', background: '#111', border: '1px solid #2a2a2a',
                borderRadius: '8px', padding: '12px 14px', color: '#fff',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#888', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', background: '#111', border: '1px solid #2a2a2a',
                borderRadius: '8px', padding: '12px 14px', color: '#fff',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(220,50,50,0.15)', border: '1px solid #7f2020',
              color: '#f87171', fontSize: '13px', borderRadius: '8px',
              padding: '10px 14px', marginBottom: '16px'
            }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: '#C9A84C', color: '#000',
              fontWeight: '600', fontSize: '15px', padding: '13px',
              borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ color: '#444', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>
          CineFlow Production OS · Secure login
        </p>
      </div>
    </div>
  );
}