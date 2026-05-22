"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  Calendar,
  Target,
  Eye,
  Play,
  History,
  Activity,
  UserCheck,
  Zap,
  TrendingUp as TrendingUpIcon,
  Shield,
  Loader2,
  FileDown,
  Layers
} from "lucide-react";
import { RealTimeNotifications } from "@/components/dashboard/RealTimeNotifications";

interface Complaint {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  status: string;
  severity: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  author: {
    name: string;
    email: string;
  };
  region?: string;
}

export default function OfficerDashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchAssignedComplaints = useCallback(async () => {
    try {
      const res = await fetch("/api/complaints");
      if (res.status === 401) return;
      const data = await res.json();
      
      // Filter complaints assigned to current officer
      const assignedComplaints = (data.complaints || []).filter(
        (c: any) => c.assignedTo?.id === session?.user?.id || c.assignedToId === session?.user?.id
      );
      setComplaints(assignedComplaints);
    } catch (error) {
      console.error("Failed to fetch assigned complaints:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session?.user?.role !== "OFFICER" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    fetchAssignedComplaints();
  }, [session, sessionStatus, router, fetchAssignedComplaints]);

  const assignedCount = complaints.length;
  const inProgressCount = complaints.filter((c) => c.status === "IN_PROGRESS").length;
  const pendingCount = complaints.filter((c) => c.status === "PENDING").length;
  const resolvedCount = complaints.filter((c) => c.status === "RESOLVED").length;
  const highPriorityCount = complaints.filter((c) => c.severity >= 4 && c.status !== "RESOLVED").length;
  
  const successRate = assignedCount > 0 ? Math.round((resolvedCount / assignedCount) * 100) : 0;

  const activities = [
    { text: "AI Auto-Triage successfully routed a new pipeline anomaly", time: "2 min ago", type: "new" },
    { text: "Dynamic Municipal Grid flagged Ward 5 with high priority", time: "5 min ago", type: "priority" },
    { text: "Sovereign Audit node confirmed cryptographic state validation", time: "12 min ago", type: "security" },
    { text: "Automated SLA update computed 1.8 day average recovery window", time: "15 min ago", type: "sla" }
  ];

  useEffect(() => {
    if (activities.length === 0) return;
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % activities.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activities.length]);

  if (sessionStatus === "loading" || !mounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse">Initializing Officer Command...</p>
        </div>
      </div>
    );
  }

  if (!session || (session?.user?.role !== "OFFICER" && session?.user?.role !== "ADMIN")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <RealTimeNotifications
          userId={session?.user?.id}
          onNewComplaint={fetchAssignedComplaints}
        />

        {/* Custom Premium Ticker Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-700 pr-3">Operational Grid</span>
            <p className="text-xs font-semibold text-slate-200 animate-pulse transition-all">
              {activities[tickerIndex].text}
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-500">{activities[tickerIndex].time}</span>
        </div>

        {/* Officer Main Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="h-8 w-1.5 rounded-full bg-orange-500" />
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
                Officer Command Center
              </h1>
            </div>
            <p className="text-slate-500 font-semibold text-sm">
              Operational oversight for <span className="text-slate-700 dark:text-slate-200 underline decoration-orange-500 decoration-2">{session?.user?.name || "Officer"}</span> • Active Node
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={fetchAssignedComplaints}
              variant="outline"
              className="rounded-xl h-11 border-slate-200 hover:bg-slate-50 bg-white font-bold gap-2 text-slate-700 text-xs uppercase tracking-widest shadow-sm active:scale-95 flex-1 sm:flex-initial"
            >
              <History className="w-4 h-4" /> Force Sync
            </Button>
            <Button
              className="rounded-xl h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 text-xs uppercase tracking-widest shadow-lg flex-1 sm:flex-initial"
              asChild
            >
              <Link href="/dashboard/officer/complaints">
                <UserCheck className="w-4 h-4" /> Resolve Queue
              </Link>
            </Button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Assigned Cases",
              value: assignedCount.toString(),
              icon: ClipboardList,
              color: "blue",
              description: "Total municipal assignments",
              trend: `+${inProgressCount} active`
            },
            {
              label: "Pending Verification",
              value: pendingCount.toString(),
              icon: Clock,
              color: "orange",
              description: "Awaiting SLA analysis",
              trend: "High Priority"
            },
            {
              label: "Resolved Impact",
              value: resolvedCount.toString(),
              icon: CheckCircle,
              color: "green",
              description: "Successfully processed",
              trend: `${successRate}% Success`
            },
            {
              label: "High Priority Alert",
              value: highPriorityCount.toString(),
              icon: AlertTriangle,
              color: "red",
              description: "Urgent response required",
              trend: "Immediate Action"
            }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 shadow-xl dark:shadow-none hover:shadow-2xl hover:border-orange-500/20 dark:hover:border-orange-500/20 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                    stat.color === "blue"
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white"
                      : stat.color === "green"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white"
                        : stat.color === "orange"
                          ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white",
                  )}
                >
                  <stat.icon className="h-5.5 w-5.5" />
                </div>
                <div
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1",
                    stat.color === "green"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                      : stat.color === "red"
                        ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                  )}
                >
                  {stat.trend}
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                {stat.value}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Priority Matrix and Tactical Route mapping */}
        <div className="grid gap-8 lg:grid-cols-7">
          
          {/* Priority Queue Board */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  Tactical Priority Matrix
                </h3>
                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-lg">Autonomous Weights</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block mb-1">Critical (LVL 4-5)</span>
                  <span className="text-2xl font-black text-rose-600">{highPriorityCount}</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider block mb-1">Medium (LVL 3)</span>
                  <span className="text-2xl font-black text-amber-600">
                    {complaints.filter((c) => c.severity === 3 && c.status !== "RESOLVED").length}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider block mb-1">Low (LVL 1-2)</span>
                  <span className="text-2xl font-black text-emerald-600">
                    {complaints.filter((c) => c.severity <= 2 && c.status !== "RESOLVED").length}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>Current Resolution Velocity</span>
                  <span className="text-indigo-600">{successRate}% Completed</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${successRate}%` }}
                    transition={{ duration: 1 }}
                    className="bg-gradient-to-r from-orange-500 to-indigo-600 h-full rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Tactical GPS route */}
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  GIS Action Map
                </h3>
                <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg">Interactive GPS</span>
              </div>

              <div className="h-64 bg-slate-900 rounded-[2rem] relative overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                <div className="absolute w-44 h-44 rounded-full bg-orange-500/5 blur-[50px] animate-pulse" />
                <div className="absolute w-32 h-32 rounded-full bg-indigo-500/5 blur-[40px] animate-bounce" />
                <div className="relative z-10 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-orange-500" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest">Active Incident GIS Twin</h4>
                  <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed font-medium">
                    Showing {assignedCount} assigned municipal hotspots. Navigate to resolution targets directly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Queue List */}
          <div className="lg:col-span-3">
            <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/20 overflow-hidden h-full flex flex-col">
              <div className="p-8 bg-slate-900 text-white border-b border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <ClipboardList className="w-5.5 h-5.5 text-orange-500" />
                    <h3 className="text-base font-black uppercase tracking-wider">Assigned Task Queue</h3>
                  </div>
                  <span className="text-[9px] font-black bg-orange-500 text-slate-950 px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
                    LIVE
                  </span>
                </div>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                  Real-time municipal complaints dispatched by BullMQ coordinator.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[500px] divide-y divide-slate-100">
                {loading ? (
                  <div className="p-16 text-center text-slate-400 space-y-4">
                    <Loader2 className="w-8 h-8 mx-auto text-indigo-600 animate-spin" />
                    <p className="text-xs font-black uppercase tracking-wider">Synchronizing grid database...</p>
                  </div>
                ) : complaints.length === 0 ? (
                  <div className="p-16 text-center text-slate-400 space-y-4">
                    <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 opacity-20" />
                    <p className="text-xs font-black uppercase tracking-wider">Clear Sky - No assignments</p>
                  </div>
                ) : (
                  complaints.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="p-6 hover:bg-slate-50 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 group-hover:text-orange-500 transition-colors truncate text-sm">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            <MapPin className="w-3 h-3 text-orange-500" />
                            {item.region || "District Ward Network"}
                          </div>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black border",
                          item.severity >= 4 
                            ? "bg-rose-50 text-rose-600 border-rose-100" 
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          LVL {item.severity}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          STATUS: <span className={cn(
                            "font-bold",
                            item.status === "RESOLVED" ? "text-emerald-500" :
                              item.status === "IN_PROGRESS" ? "text-indigo-500 animate-pulse" : "text-amber-500"
                          )}>{item.status}</span>
                        </span>
                        <Link href={`/dashboard/officer/complaints?id=${item.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 gap-1"
                          >
                            Update <ArrowUpRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <Button
                  className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all active:scale-[0.98]"
                  asChild
                >
                  <Link href="/dashboard/officer/complaints">Open Resolved Control Console</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sovereign Action Console Quick Actions bar */}
        <div className="flex flex-wrap gap-4 pt-4">
          <Button
            className="rounded-2xl h-12 px-8 font-black text-xs uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all active:scale-95 gap-2"
            asChild
          >
            <Link href="/dashboard/officer/complaints">
              <UserCheck className="w-4 h-4" /> Manage Assigned Queue
            </Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-2xl h-12 px-8 font-black text-xs uppercase tracking-widest border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 gap-2"
            asChild
          >
            <Link href="/dashboard/complaints">
              <Layers className="w-4 h-4" /> Sovereign Feed Center
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
