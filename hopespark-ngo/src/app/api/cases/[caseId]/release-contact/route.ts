import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.HOPESPARK_SYNC_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized sync token" }, { status: 401 });
    }

    const { caseId, contactInfo, declined } = await req.json();

    if (declined) {
      await supabaseAdmin.from("case_activity_log").insert({
        case_id: caseId,
        actor_type: "child_app",
        action: "contact_declined"
      });
      return NextResponse.json({ success: true, status: "declined" });
    }

    // Accept flow
    if (contactInfo) {
      const decodedContact = Buffer.from(contactInfo, 'base64').toString('utf-8');
      
      // Look up who is assigned
      const { data: caseData } = await supabaseAdmin.from("cases").select("assigned_ngo_id").eq("id", caseId).single();
      if (!caseData || !caseData.assigned_ngo_id) {
        return NextResponse.json({ error: "Case not matched yet" }, { status: 400 });
      }

      const { data: ngo } = await supabaseAdmin.from("ngo_organizations").select("contact_email").eq("id", caseData.assigned_ngo_id).single();
      
      if (ngo?.contact_email) {
        // Pseudo email send using Resend. (Commented out in MVP since we don't have API keys).
        console.log(`[SECURE EMAIL MOCK] Sending contact info to ${ngo.contact_email}`);
        console.log(`Subject: HopeSpark — Contact released for case ${caseId}`);
        console.log(`Body: A child accepted your aid offer. Contact: ${decodedContact}`);
      }

      // Mark as released
      await supabaseAdmin.from("cases").update({ contact_released: true }).eq("id", caseId);

      await supabaseAdmin.from("case_activity_log").insert({
        case_id: caseId,
        actor_type: "child_app",
        action: "contact_released",
      });

      return NextResponse.json({ success: true, status: "released" });
    }

    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
