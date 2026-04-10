import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { setSessionUserId } from '@/lib/session';

export async function POST() {
  try {
    const user = await prisma.user.create({
      data: { isAnonymous: true }
    });
    setSessionUserId(user.id);
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
