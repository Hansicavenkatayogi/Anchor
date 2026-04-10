"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ModerationQueuePage() {
  const [flags, setFlags] = useState<any[]>([]);

  // Dummy data for MVP demonstration
  useEffect(() => {
    setFlags([
      { id: "1", case_id: "CASE-492", flags: ["contact_sharing"], reason: "Shared phone number: 9876543210", date: new Date().toISOString(), ai: false },
      { id: "2", case_id: "CASE-812", flags: ["violence_or_extreme_danger"], reason: "Automated server-side text screening caught high-risk patterns.", date: new Date().toISOString(), ai: true }
    ]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2C2C2A] tracking-tight">Moderation Queue</h1>
        <p className="text-[#5F5E5A] mt-1">Review flagged cases before they enter the public NGO pool.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flags.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.case_id}</TableCell>
                <TableCell>
                  {f.ai ? <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">AI Server</Badge> : <Badge variant="outline">Client Pre-screen</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {f.flags.map((fl: string) => (
                      <Badge key={fl} variant="destructive" className="capitalize text-xs">{fl.replace(/_/g, ' ')}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600 max-w-xs truncate">{f.reason}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">Reject Content</Button>
                  <Button size="sm" className="bg-[#1D9E75] hover:bg-[#0F6E56]">Approve (False Alarm)</Button>
                </TableCell>
              </TableRow>
            ))}
            {flags.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">Queue is empty!</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
