"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NGOVerifyPage() {
  const [apps, setApps] = useState<any[]>([]);

  // Dummy data for MVP demonstration
  useEffect(() => {
    setApps([
      { id: "1", org_name: "Mumbai Child Relief", reg_no: "80G-12345", city: "Mumbai", contact: "Anita R.", date: new Date().toISOString() },
      { id: "2", org_name: "EduCare Foundation", reg_no: "12A-98765", city: "Delhi", contact: "Rajiv S.", date: new Date().toISOString() }
    ]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2C2C2A] tracking-tight">Partner Verification</h1>
        <p className="text-[#5F5E5A] mt-1">Review and approve new NGO registrations.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Registration No.</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-bold text-[#1D9E75]">{a.org_name}</TableCell>
                <TableCell className="font-mono text-sm">{a.reg_no}</TableCell>
                <TableCell>{a.city}</TableCell>
                <TableCell>{a.contact}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">Request Docs</Button>
                  <Button size="sm">Approve</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
