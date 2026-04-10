'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signup', username, password })
    });
    
    if (res.ok) {
      window.location.href = '/';
    } else {
      const data = await res.json();
      setError(data.error || 'Signup failed');
    }
  }

  return (
    <>
      <header className="header">
        <h1>Sign Up</h1>
        <Link href="/" className="header-nav">Home</Link>
      </header>
      
      <main className="main-content">
        <div className="card">
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-input" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            {error && <p className="error-text">{error}</p>}
            
            <button type="submit" className="btn" style={{ marginTop: '10px' }}>Sign Up</button>
          </form>
          
          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--accent-color)' }}>Log in</Link>
          </p>
        </div>
      </main>
    </>
  );
}
