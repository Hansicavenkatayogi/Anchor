import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(req: Request, { params }: { params: { offerId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!session || !user || !user.orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, notes } = await req.json();

    // Verify ownership
    const { data: offer } = await supabaseAdmin.from("aid_offers").select("*").eq("id", params.offerId).single();
    if (!offer || offer.ngo_id !== user.orgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates: any = { status };
    if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }
    if (notes) {
      updates.notes = offer.notes ? `${offer.notes}\n${notes}` : notes;
    }

    await supabaseAdmin.from("aid_offers").update(updates).eq("id", params.offerId);

    // If delivered, mark case as resolved
    if (status === 'delivered') {
      await supabaseAdmin.from("cases").update({
        status: "resolved",
        status_label: "Resolved",
        status_progress: 100,
        resolved_at: new Date().toISOString()
      }).eq("id", offer.case_id);

      await supabaseAdmin.from("case_activity_log").insert({
        case_id: offer.case_id,
        actor_type: "ngo",
        actor_id: user.orgId,
        action: "resolved"
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
