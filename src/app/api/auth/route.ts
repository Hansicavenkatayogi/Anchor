import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { setSessionUserId } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { action, username, password } = await req.json();

    if (action === 'signup') {
      const existingUser = await prisma.user.findUnique({ where: { username } });
      if (existingUser) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
      }
      const user = await prisma.user.create({
        data: { username, password, isAnonymous: false }
      });
      setSessionUserId(user.id);
      return NextResponse.json({ success: true, userId: user.id });
    }

    if (action === 'login') {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || user.password !== password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      setSessionUserId(user.id);
      return NextResponse.json({ success: true, userId: user.id });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
