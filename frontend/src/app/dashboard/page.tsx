"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Award,
  Trophy,
  History,
  TrendingUp,
  MapPin,
  Loader2,
  ClipboardList,
  FileDown,
  Cpu,
  Zap,
  Shield,
  Layers,
  Activity,
  UserCheck,
} from "lucide-react";
import dynamic from "next/dynamic";

const DepartmentChart = dynamic(
  () => import("@/components/dashboard/DepartmentChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-slate-900/10 dark:bg-white/5 animate-pulse rounded-2xl" />
    ),
  },
);

const TrendChart = dynamic(() => import("@/components/dashboard/TrendChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] w-full bg-slate-900/10 dark:bg-white/5 animate-pulse rounded-2xl" />
  ),
});

const FLDashboard = dynamic(
  () => import("@/components/dashboard/FLDashboard"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-slate-900/10 dark:bg-white/5 animate-pulse rounded-2xl" />
    ),
  },
);

const InfraDashboard = dynamic(
  () => import("@/components/dashboard/InfraDashboard"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full bg-slate-900/10 dark:bg-white/5 animate-pulse rounded-2xl" />
    ),
  },
);

import { RealTimeNotifications } from "@/components/dashboard/RealTimeNotifications";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { generateComplaintReceipt } from "@/lib/pdf-service";

export default function DashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      if (res.status === 401) {
        return;
      }
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error(err);
      const { toast } = await import("sonner");
      toast.error("Failed to load your reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // @ts-ignore
  const role = session?.user?.role || "CITIZEN";
  // @ts-ignore
  const points = session?.user?.points || 0;

  useEffect(() => {
    if (
      sessionStatus === "authenticated" &&
      (role === "CITIZEN" || !["ADMIN", "OFFICER"].includes(role))
    ) {
      fetchComplaints();
    }
  }, [sessionStatus, role]);

  if (!mounted || loading || sessionStatus === "loading") {
    return <DashboardSkeleton />;
  }

  if (role === "ADMIN") {
    return (
      <AdminDashboard
        complaints={complaints}
        loading={loading}
        refresh={fetchComplaints}
        session={session}
        role={role}
      />
    );
  }

  if (role === "OFFICER") {
    return (
      <OfficerDashboard
        complaints={complaints}
        refresh={fetchComplaints}
        session={session}
      />
    );
  }

  return (
    <CitizenDashboard
      complaints={complaints}
      points={points}
      loading={loading}
      session={session}
      role={role}
    />
  );
}

const activities = [
  { text: "New complaint filed by Arun Kumar (Water Supply)", time: "2 min ago", type: "new" },
  { text: "COMP-2026-0457 routed dynamically to S. Verma (Electricity Dept Head)", time: "5 min ago", type: "route" },
  { text: "COMP-2026-0456 verified & marked resolved by Auto-AI consensus", time: "10 min ago", type: "resolve" },
  { text: "Security Layer verified blockchain integrity of resolution ledger", time: "12 min ago", type: "security" },
  { text: "Grievance receipt invoice dispatched via Node SMTP service", time: "15 min ago", type: "email" }
];

