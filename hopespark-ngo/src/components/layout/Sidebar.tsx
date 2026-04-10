"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, HandHeart, BarChart3, MessageSquare, Settings, LogOut, ShieldAlert, BadgeCheck, Shield, Users } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const navItems = [
    { name: "Cases", href: "/dashboard", icon: LayoutDashboard, color: "text-[#1D9E75]" },
    { name: "Aid offers", href: "/dashboard/offers", icon: HandHeart, color: "text-[#7F77DD]" },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, color: "text-[#BA7517]" },
    { name: "Moderation Queue", href: "/dashboard/moderation", icon: Shield, color: "text-red-500" },
    { name: "Partner Verification", href: "/dashboard/verify", icon: Users, color: "text-purple-500" },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare, color: "text-blue-500", disabled: true },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, color: "text-gray-400" },
  ];

  return (
    <div className="w-64 bg-[#1D1A3A] text-white flex flex-col hidden md:flex h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#7F77DD] flex items-center justify-center relative">
          <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-1.5 right-1.5" />
        </div>
        <span className="font-bold text-xl tracking-tight">NGO Portal</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.name === "Cases" && pathname.startsWith("/dashboard/cases"));
          return (
            <Link
              key={item.name}
              href={item.disabled ? "#" : item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? "bg-white/10 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"
              } ${item.disabled && "opacity-50 cursor-not-allowed"}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? item.color : "text-current"}`} />
              {item.name}
              {item.disabled && <span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">Soon</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="font-medium text-sm truncate">{session?.user?.name || "Verified NGO"}</p>
          <p className="text-xs text-gray-400 mb-3 truncate">{(session?.user as any)?.city || "Unknown City"}, {(session?.user as any)?.state || "Unknown State"}</p>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-300">
              <span>Capacity</span>
              <span>14 / 20</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#1D9E75] rounded-full" style={{ width: "70%" }} />
            </div>
          </div>
          
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mt-4 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
