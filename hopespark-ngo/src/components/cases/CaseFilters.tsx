"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CaseFilters() {
  return (
    <div className="flex items-center gap-3">
      <Select defaultValue="all">
        <SelectTrigger className="w-[140px] h-9 text-sm">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          <SelectItem value="food">Food</SelectItem>
          <SelectItem value="health">Health</SelectItem>
          <SelectItem value="education">School</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all_urgency">
        <SelectTrigger className="w-[140px] h-9 text-sm">
          <SelectValue placeholder="Urgency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all_urgency">Any urgency</SelectItem>
          <SelectItem value="high">High urgency</SelectItem>
          <SelectItem value="medium">Medium urgency</SelectItem>
          <SelectItem value="low">Low urgency</SelectItem>
        </SelectContent>
      </Select>
      
      <Select defaultValue="open">
        <SelectTrigger className="w-[140px] h-9 text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open / Reviewing</SelectItem>
          <SelectItem value="matched">Matched (Active)</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="all">Any status</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
