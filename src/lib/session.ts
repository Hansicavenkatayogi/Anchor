import { cookies } from 'next/headers';

export function getSessionUserId(): string | undefined {
  const cookieStore = cookies();
  const userId = cookieStore.get('anchor_session_id')?.value;
  return userId;
}

export function setSessionUserId(userId: string) {
  const cookieStore = cookies();
  cookieStore.set('anchor_session_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
}

export function clearSession() {
  cookies().delete('anchor_session_id');
}
