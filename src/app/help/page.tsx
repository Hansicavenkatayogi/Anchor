'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function HelpPage() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Emotional');
  const [consentGiven, setConsentGiven] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch('/api/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          age: age ? parseInt(age) : null, 
          description, 
          category, 
          consentGiven 
        })
      });
      
      if (res.ok) {
        setStatus('success');
        setDescription('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <>
        <header className="header">
          <h1>Request Help</h1>
          <Link href="/" className="header-nav">Home</Link>
        </header>
        <main className="main-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>💚</div>
          <h2 style={{ marginBottom: '10px' }}>Request Received</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Thank you for reaching out. A support representative will review your request and get back to you shortly.
          </p>
          <button className="btn" onClick={() => setStatus('idle')}>Submit Another Request</button>
        </main>
      </>
    );
  }

  return (
    <>
      <header className="header">
        <h1>Ask for Help</h1>
        <Link href="/" className="header-nav">Home</Link>
      </header>
      
      <main className="main-content">
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '10px' }}>
          Fill out this form to request assistance from our support team.
        </p>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="How should we call you?"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Age (Optional)</label>
              <input 
                type="number" 
                className="form-input" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
                placeholder="e.g. 15"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Emotional">Emotional Support</option>
                <option value="Education">Educational Help</option>
                <option value="Financial">Financial Assistance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Describe your problem (Required)</label>
              <textarea 
                className="form-textarea" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                placeholder="Please share what you need help with in a few sentences..."
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '20px' }}>
              <input 
                type="checkbox" 
                id="consent" 
                checked={consentGiven} 
                onChange={(e) => setConsentGiven(e.target.checked)} 
                required 
                style={{ width: '20px', height: '20px', marginTop: '2px' }}
              />
              <label htmlFor="consent" style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                I agree to share my data securely with Anchor's support organizations to receive assistance.
              </label>
            </div>

            {status === 'error' && <p className="error-text">Failed to submit. Please try again.</p>}
            
            <button 
              type="submit" 
              className="btn" 
              style={{ marginTop: '20px' }}
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
