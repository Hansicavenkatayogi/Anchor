import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(req: Request) {
  try {
    const { anonymousId } = await req.json();

    if (!anonymousId) {
      return NextResponse.json({ error: "Missing identity" }, { status: 400 });
    }

    // Delete all cases for this anonymousId
    // Supabase RLS bypass with Admin
    const { data: cases } = await supabaseAdmin.from("cases").select("id").eq("anonymous_id", anonymousId);
    
    if (cases && cases.length > 0) {
      const caseIds = cases.map(c => c.id);
      
      // Delete offers and logs first due to FK constraints
      await supabaseAdmin.from("aid_offers").delete().in("case_id", caseIds);
      await supabaseAdmin.from("case_activity_log").delete().in("case_id", caseIds);
      await supabaseAdmin.from("moderation_flags").delete().in("case_id", caseIds);
      
      // Delete cases
      await supabaseAdmin.from("cases").delete().in("id", caseIds);
    }

    // Delete pushes
    await supabaseAdmin.from("push_tokens").delete().eq("anonymous_id", anonymousId);
    await supabaseAdmin.from("crisis_flags").delete().eq("anonymous_id", anonymousId);
    await supabaseAdmin.from("notification_log").delete().eq("anonymous_id", anonymousId);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
