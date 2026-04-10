"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NGOApplyPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Simulate API call for applying
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center shadow-lg border border-[#F3F4F6]">
          <h2 className="text-2xl font-bold text-[#2C2C2A] mb-4">Application Received!</h2>
          <p className="text-[#5F5E5A] mb-6">Our team will review your details and get back to you within 48 hours. Thank you for wanting to make a difference.</p>
          <Button onClick={() => window.location.href = "/"}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-[#E5E7EB]">
        <h1 className="text-3xl font-bold text-[#2C2C2A] mb-2">NGO Partner Application</h1>
        <p className="text-[#5F5E5A] mb-8">Join the HopeSpark network to provide verified, secure support to children in need.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-[#4B5563] mb-1 block">Organization Name</label>
              <Input name="orgName" required placeholder="e.g. Save The Children" />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#4B5563] mb-1 block">Registration No. (India)</label>
              <Input name="regNo" required placeholder="12A / 80G No." />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-[#4B5563] mb-1 block">City</label>
              <Input name="city" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#4B5563] mb-1 block">State</label>
              <Input name="state" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#4B5563] mb-1 block">Primary Contact Name</label>
            <Input name="contactName" required />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-[#4B5563] mb-1 block">Contact Email</label>
              <Input type="email" name="contactEmail" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#4B5563] mb-1 block">Contact Phone</label>
              <Input type="tel" name="contactPhone" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#4B5563] mb-1 block">Organization Purpose</label>
            <Textarea name="description" required className="min-h-[100px]" placeholder="Briefly describe what support you can offer..." />
          </div>

          <div className="bg-[#FEF3C7] p-4 rounded-xl border border-[#FDE68A]">
            <p className="text-sm text-[#92400E] font-semibold">Verification Process</p>
            <p className="text-xs text-[#92400E] mt-1">Our admin team will manually verify your registration against the NGO Darpan database before approval. Verification takes 1-2 business days.</p>
          </div>

          <Button type="submit" className="w-full h-12 text-lg">Submit Application</Button>
        </form>
      </div>
    </div>
  );
}
