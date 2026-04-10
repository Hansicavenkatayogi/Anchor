import { supabaseAdmin } from "@/lib/supabase";
import { CaseDetailCard } from "@/components/cases/CaseDetailCard";
import { AidOfferForm } from "@/components/cases/AidOfferForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CaseDetailPage({ params }: { params: { caseId: string } }) {
  // Fetch case
  const { data: caseData, error: caseError } = await supabaseAdmin
    .from("cases")
    .select("*")
    .eq("id", params.caseId)
    .single();

  if (caseError || !caseData) {
    notFound();
  }

  // Fetch activity log
  const { data: activity } = await supabaseAdmin
    .from("case_activity_log")
    .select("*")
    .eq("case_id", params.caseId)
    .order("created_at", { ascending: false });

  // Has other offers?
  const { count: offerCount } = await supabaseAdmin
    .from("aid_offers")
    .select("*", { count: "exact", head: true })
    .eq("case_id", params.caseId);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#888780] hover:text-[#2C2C2A] font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to cases
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CaseDetailCard caseData={caseData} activity={activity || []} />
          
          {offerCount && offerCount > 0 ? (
            <div className="mt-8 p-4 bg-purple-50 rounded-lg text-[#3C3489] text-sm">
              <span className="font-semibold block mb-1">Other offers</span>
              {offerCount} other organization{offerCount === 1 ? '' : 's'} {offerCount === 1 ? 'has' : 'have'} offered help on this case.
            </div>
          ) : null}
        </div>
        
        <div className="lg:col-span-1">
          <AidOfferForm caseId={params.caseId} status={caseData.status} />
        </div>
      </div>
    </div>
  );
}
