import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { anonymousId, flagType, crisisCategory, sessionId } = await req.json();

    if (!anonymousId) {
      return NextResponse.json({ error: "Missing anonymousId" }, { status: 400 });
    }

    // Insert into crisis_flags table
    await supabaseAdmin.from("crisis_flags").insert({
      anonymous_id: anonymousId,
      flag_type: flagType,
      crisis_category: crisisCategory,
      session_id: sessionId
    });

    // We can potentially trigger an async job or alert here
    console.log(`CRISIS FLAG SAVED: type=${crisisCategory}, method=${flagType}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
