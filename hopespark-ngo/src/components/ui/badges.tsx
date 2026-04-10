import { Badge } from "@/components/ui/badge";

export function UrgencyDot({ urgency }: { urgency: string }) {
  let color = "bg-[#888780]"; // low (gray)
  if (urgency === "high") color = "bg-[#E24B4A]"; // high (red)
  if (urgency === "medium") color = "bg-[#BA7517]"; // medium (amber)

  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="capitalize text-sm font-medium text-[#5F5E5A]">{urgency}</span>
    </div>
  );
}

export function CategoryBadge({ category, label }: { category: string, label: string }) {
  let bg = "bg-gray-100";
  let text = "text-gray-800";

  switch (category) {
    case "food": bg = "bg-[#E1F5EE]"; text = "text-[#085041]"; break;
    case "school": bg = "bg-[#EEEDFE]"; text = "text-[#3C3489]"; break;
    case "health": bg = "bg-red-50"; text = "text-red-900"; break;
    case "clothes": bg = "bg-orange-50"; text = "text-orange-900"; break;
    case "shelter": bg = "bg-blue-50"; text = "text-blue-900"; break;
  }

  return (
    <Badge variant="outline" className={`border-0 font-semibold ${bg} ${text}`}>
      {label}
    </Badge>
  );
}
