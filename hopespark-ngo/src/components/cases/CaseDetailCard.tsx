import { CategoryBadge, UrgencyDot } from "@/components/ui/badges";
import { format } from "date-fns";

export function CaseDetailCard({ caseData, activity }: { caseData: any, activity: any[] }) {
  if (!caseData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold font-mono tracking-tight text-[#2C2C2A]">{caseData.id}</h2>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
            {caseData.status_label || "Submitted"}
          </span>
        </div>
        <p className="text-sm text-[#888780]">
          Submitted {format(new Date(caseData.submitted_at), "PPP 'at' p")}
        </p>
      </div>

      {/* Need overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#2C2C2A]">Need overview</h3>
        <div className="flex gap-4 items-center">
          <CategoryBadge category={caseData.category} label={caseData.category_label || caseData.category} />
          <UrgencyDot urgency={caseData.urgency} />
        </div>
        
        <div className={`p-5 rounded-xl text-base italic leading-relaxed 
          ${caseData.category === "food" ? "bg-[#E1F5EE]/50 text-[#085041]" : 
            caseData.category === "school" ? "bg-[#EEEDFE]/50 text-[#3C3489]" : 
            caseData.category === "health" ? "bg-red-50/50 text-red-900" : 
            "bg-gray-50 text-gray-800"}`}
        >
          "{caseData.description}"
        </div>
      </div>

      {/* Context Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#2C2C2A]">Context</h3>
        <div className="grid grid-cols-2 gap-3">
          <ContextBox label="Location" value={`${caseData.city}, ${caseData.state}`} />
          <ContextBox label="Family Situation" value={caseData.family_situation} />
          <ContextBox label="Age Group" value={caseData.age_group} />
          <ContextBox label="Identifier" value={caseData.anonymous_id} isMono />
        </div>
        <div className="p-3 bg-white border border-gray-100 rounded-lg flex justify-between items-center">
          <span className="text-sm text-[#5F5E5A] font-medium">Contact info provided?</span>
          <span className={`text-sm font-bold ${caseData.has_contact ? "text-[#1D9E75]" : "text-[#888780]"}`}>
            {caseData.has_contact ? "Yes (released on match)" : "No (anonymous only)"}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h3 className="text-lg font-bold text-[#2C2C2A]">Activity timeline</h3>
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {activity.map((item, index) => (
            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 
                ${item.actor_type === 'ngo' ? 'bg-[#1D9E75]' : item.actor_type === 'child_app' ? 'bg-[#7F77DD]' : 'bg-gray-400'}`}>
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-sm text-[#2C2C2A] capitalize">{item.action.replace('_', ' ')}</div>
                  <time className="text-xs font-medium text-[#888780]">{format(new Date(item.created_at), "MMM d, HH:mm")}</time>
                </div>
                {item.metadata?.notes && <div className="text-sm text-[#5F5E5A]">{item.metadata.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContextBox({ label, value, isMono = false }: { label: string, value: string, isMono?: boolean }) {
  return (
    <div className="p-3 bg-white border border-gray-100 rounded-lg">
      <div className="text-xs text-[#888780] mb-1">{label}</div>
      <div className={`text-sm text-[#2C2C2A] ${isMono ? 'font-mono uppercase font-semibold' : 'font-medium'}`}>
        {value}
      </div>
    </div>
  );
}
