"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Home,
  FileText,
  LayoutDashboard,
  User,
  MapPin,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const publicNavItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/features", icon: FileText, label: "Features" },
  { href: "/#report", icon: MapPin, label: "Report", highlight: true },
  { href: "/how-it-works", icon: Bell, label: "Guide" },
  { href: "/auth/signin", icon: User, label: "Login" },
];

const authNavItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/#report", icon: MapPin, label: "Report", highlight: true },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/my-reports", icon: FileText, label: "My Reports" },
  { href: "/dashboard/settings", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Don't show on dashboard pages (they have their own sidebar nav)
  if (pathname?.startsWith("/dashboard")) return null;
  // Don't show on auth pages
  if (pathname?.startsWith("/auth")) return null;

  const navItems = session ? authNavItems : publicNavItems;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[800] md:hidden">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800" />

      {/* Safe area padding */}
      <div className="relative z-10 flex items-center justify-around px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 relative min-w-[56px]",
                item.highlight
                  ? "bg-gradient-to-br from-orange-500 to-indigo-600 text-white shadow-lg shadow-orange-500/30 -translate-y-3 px-4 py-2"
                  : active
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              {active && !item.highlight && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10",
                  item.highlight ? "w-5 h-5" : "w-5 h-5"
                )}
              />
              <span
                className={cn(
                  "relative z-10 text-[10px] font-semibold leading-none",
                  item.highlight ? "text-white/90" : ""
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
