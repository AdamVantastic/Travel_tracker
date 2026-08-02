"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Globe2, LayoutDashboard, Heart, List, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/map", label: "Map", icon: Globe2 },
  { href: "/countries", label: "Countries", icon: List },
  { href: "/favorites", label: "Favorites", icon: Heart },
];

type AppSidebarProps = {
  devMode?: boolean;
};

export function AppSidebar({ devMode = false }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Globe2 className="h-6 w-6 text-teal-600" />
          <span className="text-lg font-bold tracking-tight">Travel Tracker</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-teal-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          {devMode ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <User className="h-4 w-4" />
            </div>
          ) : (
            <UserButton />
          )}
          <span className="text-xs text-zinc-500">
            {devMode ? "Demo user" : "Account"}
          </span>
        </div>
      </div>
    </aside>
  );
}
