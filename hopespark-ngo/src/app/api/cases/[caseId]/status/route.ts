import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: { caseId: string } }) {
  try {
    const { data, error } = await supabaseAdmin
      .from("cases")
      .select("status, status_label, status_progress, assigned_ngo_id, ngo_organizations(name)")
      .eq("id", params.caseId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: data.status,
      statusLabel: data.status_label,
      statusProgress: data.status_progress,
      assignedNGO: (data.ngo_organizations as { name?: string })?.name || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
