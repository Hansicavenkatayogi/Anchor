'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type HelpRequest = {
  id: string;
  name: string;
  age: number;
  description: string;
  category: string;
  status: string;
  createdAt: string;
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  
  async function fetchRequests() {
    const res = await fetch('/api/help');
    const data = await res.json();
    setRequests(data);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (email === 'admin@anchor.com' && password === 'admin123') {
      setIsLoggedIn(true);
      fetchRequests();
    } else {
      alert('Invalid admin credentials');
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    });
    fetchRequests();
  }

  if (!isLoggedIn) {
    return (
      <>
        <header className="header">
          <h1>Admin Login</h1>
          <Link href="/" className="header-nav">Home</Link>
        </header>
        <main className="main-content">
          <div className="card">
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-input" required />
              </div>
              <button type="submit" className="btn">Access Dashboard</button>
            </form>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <header className="header" style={{ padding: '15px' }}>
        <h1 style={{ fontSize: '20px' }}>Admin Dashboard</h1>
        <button onClick={() => setIsLoggedIn(false)} className="header-nav" style={{ border: 'none', background: 'none' }}>Logout</button>
      </header>
      
      <main className="main-content" style={{ padding: '15px 10px', maxWidth: '100%', margin: '0 auto' }}>
        <div style={{ overflowX: 'auto', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User Details</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td style={{ fontSize: '13px' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontSize: '13px' }}>
                    {req.name ? `${req.name} (${req.age || '?'})` : 'Anonymous'}
                  </td>
                  <td style={{ fontSize: '13px' }}>{req.category}</td>
                  <td style={{ fontSize: '13px', maxWidth: '200px' }}>{req.description}</td>
                  <td>
                    <span className={`badge bg-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="form-select" 
                      style={{ padding: '4px 8px', fontSize: '12px', minWidth: '100px' }}
                      value={req.status}
                      onChange={(e) => updateStatus(req.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
