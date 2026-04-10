"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

export default function OffersPage() {
  const { data: session } = useSession();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = session?.user as any;
    if (!user?.orgId) return;
    
    const fetchOffers = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("aid_offers")
        .select("*, cases(category, city)")
        .eq("ngo_id", user.orgId)
        .order("created_at", { ascending: false });

      if (data) setOffers(data);
      setLoading(false);
    };
    
    fetchOffers();
  }, [session]);

  const markDelivered = async (offerId: string) => {
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delivered", notes: "Delivered manually via dashboard." }),
      });
      if (res.ok) {
        setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: "delivered" } : o));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-gray-500">Loading offers...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F9F6F2]">
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Your offer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date offered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map(offer => (
              <TableRow key={offer.id}>
                <TableCell className="font-mono text-xs font-semibold">{offer.case_id}</TableCell>
                <TableCell className="capitalize">{offer.cases?.category}</TableCell>
                <TableCell className="capitalize">{offer.offer_type.replace('_', ' ')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium 
                    ${offer.status === 'delivered' ? 'bg-[#E1F5EE] text-[#085041]' : 
                      offer.status === 'accepted' ? 'bg-[#EEEDFE] text-[#3C3489]' : 
                      offer.status === 'pending' ? 'bg-amber-50 text-amber-700' : 
                      'bg-gray-100 text-gray-700'}`}>
                    {offer.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-[#888780]">{formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}</TableCell>
                <TableCell className="text-right">
                  {offer.status === 'accepted' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-[#1D9E75] text-[#1D9E75] hover:bg-[#1D9E75] hover:text-white h-7 text-xs"
                      onClick={() => markDelivered(offer.id)}
                    >
                      Mark delivered
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
