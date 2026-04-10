import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    const updatedRequest = await prisma.helpRequest.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, updatedRequest });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
