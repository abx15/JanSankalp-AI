"use client";

import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  Bell,
  Search,
  Map as MapIcon,
  Award,
  ClipboardList,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";

const adminItems = [
  { icon: LayoutDashboard, label: "Governance", href: "/dashboard" },
  { icon: Shield, label: "Users", href: "/dashboard/users" },
  { icon: FileText, label: "Complaints", href: "/dashboard/complaints" },
  { icon: MapIcon, label: "Map View", href: "/dashboard/map" },
  { icon: Users, label: "Department", href: "/dashboard/department" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const citizenItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ClipboardList, label: "My Reports", href: "/dashboard/my-reports" },
  { icon: Award, label: "Rewards", href: "/dashboard/rewards" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // @ts-ignore
  const role = session?.user?.role || "CITIZEN";
  const sidebarItems = role === "ADMIN" ? adminItems : citizenItems;

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center justify-center mb-2">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-transparent rounded-lg flex items-center justify-center overflow-hidden p-1">
              <Image
                src="/logojansanklp.png"
                alt="JanSankalp AI Logo"
                width={96}
                height={96}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://img.icons8.com/color/160/government.png";
                }}
              />
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {role === "ADMIN" ? "Governance Hub" : "Citizen Portal"}
          </p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all",
                pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-card flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search complaints, regions..."
                className="w-full bg-muted/50 border border-transparent focus:border-primary/20 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <NotificationCenter userId={session?.user?.id} />
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
              {session?.user?.name?.[0] || "U"}
            </div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
