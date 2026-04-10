import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !user || !user.orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { caseId, offerType, offerDescription, timelineEstimate } = await req.json();

    // 1. Insert into aid_offers
    const { data: offer, error: offerError } = await supabaseAdmin
      .from("aid_offers")
      .insert({
        case_id: caseId,
        ngo_id: user.orgId,
        ngo_user_id: user.id,
        offer_type: offerType,
        offer_description: offerDescription,
        status: "pending",
        notes: `Timeline: ${timelineEstimate}`
      })
      .select()
      .single();

    if (offerError) throw offerError;

    // 2. Update case status (if it's the first offer)
    const { data: caseObj } = await supabaseAdmin.from("cases").select("status").eq("id", caseId).single();
    
    if (caseObj?.status === "submitted" || caseObj?.status === "reviewing") {
      await supabaseAdmin.from("cases").update({
        status: "matched",
        status_label: "Helper Found",
        status_progress: 60,
        assigned_ngo_id: user.orgId
      }).eq("id", caseId);
      
      // Since it's matched to this NGO immediately for Phase 4 MVP:
      await supabaseAdmin.from("aid_offers").update({ status: "accepted", accepted_at: new Date().toISOString() }).eq("id", offer.id);
    }

    // 3. Log activity
    await supabaseAdmin.from("case_activity_log").insert({
      case_id: caseId,
      actor_type: "ngo",
      actor_id: user.orgId,
      action: "offer_made",
      metadata: { offer_type: offerType }
    });

    return NextResponse.json({ success: true, offerId: offer.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
