"use client";

import { Card } from "@/components/ui/card";
import { CaseTable } from "@/components/cases/CaseTable";
import { CaseFilters } from "@/components/cases/CaseFilters";
import { ArrowRight, ExternalLink, HeartHandshake, AlertCircle } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Stat Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-sm font-medium text-[#5F5E5A]">Open cases</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-[#2C2C2A]">24</span>
            <ExternalLink className="w-4 h-4 text-gray-300" />
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-between bg-red-50 border-red-100">
          <span className="text-sm font-medium text-red-800 flex items-center gap-2">
            High urgency
            <span className="w-2 h-2 rounded-full bg-[#E24B4A] animate-pulse" />
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-red-900">3</span>
            <AlertCircle className="w-4 h-4 text-red-300" />
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-between bg-[#EEEDFE] border-[#7F77DD]/20">
          <span className="text-sm font-medium text-[#3C3489]">Aid offered (month)</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-[#3C3489]">12</span>
            <HeartHandshake className="w-4 h-4 text-[#7F77DD]/50" />
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-between bg-[#E1F5EE] border-[#1D9E75]/20">
          <span className="text-sm font-medium text-[#085041]">Resolved total</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-[#085041]">86</span>
            <ArrowRight className="w-4 h-4 text-[#1D9E75]/50" />
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
          <CaseFilters />
          <button className="text-sm font-medium text-[#1D9E75] hover:text-[#085041] px-3 py-1.5 bg-[#1D9E75]/10 rounded-md transition-colors">
            Export CSV
          </button>
        </div>
        
        <CaseTable />
      </div>
    </div>
  );
}
