"use client";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  Search,
  Map as MapIcon,
  Award,
  ClipboardList,
  Shield,
  Menu,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { ChatBot } from "@/components/ai/ChatBot";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
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

const officerItems = [
  { icon: LayoutDashboard, label: "Command Center", href: "/dashboard" },
  { icon: ClipboardList, label: "Assigned Queue", href: "/dashboard/officer/complaints" },
  { icon: MapIcon, label: "Map View", href: "/dashboard/map" },
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
  const router = useRouter();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reset global body padding for dashboard pages
  useEffect(() => {
    const originalPadding = document.body.style.paddingTop;
    document.body.style.paddingTop = "0px";
    return () => {
      document.body.style.paddingTop = originalPadding;
    };
  }, []);

  // @ts-ignore
  const role = session?.user?.role || "CITIZEN";
  const sidebarItems = role === "ADMIN" ? adminItems : (role === "OFFICER" ? officerItems : citizenItems);

  // Construct Mobile Bottom Navigation Items
  let mobileBottomItems: any[] = [];
  if (role === "ADMIN") {
    mobileBottomItems = [
      { icon: LayoutDashboard, label: "Gov", href: "/dashboard" },
      { icon: Shield, label: "Users", href: "/dashboard/users" },
      { icon: FileText, label: "Reports", href: "/dashboard/complaints" },
      { icon: MoreHorizontal, label: "More", href: "#more", isTrigger: true },
    ];
  } else if (role === "OFFICER") {
    mobileBottomItems = [
      { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
      { icon: ClipboardList, label: "Queue", href: "/dashboard/officer/complaints" },
      { icon: MapIcon, label: "Map", href: "/dashboard/map" },
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ];
  } else {
    // CITIZEN
    mobileBottomItems = [
      { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
      { icon: ClipboardList, label: "Reports", href: "/dashboard/my-reports" },
      { icon: Award, label: "Rewards", href: "/dashboard/rewards" },
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ];
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950/20 text-foreground">
      {/* Sidebar for Desktop */}
      <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl hidden lg:flex flex-col sticky top-0 h-screen z-40">
        <SidebarContent
          role={role}
          pathname={pathname}
          sidebarItems={sidebarItems}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-250/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-sm shadow-slate-100/10">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Logo or Menu toggle for mobile */}
            <div className="lg:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              </Button>
              
              {/* Brand identifier on mobile top bar */}
              <Link href="/dashboard" className="flex items-center gap-1.5 ml-1">
                <Image
                  src="/logo.png"
                  alt="JanSankalp AI Logo"
                  width={24}
                  height={24}
                  className="object-contain animate-pulse"
                />
                <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-orange-500 to-indigo-600 text-transparent bg-clip-text">
                  JanSankalp
                </span>
              </Link>
            </div>

            {/* Dynamic Search Box (Desktop and Tablet) */}
            <div className="relative max-w-sm w-full hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <input
                type="search"
                placeholder="Search telemetry node..."
                className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500/30 pl-10 pr-4 py-2 rounded-xl text-xs transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5 font-semibold text-slate-650 dark:text-slate-350"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationCenter userId={session?.user?.id} />
            
            {/* User profile tag with dropdown or simple indicator */}
            <div className="flex items-center gap-2.5 pl-1.5 border-l border-slate-200/60 dark:border-slate-800/60">
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-orange-500/10 to-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black shadow-sm overflow-hidden text-xs uppercase relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                {session?.user?.name?.[0] || "U"}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {session?.user?.name || "User Account"}
                </span>
                <span className="text-[9px] font-black uppercase text-indigo-500 tracking-wider">
                  {role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer Sheet (Triggered by mobile menu button or bottom bar) */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64 border-r-0 bg-white dark:bg-slate-950 shadow-2xl">
            <SidebarContent
              role={role}
              pathname={pathname}
              sidebarItems={sidebarItems}
              onLinkClick={() => setIsMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Dashboard Main Workspace Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 pb-24 lg:pb-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>

        <ChatBot />

        {/* SaaS-Style Sticky Mobile Bottom Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-850/80 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] pb-safe-bottom">
          <div className="flex justify-around items-center h-16 px-2">
            {mobileBottomItems.map((item: any, idx: number) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
              
              if (item.isTrigger) {
                return (
                  <button
                    key={idx}
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 relative transition-all active:scale-90"
                  >
                    <item.icon className="w-5.5 h-5.5 mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 h-full py-1 relative transition-all active:scale-95",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
                      : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350"
                  )}
                >
                  <item.icon className="w-5.5 h-5.5 mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                  
                  {/* Glowing bottom indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="mobileNavActiveIndicator"
                      className="absolute bottom-1 w-5 h-1 bg-gradient-to-r from-orange-500 to-indigo-600 rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ role, pathname, sidebarItems, onLinkClick }: any) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      {/* Brand identity header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-900/60">
        <Link href="/dashboard" className="flex items-center gap-3 justify-center" onClick={onLinkClick}>
          <div className="relative w-9 h-9 hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="JanSankalp AI Logo"
              fill
              className="object-contain"
              sizes="36px"
              priority
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
              JanSankalp <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-indigo-600 italic">AI</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Civic intelligence
            </span>
          </div>
        </Link>
        <div className="mt-4 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/30 dark:border-slate-800/40 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            {role === "ADMIN" ? "Governance Hub" : (role === "OFFICER" ? "Officer Command" : "Citizen Portal")}
          </p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1 relative overflow-y-auto">
        {sidebarItems.map((item: any) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 overflow-hidden group",
                isActive
                  ? "text-white shadow-md shadow-indigo-600/10"
                  : "text-slate-500 dark:text-slate-450 hover:bg-slate-100/60 dark:hover:bg-slate-900/50 hover:text-indigo-600 dark:hover:text-indigo-400",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 to-indigo-600 z-0"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              
              <item.icon
                className={cn(
                  "w-4.5 h-4.5 transition-colors z-10",
                  isActive
                    ? "text-white"
                    : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
                )}
              />
              <span className="z-10">{item.label}</span>

              {/* Light glow strip on left for active */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white z-20 rounded-r-md" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Connected Live HUD card */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-900/60 bg-slate-50/40 dark:bg-slate-900/10">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-4 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-colors" />
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">TELEMETRY GRID</p>
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              NODE ACTIVE LIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
