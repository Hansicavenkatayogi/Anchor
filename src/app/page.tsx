import Link from 'next/link';
import { getSessionUserId } from '@/lib/session';

export default function HomePage() {
  const userId = getSessionUserId();

  return (
    <>
      <header className="header">
        <h1>Anchor</h1>
        {userId ? (
          <form action="/api/auth/logout" method="POST" style={{ display: 'inline' }}>
            <button type="submit" className="header-nav" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>Logout</button>
          </form>
        ) : (
          <Link href="/login" className="header-nav">Log In</Link>
        )}
      </header>
      
      <main className="main-content" style={{ justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: '10px' }}>
            You are not alone.
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            A safe space for support and help whenever you need it.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link href={userId ? "/support" : "/login"} className="btn">
            Emotional Support
          </Link>
          <Link href={userId ? "/help" : "/login"} className="btn btn-secondary">
            Ask for Help
          </Link>
        </div>

        {!userId && (
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Want to remain anonymous?
            </p>
            <form action="/api/auth/anonymous" method="POST">
              <button type="submit" className="btn" style={{ background: 'var(--text-secondary)' }}>
                Continue Anonymously
              </button>
            </form>
          </div>
        )}
      </main>
    </>
  );
}
