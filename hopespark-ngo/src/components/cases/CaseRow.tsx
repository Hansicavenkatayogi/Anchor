"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { UrgencyDot, CategoryBadge } from "@/components/ui/badges";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export function CaseRow({ item, currentOrgId }: { item: any, currentOrgId: string }) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/dashboard/cases/${item.id}`);
  };

  const getActionUI = () => {
    if (item.status === "submitted") {
      return <button className="text-sm font-semibold text-[#1D9E75] hover:underline">Offer help</button>;
    }
    if (item.status === "reviewing") {
      return <span className="text-sm font-medium text-[#BA7517] bg-amber-50 px-2 py-1 rounded">Under review</span>;
    }
    if (item.status === "matched") {
      if (item.assigned_ngo_id === currentOrgId) {
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-xs font-medium text-[#7F77DD] bg-[#EEEDFE] px-2 py-0.5 rounded">Active (Yours)</span>
          </div>
        );
      }
      return <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Matched</span>;
    }
    if (item.status === "resolved") {
      return <span className="text-sm font-medium text-[#1D9E75] bg-[#E1F5EE] px-2 py-1 rounded">Resolved ✓</span>;
    }
    return null;
  };

  const daysOpenText = formatDistanceToNow(new Date(item.submitted_at), { addSuffix: true });
  const isOld = new Date(item.submitted_at).getTime() < Date.now() - 3 * 24 * 60 * 60 * 1000;

  return (
    <TableRow 
      className="cursor-pointer hover:bg-[#F9F6F2]/50 transition-colors group"
      onClick={handleRowClick}
    >
      <TableCell className="font-mono text-xs font-semibold text-[#5F5E5A] group-hover:text-[#2C2C2A]">{item.id}</TableCell>
      <TableCell className="max-w-[200px] truncate text-sm italic text-[#5F5E5A]">"{item.description}"</TableCell>
      <TableCell><CategoryBadge category={item.category} label={item.category_label || item.category} /></TableCell>
      <TableCell><UrgencyDot urgency={item.urgency} /></TableCell>
      <TableCell className="text-sm text-[#2C2C2A]">{item.city}</TableCell>
      <TableCell className={`text-sm ${isOld ? 'text-[#E24B4A] font-medium' : 'text-[#888780]'}`}>
        {daysOpenText.replace('about ', '')}
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        {getActionUI()}
      </TableCell>
    </TableRow>
  );
}
