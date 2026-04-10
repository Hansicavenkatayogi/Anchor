import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUserId } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { mood } = await req.json();
    const userId = getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const moodLog = await prisma.moodLog.create({
      data: {
        mood,
        userId
      }
    });

    return NextResponse.json({ success: true, moodLog });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to log mood' }, { status: 500 });
  }
}
