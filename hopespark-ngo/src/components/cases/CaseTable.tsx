"use client";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CaseRow } from "./CaseRow";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function CaseTable() {
  const { data: session } = useSession();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = session?.user as any;
    if (!user?.city) return;

    const fetchCases = async () => {
      setLoading(true);
      // Fetch cases in the NGO's city
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("city", user.city)
        .order("submitted_at", { ascending: false });
        
      if (!error && data) {
        setCases(data);
      }
      setLoading(false);
    };

    fetchCases();

    // Listen for new cases
    const channel = supabase
      .channel('public:cases')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cases', filter: `city=eq.${user.city}` }, payload => {
        setCases(prev => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cases', filter: `city=eq.${user.city}` }, payload => {
        setCases(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Loading cases...</div>;
  }

  if (cases.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-lg border border-gray-100 shadow-sm">
        <h3 className="text-lg font-medium text-[#2C2C2A] mb-1">No open cases</h3>
        <p className="text-[#888780] text-sm">There are currently no cases reported in {(session?.user as any)?.city}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-[#F9F6F2]">
          <TableRow>
            <TableHead className="w-[100px]">Case ID</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="w-[120px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((c) => (
            <CaseRow key={c.id} item={c} currentOrgId={(session?.user as any)?.orgId as string} />
          ))}
        </TableBody>
      </Table>
      
      <div className="p-4 border-t border-gray-100 bg-[#F9F6F2]/30 flex justify-end text-sm text-[#888780]">
        Showing {cases.length} cases
      </div>
    </div>
  );
}
