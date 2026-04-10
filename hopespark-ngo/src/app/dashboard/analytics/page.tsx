"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const categoryData = [
  { name: 'Food', cases: 45 },
  { name: 'School', cases: 30 },
  { name: 'Health', cases: 25 },
  { name: 'Clothes', cases: 15 },
  { name: 'Shelter', cases: 10 },
  { name: 'Other', cases: 5 },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-[#888780] font-medium font-sans">Children Helped Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#1D9E75]">128</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-[#888780] font-medium font-sans">Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#7F77DD]">4.2<span className="text-xl text-[#888780] font-medium ml-1">hrs</span></div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-[#888780] font-medium font-sans">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#2C2C2A]">92%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#2C2C2A]">Cases by Category (Local area)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip cursor={{fill: '#F9F6F2'}} />
                <Bar dataKey="cases" fill="#1D9E75" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="p-8 bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-xl text-center">
        <h2 className="text-2xl font-bold text-[#085041] mb-2">Your organization has helped 128 children.</h2>
        <p className="text-[#1D9E75]">Across Hyderabad over the last 6 months.</p>
      </div>
    </div>
  );
}
