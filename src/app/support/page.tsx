'use client';
import { useState } from 'react';
import Link from 'next/link';

type Message = { id: string; sender: 'user' | 'bot'; text: string };

export default function SupportPage() {
  const [mood, setMood] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: "Hi there! I'm here to listen. How are you feeling right now?" }
  ]);
  const [input, setInput] = useState('');

  async function handleMoodSelect(selectedMood: string) {
    setMood(selectedMood);
    try {
      await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood })
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      const data = await res.json();
      
      const botMessage: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <header className="header">
        <h1>Emotional Support</h1>
        <Link href="/" className="header-nav">Home</Link>
      </header>
      
      <main className="main-content" style={{ padding: '20px 15px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>How are you feeling today?</h3>
          <div className="mood-grid">
            {['Happy', 'Sad', 'Stressed', 'Angry'].map(m => (
              <button 
                key={m}
                onClick={() => handleMoodSelect(m)}
                className={`mood-btn ${mood === m ? 'selected' : ''}`}
              >
                {m === 'Happy' && '😊'}
                {m === 'Sad' && '😢'}
                {m === 'Stressed' && '😰'}
                {m === 'Angry' && '😡'}
                <span>{m}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="chat-container">
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form className="chat-input-area" onSubmit={sendMessage}>
            <input 
              type="text" 
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit" className="chat-send">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
