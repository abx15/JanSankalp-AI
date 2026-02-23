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
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-68 border-r bg-white hidden md:flex flex-col sticky top-0 h-screen">
        <SidebarContent
          role={role}
          pathname={pathname}
          sidebarItems={sidebarItems}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <SidebarContent
                    role={role}
                    pathname={pathname}
                    sidebarItems={sidebarItems}
                  />
                </SheetContent>
              </Sheet>
            </div>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full bg-muted/30 border border-transparent focus:bg-white focus:border-primary/20 pl-10 pr-4 py-2 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/5"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationCenter userId={session?.user?.id} />
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold shadow-sm overflow-hidden text-sm">
              {session?.user?.name?.[0] || "U"}
            </div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
function SidebarContent({ role, pathname, sidebarItems }: any) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-1 justify-center">
          <div className="relative w-8 h-8">
            <Image
              src="/logo.png"
              alt="JanSankalp AI Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg tracking-tight">JanSankalp</span>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground text-center opacity-70">
          {role === "ADMIN" ? "Governance Hub" : "Citizen Portal"}
        </p>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {sidebarItems.map((item: any) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-soft"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-primary",
              )}
            >
              <item.icon
                className={cn(
                  "w-4.5 h-4.5 transition-colors",
                  isActive
                    ? "text-white"
                    : "text-muted-foreground/70 group-hover:text-primary",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
          <p className="text-xs font-semibold text-primary/80 mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Connected Live
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
