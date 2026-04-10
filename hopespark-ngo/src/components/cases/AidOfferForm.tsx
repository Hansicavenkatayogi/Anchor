"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AidOfferForm({ caseId, status }: { caseId: string, status: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [offerType, setOfferType] = useState("");
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerType || !description || !timeline) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, offerType, offerDescription: description, timelineEstimate: timeline }),
      });
      
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (success || status === "matched") {
    return (
      <Card className="sticky top-20 border-[#1D9E75]/20 bg-[#E1F5EE]/50 shadow-sm">
        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
          <CheckCircle2 className="w-12 h-12 text-[#1D9E75] mb-4" />
          <h3 className="text-lg font-bold text-[#085041] mb-2">Offer submitted!</h3>
          <p className="text-sm text-[#1D9E75]">The child will be notified. Your organization is now matched with this case.</p>
          <Button 
            variant="outline" 
            className="mt-6 border-[#1D9E75] text-[#1D9E75] hover:bg-[#1D9E75] hover:text-white"
            onClick={() => router.push("/dashboard/offers")}
          >
            View My Offers
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "resolved") {
    return null; // Don't offer on resolved
  }

  return (
    <Card className="sticky top-20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-[#2C2C2A] flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-[#1D9E75]" />
          Offer your support
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2C2C2A]">How can you help?</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "food_parcel", label: "Food parcel" },
                { id: "school_supplies", label: "School items" },
                { id: "medical", label: "Medical support" },
                { id: "clothing", label: "Clothing" },
                { id: "financial", label: "Financial aid" },
                { id: "other", label: "Other" },
              ].map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => setOfferType(opt.id)}
                  className={`p-2 border rounded-md text-sm text-center cursor-pointer transition-colors ${
                    offerType === opt.id 
                      ? "border-[#1D9E75] bg-[#E1F5EE] text-[#085041] font-semibold" 
                      : "border-gray-200 text-[#5F5E5A] hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2C2C2A]">Details of your offer</label>
            <Textarea 
              placeholder="Describe what you can provide, when, and how (e.g. 'Weekly food parcel delivered to school, starting Monday')"
              className="resize-none h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2C2C2A]">Can help within...</label>
            <Select value={timeline} onValueChange={(v: any) => setTimeline(v)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline estimate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24_hours">24 hours</SelectItem>
                <SelectItem value="2_3_days">2–3 days</SelectItem>
                <SelectItem value="1_week">Within a week</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#1D9E75] hover:bg-[#085041] text-white"
            disabled={loading || !offerType || !timeline || !description}
          >
            {loading ? "Submitting..." : "Submit aid offer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