function AdminDashboard({
  complaints,
  loading,
  refresh,
  session,
  role,
}: {
  complaints: any[];
  loading: boolean;
  refresh: () => void;
  session: any;
  role: string;
}) {
  const [activeTab, setActiveTab] = useState<"triage" | "analytics" | "federated" | "twins">("triage");
  const [tickerIndex, setTickerIndex] = useState(0);

  const totalComplaintsVal = complaints.length;
  const pendingCasesVal = complaints.filter((c) => c.status === "PENDING" || c.status === "IN_PROGRESS").length;
  const resolvedCasesVal = complaints.filter((c) => c.status === "RESOLVED").length;
  const uniqueCitizens = new Set(complaints.map((c) => c.authorId)).size;
  const activeCitizensVal = uniqueCitizens > 0 ? uniqueCitizens : 5;

  const stats = [
    {
      label: "Total Complaints",
      value: totalComplaintsVal.toLocaleString(),
      icon: ClipboardList,
      color: "blue",
      description: "Total filed complaints",
      trend: "+12%"
    },
    {
      label: "Pending Cases",
      value: pendingCasesVal.toLocaleString(),
      icon: Clock,
      color: "orange",
      description: "Awaiting resolution",
      trend: "-2%"
    },
    {
      label: "Resolved Cases",
      value: resolvedCasesVal.toLocaleString(),
      icon: CheckCircle,
      color: "green",
      description: "Successfully completed",
      trend: "+5%"
    },
    {
      label: "Active Citizens",
      value: activeCitizensVal.toLocaleString(),
      icon: Users,
      color: "purple",
      description: "Registered citizens",
      trend: "+8%"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % activities.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const highPriority = complaints
    .filter((c) => c.severity > 3 && c.status !== "RESOLVED")
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <RealTimeNotifications
          userId={session?.user?.id}
          onNewComplaint={refresh}
        />

        {/* Custom Premium Ticker Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-700 pr-3">Live Feed</span>
            <p className="text-xs font-semibold text-slate-200 animate-pulse transition-all">
              {activities[tickerIndex].text}
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-500">{activities[tickerIndex].time}</span>
        </div>

        {/* Global Administrative Navigation Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="h-8 w-1.5 rounded-full bg-orange-500" />
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
                JanSankalp Sovereign Control
              </h1>
            </div>
            <p className="text-slate-500 font-semibold text-sm">
              Sovereign AI Administrative Panel • Signed in as <span className="text-slate-700 dark:text-slate-200 underline decoration-orange-500 decoration-2">{session?.user?.name || "System Admin"}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={refresh}
              variant="outline"
              className="rounded-xl h-11 border-slate-200 hover:bg-slate-50 bg-white font-bold gap-2 text-slate-700 text-xs uppercase tracking-widest shadow-sm active:scale-95 flex-1 sm:flex-initial"
            >
              <History className="w-4.5 h-4.5" /> Force Sync
            </Button>
            <Button
              className="rounded-xl h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 text-xs uppercase tracking-widest shadow-lg flex-1 sm:flex-initial"
              asChild
            >
              <Link href="/dashboard/complaints">
                <Layers className="w-4.5 h-4.5" /> Dispatch Command
              </Link>
            </Button>
          </div>
        </div>

        {/* Premium Mini Stats Bar */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
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
                          : "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white",
                  )}
                >
                  <stat.icon className="h-5.5 w-5.5" />
                </div>
                <div
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1",
                    stat.trend.startsWith("+")
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                      : "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
                  )}
                >
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Navigation Tabs Panel */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 pb-px gap-1 overflow-x-auto scrollbar-none relative">
          {[
            { id: "triage", label: "Grievance Feed", icon: Shield },
            { id: "analytics", label: "Sovereign Analytics", icon: TrendingUp },
            { id: "federated", label: "Federated Learning AI", icon: Cpu },
            { id: "twins", label: "Infrastructure Twins", icon: Activity },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "relative flex items-center gap-2.5 px-6 py-3.5 text-xs uppercase tracking-widest font-black transition-all whitespace-nowrap focus:outline-none",
                  isActive
                    ? "text-slate-900 dark:text-white font-bold"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="z-10">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Grievance Command & Triage */}
        {activeTab === "triage" && (
          <div className="grid gap-8 lg:grid-cols-7">
            {/* Live Activity Feed */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    Autonomous Action Logs
                  </h3>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-lg">Realtime Updates</span>
                </div>

                <div className="space-y-4">
                  {activities.map((act, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                        act.type === "new" ? "bg-blue-50 text-blue-600" :
                          act.type === "route" ? "bg-amber-50 text-amber-600" :
                            act.type === "resolve" ? "bg-emerald-50 text-emerald-600" :
                              act.type === "security" ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"
                      )}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 leading-normal">{act.text}</p>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 block">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Hotspots Grid */}
              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    Geographical Twin
                  </h3>
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg">Active Mapping</span>
                </div>
                <div className="h-64 bg-slate-900 rounded-[2rem] relative overflow-hidden flex items-center justify-center group">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                  <div className="absolute w-44 h-44 rounded-full bg-orange-500/5 blur-[50px] animate-pulse" />
                  <div className="absolute w-32 h-32 rounded-full bg-indigo-500/5 blur-[40px] animate-bounce" />
                  <div className="relative z-10 text-center space-y-3">
                    <div className="w-12 h-12 bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6 text-orange-500" />
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Interactive GIS Node</h4>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Sovereign satellite integration active. Displaying municipal heatmaps & response grids.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Feed Panel */}
            <div className="lg:col-span-3">
              <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/20 overflow-hidden h-full flex flex-col">
                <div className="p-8 bg-slate-900 text-white border-b border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-5.5 h-5.5 text-orange-500" />
                      <h3 className="text-base font-black uppercase tracking-wider">Priority Triage</h3>
                    </div>
                    <span className="text-[9px] font-black bg-orange-500 text-slate-950 px-2.5 py-1 rounded-full uppercase tracking-widest">
                      URGENT
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                    Highest-severity incidents awaiting administrative resolution verify loops.
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[500px] divide-y divide-slate-100">
                  {highPriority.length === 0 ? (
                    <div className="p-16 text-center text-slate-400 space-y-4">
                      <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 opacity-20" />
                      <p className="text-xs font-black uppercase tracking-wider">Clear Sky - No urgent cases</p>
                    </div>
                  ) : (
                    highPriority.map((item) => (
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
                              {item.region || "District Municipal Ward"}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-50 text-orange-600 text-[9px] font-black border border-orange-100">
                            LVL {item.severity}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {format(new Date(item.createdAt), "MMM d, h:mm a")}
                          </span>
                          <Link href={`/dashboard/complaints?id=${item.id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 gap-1"
                            >
                              Resolve <ArrowUpRight className="w-3 h-3" />
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
                    <Link href="/dashboard/complaints">Open Global Command Console</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sovereign Analytics */}
        {activeTab === "analytics" && (
          <div className="grid gap-8 grid-cols-1">
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/20">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                Category Aggregations (Last 30 Days)
              </h3>
              <div className="w-full min-h-[300px]">
                <DepartmentChart />
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/20">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                Response Performance & Turnaround Times
              </h3>
              <div className="w-full min-h-[200px]">
                <TrendChart />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Federated AI Network */}
        {activeTab === "federated" && (
          <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/20">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                Federated Edge Training Dashboard
              </h3>
              <p className="text-slate-500 text-xs font-semibold mt-1">
                Edge municipal models validating complaint routing logic locally.
              </p>
            </div>
            <FLDashboard />
          </div>
        )}

        {/* Tab 4: Digital Twins */}
        {activeTab === "twins" && (
          <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/20">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Real-Time Municipal Sensor Matrix
              </h3>
              <p className="text-slate-500 text-xs font-semibold mt-1">
                Digital twin integrations mapping water, transport, and waste anomalies.
              </p>
            </div>
            <InfraDashboard />
          </div>
        )}
      </div>
    </div>
  );
}

function OfficerDashboard({
  complaints,
  refresh,
  session,
}: {
  complaints: any[];
  refresh: () => void;
  session: any;
}) {
  const activeAssigned = complaints.filter(
    (c) => c.assignedToId === session?.user?.id && c.status === "IN_PROGRESS"
  ).length;

  const resolved = complaints.filter(
    (c) => c.assignedToId === session?.user?.id && c.status === "RESOLVED"
  ).length;

  const pending = complaints.filter(
    (c) => c.assignedToId === session?.user?.id && c.status === "PENDING"
  ).length;

  const highPriority = complaints.filter(
    (c) => c.assignedToId === session?.user?.id && c.severity >= 4 && c.status !== "RESOLVED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Officer Main Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-7 w-1.5 rounded-full bg-indigo-600" />
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Officer Command Center
              </h1>
            </div>
            <p className="text-slate-500 font-semibold text-sm">
              Operational oversight, assign mapping, and resolution verification panel.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-xl h-11 px-5 border-slate-200 bg-white font-bold text-xs uppercase tracking-widest text-slate-700 shadow-sm gap-2 hover:bg-slate-50 transition-all active:scale-95"
            onClick={refresh}
          >
            <History className="w-4 h-4" /> Refresh Queue
          </Button>
        </div>

        {/* Dashboard Metric Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Assigned Cases",
              value: activeAssigned || "0",
              icon: ClipboardList,
              color: "blue",
            },
            {
              label: "Resolved",
              value: resolved || "0",
              icon: CheckCircle,
              color: "green",
            },
            {
              label: "Pending",
              value: pending || "0",
              icon: Clock,
              color: "orange",
            },
            {
              label: "High Priority",
              value: highPriority || "0",
              icon: AlertTriangle,
              color: "red",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="p-8 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 shadow-xl shadow-slate-100/10 dark:shadow-none hover:shadow-2xl hover:border-orange-500/20 dark:hover:border-orange-500/20 transition-all relative overflow-hidden group"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300",
                  stat.color === "blue"
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white"
                    : stat.color === "green"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white"
                      : stat.color === "orange"
                        ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white"
                        : "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white",
                )}
              >
                <stat.icon className="w-5.5 h-5.5" />
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Commands Actions Block */}
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

function CitizenDashboard({
  complaints,
  points,
  loading,
  session,
  role,
}: {
  complaints: any[];
  points: number;
  loading: boolean;
  session: any;
  role: string;
}) {
  const resolvedCount = complaints.filter(
    (c) => c.status === "RESOLVED",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50/40 pb-16">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

        {/* Elegant Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-10 md:p-16 shadow-2xl shadow-slate-100/50 group">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-br from-orange-500/5 to-transparent blur-[80px] -mr-16 -mt-16 group-hover:opacity-80 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-1/4 h-full bg-gradient-to-tr from-emerald-500/5 to-transparent blur-[80px] -ml-16 -mb-16 group-hover:opacity-80 transition-all duration-700" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                </span>
                Citizen Steward Active
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Jai Hind, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-indigo-600 italic font-serif font-medium">
                  {session?.user?.name || "Citizen"}
                </span>
              </h2>

              <p className="text-slate-500 text-base font-semibold max-w-xl leading-relaxed">
                Your sovereign grievance reports contribute directly to regional governance optimization algorithms. Thank you for building a better India.
              </p>
            </div>

            {/* Glowing Points Card */}
            <div className="relative p-8 rounded-[2rem] bg-slate-950 text-white min-w-[260px] shadow-2xl shadow-slate-950/20 overflow-hidden group/card hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[40px] -mr-12 -mt-12 group-hover/card:bg-orange-500/20 transition-all" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 blur-[40px] -ml-12 -mb-12 group-hover/card:bg-emerald-500/20 transition-all" />

              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner text-orange-500">
                  <Trophy className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-5xl font-black text-white tracking-tighter leading-none mb-1">
                    {points}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Impact Points Credited
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Dashboard Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          <Link href="/dashboard/my-reports" className="block">
            <motion.div
              whileHover={{ y: -5, scale: 1.01 }}
              className="p-8 rounded-[2rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 shadow-xl shadow-slate-100/20 dark:shadow-none group hover:border-orange-500/20 dark:hover:border-orange-500/20 transition-all duration-300 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                <ClipboardList className="w-5.5 h-5.5" />
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Grievances Filed
              </p>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                {complaints.length}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Active municipal interventions
              </p>
            </motion.div>
          </Link>

          <Link href="/dashboard/my-reports" className="block">
            <motion.div
              whileHover={{ y: -5, scale: 1.01 }}
              className="p-8 rounded-[2rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 shadow-xl shadow-slate-100/20 dark:shadow-none group hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <CheckCircle className="w-5.5 h-5.5" />
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Resolved Impact
              </p>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                {resolvedCount}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {complaints.length > 0
                  ? Math.round((resolvedCount / complaints.length) * 100)
                  : 0}
                % Triage Success Rate
              </p>
            </motion.div>
          </Link>

          <Link href="/dashboard/rewards" className="block">
            <motion.div
              whileHover={{ y: -5, scale: 1.01 }}
              className="p-8 rounded-[2rem] bg-slate-900 dark:bg-slate-900 text-white shadow-xl group relative overflow-hidden hover:scale-[1.01] transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] -mr-16 -mt-16 group-hover:bg-indigo-500/40 transition-all" />
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-orange-500 flex items-center justify-center mb-6">
                <Award className="w-5.5 h-5.5" />
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Steward Status
              </p>
              <div className="text-3xl font-black text-white mb-2 tracking-tight">
                Elite Rank
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold">
                Top 5% of regional caretakers
              </p>
            </motion.div>
          </Link>
        </div>

        {/* Grid: Recent Submissions & Dynamic Stewardship */}
        <div className="grid gap-12 lg:grid-cols-2">

          {/* Grievance Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Recent Activities
                </h3>
                <p className="text-slate-500 text-xs font-semibold mt-1">
                  Track the lifecycle and resolution status of filed cases.
                </p>
              </div>
              <Link href="/dashboard/my-reports">
                <Button
                  variant="ghost"
                  className="text-indigo-600 hover:text-indigo-700 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 gap-1.5"
                >
                  View All <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center p-20">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              ) : complaints.length === 0 ? (
                <div className="p-12 text-center rounded-[2.5rem] bg-white border border-dashed border-slate-200">
                  <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <p className="font-bold text-slate-500 mb-6">
                    No active grievances recorded.
                  </p>
                  <Button
                    className="rounded-2xl h-11 px-8 font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
                    asChild
                  >
                    <Link href="/dashboard/complaints">
                      File Grievance Now
                    </Link>
                  </Button>
                </div>
              ) : (
                complaints.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/10 group hover:border-indigo-500/20 transition-all duration-300"
                  >
                    <div className="flex gap-6">
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 relative border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                        {item.imageUrl ? (
                          <NextImage
                            src={item.imageUrl}
                            fill
                            className="object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50">
                            <MapPin className="w-7 h-7 text-slate-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h4 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                            {item.title}
                          </h4>
                          <div
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider whitespace-nowrap flex items-center gap-1 shadow-sm border",
                              item.status === "RESOLVED"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : item.status === "PENDING"
                                  ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse"
                                  : "bg-indigo-50 text-indigo-600 border-indigo-100"
                            )}
                          >
                            <span className={cn(
                              "h-1 w-1 rounded-full shrink-0",
                              item.status === "RESOLVED" ? "bg-emerald-500" :
                                item.status === "PENDING" ? "bg-amber-500" : "bg-indigo-500"
                            )} />
                            {item.status}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 font-semibold mb-4 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-orange-500" />{" "}
                          {item.region || "Municipal Territory Ward"}
                        </p>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            ID: <span className="font-mono">{item.ticketId || item.id.substring(0, 8)}</span>
                          </span>

                          <div className="flex items-center gap-2">
                            {item.status === "RESOLVED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => generateComplaintReceipt(item)}
                                className="h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-600 border-emerald-100 hover:bg-emerald-50 flex items-center gap-1"
                              >
                                <FileDown className="w-3 h-3" /> PDF Receipt
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                              asChild
                            >
                              <Link href={`/dashboard/complaints?id=${item.id}`}>
                                Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions Console */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Sovereign AI Core
            </h3>

            <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 blur-[80px] -mr-24 -mt-24 group-hover:bg-orange-500/20 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 blur-[80px] -ml-24 -mb-24 group-hover:bg-indigo-500/20 transition-all duration-700" />

              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-orange-500 shadow-inner">
                    <Zap className="w-5.5 h-5.5 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-wider">Fast-Track Grievances</h4>
                </div>

                <p className="text-slate-400 font-semibold text-sm leading-relaxed">
                  Our defense-grade Llama-Grok multi-agent pipeline sanitizes, verifies, routes, and alerts relevant municipal commissioners automatically in &lt;60s.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Button
                    className="rounded-xl h-11 px-8 font-black text-xs uppercase tracking-widest bg-orange-500 hover:bg-orange-600 text-slate-950 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                    asChild
                  >
                    <Link href="/dashboard/complaints">New Grievance</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-xl h-11 px-8 font-black text-xs uppercase tracking-widest text-white hover:bg-white/5 border border-white/10"
                    asChild
                  >
                    <Link href="/about">Consensus Spec</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/10">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-900 mb-1">Badges Earned</h5>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  4 Active Seals
                </p>
              </div>
              <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/10">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-900 mb-1">Impact Radius</h5>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  124 Citizens Aided
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Quick Controls bar */}
        <div className="flex flex-wrap gap-3 justify-end border-t border-slate-100 pt-8">
          {role === "ADMIN" && (
            <Button
              variant="outline"
              className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
              asChild
            >
              <Link href="/dashboard/admin">
                <Users className="w-4 h-4" /> System Admin Control
              </Link>
            </Button>
          )}
          {role === "OFFICER" && (
            <Button
              variant="outline"
              className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
              asChild
            >
              <Link href="/dashboard/officer">
                <ClipboardList className="w-4 h-4" /> Assigned Tasks Console
              </Link>
            </Button>
          )}
          <Button
            className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
            asChild
          >
            <Link href="/dashboard/complaints">
              <ClipboardList className="w-4 h-4" /> Manage All Submissions
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
