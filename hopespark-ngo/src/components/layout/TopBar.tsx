"use client";

import { useSession } from "next-auth/react";
import { Bell, RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";

export function TopBar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Open cases near you";
    if (pathname.startsWith("/dashboard/cases/")) return "Case Details";
    if (pathname === "/dashboard/offers") return "Aid Offers";
    if (pathname === "/dashboard/analytics") return "Analytics & Impact";
    if (pathname === "/dashboard/messages") return "Messages";
    if (pathname === "/dashboard/settings") return "Settings";
    return "Dashboard";
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-[#2C2C2A]">{getPageTitle()}</h1>
        {pathname === "/dashboard" && session?.user?.city && (
          <p className="text-xs text-[#888780]">{session.user.city} · Updated just now</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600 transition-colors p-2" title="Refresh">
          <RefreshCw className="w-5 h-5" />
        </button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors relative p-2">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E24B4A] rounded-full border border-white" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#1D1A3A] flex items-center justify-center text-white text-sm font-medium border border-gray-100 ml-2 shadow-sm">
          {session?.user?.name ? session.user.name.charAt(0) : "N"}
        </div>
      </div>
    </header>
  );
}
