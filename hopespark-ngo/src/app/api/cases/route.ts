import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.HOPESPARK_SYNC_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized sync token" }, { status: 401 });
    }

    const caseData = await req.json();
    
    // Check if it exists
    const { data: existing } = await supabaseAdmin.from("cases").select("id").eq("id", caseData.id).single();
    
    if (existing) {
      return NextResponse.json({ success: true, caseId: caseData.id, status: "exists" });
    }

    // Insert case
    const { error: insertError } = await supabaseAdmin.from("cases").insert({
      id: caseData.id,
      category: caseData.category,
      category_label: caseData.categoryLabel,
      description: caseData.description,
      urgency: caseData.urgency,
      city: caseData.city,
      state: caseData.state,
      family_situation: caseData.familySituation,
      has_contact: !!caseData.contactInfo,
      age_group: caseData.ageGroup,
      anonymous_id: caseData.anonymousId,
      status: "submitted",
      status_label: "Submitted",
      status_progress: 20,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Log activity
    await supabaseAdmin.from("case_activity_log").insert({
      case_id: caseData.id,
      actor_type: "child_app",
      action: "submitted",
      metadata: { source: "phase2_sync" }
    });

    return NextResponse.json({ success: true, caseId: caseData.id, status: "submitted" }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
