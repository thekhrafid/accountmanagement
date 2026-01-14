"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { userMenu, adminMenu } from "@/config/sidebarMenu";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  const menu = session.user.role === "ADMIN" ? adminMenu : userMenu;

  return (
    <aside className="w-64 h-screen bg-gray-800 border-r border-slate-100 p-4 fixed top-0 left-0 z-40">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
          <div className="h-3 w-3 bg-white rounded-sm"></div>
        </div>
        <h1 className="text-xl font-bold text-gray-100 tracking-tighter">
          <a href="/">Account Managemener</a>
        </h1>
      </div>

      <nav className="space-y-2">
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded text-[13px] font-bold tracking-tight transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <item.icon
                className={`text-lg transition-colors ${
                  isActive ? "text-blue-600" : "opacity-50"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-8 left-8 right-8">
        <div className="p-4 w-full bg-slate-50 rounded border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Signed in as
          </p>
          <p className="text-xs font-bold text-slate-900 truncate">
            {session.user.email}
          </p>
        </div>
      </div>
    </aside>
  );
}
