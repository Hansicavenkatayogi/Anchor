import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.HOPESPARK_SYNC_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, caseId } = await req.json();
    if (!text || !caseId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In a real app, this would call Anthropic or Perspective API to score the text.
    // For local MVP, we simulate a latency and simple keyword check matching our business rules for "Requires NGO Review".
    
    let isFlagged = false;
    let reason = [];

    const lower = text.toLowerCase();
    
    // Check for extreme violence or abuse patterns
    if (/gun|shoot|kill|murder|stab/.test(lower)) {
      isFlagged = true;
      reason.push("violence_or_extreme_danger");
    }

    if (/rape|traffick|sell me|sold/.test(lower)) {
      isFlagged = true;
      reason.push("severe_abuse_or_trafficking");
    }

    // Check for spam or nonsense
    if (text.length > 1000) {
      isFlagged = true;
      reason.push("spam_length_exceeded");
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (isFlagged) {
      // Create flag in DB
      await supabaseAdmin.from('moderation_flags').insert({
        case_id: caseId,
        ai_flags: reason,
        ai_reason: "Automated server-side text screening caught high-risk patterns."
      });

      // Update case to be in moderation
      await supabaseAdmin.from('cases').update({ moderation_status: 'flagged' }).eq('id', caseId);

      return NextResponse.json({ flagged: true, reason });
    }

    // If perfectly safe
    await supabaseAdmin.from('cases').update({ moderation_status: 'passed' }).eq('id', caseId);
    
    return NextResponse.json({ flagged: false });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
