import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUserId } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { name, age, description, category, consentGiven } = await req.json();
    const userId = getSessionUserId();

    const helpRequest = await prisma.helpRequest.create({
      data: {
        name,
        age,
        description,
        category,
        consentGiven,
        userId: userId || null
      }
    });

    return NextResponse.json({ success: true, helpRequest });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit help request' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const requests = await prisma.helpRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
