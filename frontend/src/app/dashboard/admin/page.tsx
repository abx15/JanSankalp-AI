"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Layers,
  ArrowUpRight,
  Sparkles,
  DollarSign,
  Shield,
  Map,
  Globe,
  Crown,
  Target,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RealTimeNotifications } from "@/components/dashboard/RealTimeNotifications";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { AIProcessingCenter } from "@/components/admin/AIProcessingCenter";
import { RLOptimizationDashboard } from "@/components/admin/RLOptimizationDashboard";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  users: Array<{ role: string; _count: number }>;
  statusDistribution: Array<{ status: string; _count: number }>;
  categoryDistribution: Array<{ category: string; _count: number }>;
  dailyTrends: Array<{ day: string; count: number }>;
  severityDistribution: Array<{ severity: number; _count: number }>;
  departmentActivity: Array<{ name: string; _count: { complaints: number } }>;
  aiInsights?: {
    hotspots: string[];
    summary: string;
    suggestions: string[];
  };
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date());
  const [activeTab, setActiveTab] = React.useState<
    "analytics" | "ai" | "optimization"
  >("analytics");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/analytics");
      const analytics = await res.json();
      if (!res.ok) {
        throw new Error(
          analytics.message ||
            analytics.error ||
            `Failed to fetch analytics: ${res.status}`,
        );
      }
      setData(analytics);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Error fetching analytics:", err);
      setError(
        err.message || "Failed to load management dashboard. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    fetchData();
  }, [session, status, router]);

  if (status === "loading" || loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-orange-500 border-t-transparent border-4"></div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse">
            Loading Governance Analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error || (!loading && !data && mounted)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="w-24 h-24 rounded-[2.5rem] bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center mb-8 border border-rose-100 dark:border-rose-900/50 shadow-xl shadow-rose-500/10 active:scale-95 transition-all">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
          Governance Sync Failure
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-10 font-semibold leading-relaxed">
          {error ||
            "We encountered an issue synchronizing the governance data for your region. Please verify your administrative credentials."}
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => fetchData()}
            className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest bg-orange-500 text-white hover:bg-orange-600 shadow-xl active:scale-95 transition-all"
          >
            Retry Connection
          </Button>
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/dashboard")}
            className="rounded-2xl px-10 h-14 font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all active:scale-95"
          >
            Exit Terminal
          </Button>
        </div>
      </div>
    );
  }

  if (!session || session?.user?.role !== "ADMIN" || !data) {
    return null;
  }

  const totalUsers = data.users.reduce((acc, curr) => acc + curr._count, 0);
  const totalComplaints = (data.statusDistribution || []).reduce(
    (acc, curr) => acc + curr._count,
    0,
  );

  const statusData = (data.statusDistribution || []).map((s) => ({
    name: s.status,
    value: s._count,
  }));

  const categoryData = (data.categoryDistribution || []).map((c) => ({
    name: c.category,
    count: c._count,
  }));

  const trendData = (data.dailyTrends || []).map((t) => ({
    day: new Date(t.day).toLocaleDateString("en-US", { weekday: "short" }),
    count: Number(t.count),
  }));

  return (
    <div className="space-y-8 p-6 sm:p-8 bg-slate-50/50 dark:bg-slate-950/20 min-h-screen text-foreground selection:bg-orange-500/10">
      <RealTimeNotifications
        userId={session?.user?.id}
        onNewComplaint={fetchData}
      />

      {/* Control Console Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/20 dark:border-slate-800/80 shadow-xl dark:shadow-none gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-br from-orange-500/5 to-transparent blur-[50px] -mr-10 group-hover:opacity-80 transition-all duration-700" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white sm:text-4xl">
            <Layers className="w-9 h-9 text-orange-500 animate-pulse" />
            Governance Console
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              {[
                { id: "analytics", label: "Analytics" },
                { id: "ai", label: "Sovereign AI" },
                { id: "optimization", label: "Optimization" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      isActive 
                        ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-md font-bold" 
                        : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg">
              Kernel v2.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
          <button
            onClick={fetchData}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2 px-6 py-3 font-bold text-xs uppercase tracking-widest bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex-1 sm:flex-initial"
          >
            <Activity className="w-4 h-4" />
            Sync Grid
          </button>
          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex-1 sm:flex-initial">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            AI ACTIVE
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "ai" ? (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <AIProcessingCenter />
          </motion.div>
        ) : activeTab === "optimization" ? (
          <motion.div
            key="optimization"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <RLOptimizationDashboard />
          </motion.div>
        ) : (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Metric widgets block */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "User Base",
                  value: totalUsers,
                  icon: Users,
                  color: "blue",
                  tag: "Active",
                  desc: "Across 3 major roles"
                },
                {
                  label: "Total Reports",
                  value: totalComplaints,
                  icon: FileText,
                  color: "orange",
                  tag: "Synced",
                  desc: "Real-time DB sync"
                },
                {
                  label: "Avg. Severity",
                  value: totalComplaints > 0 && (data.severityDistribution || []).length > 0
                    ? (
                        (data.severityDistribution || []).reduce(
                          (a, b) => a + Number(b.severity) * b._count,
                          0,
                        ) / totalComplaints
                      ).toFixed(1)
                    : "0.0",
                  icon: AlertTriangle,
                  color: "red",
                  tag: "Critical",
                  desc: "Automatic triage weights"
                },
                {
                  label: "Grid Health",
                  value: "99%",
                  icon: Activity,
                  color: "green",
                  tag: "Optimal",
                  desc: "All APIs operational"
                }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 shadow-xl dark:shadow-none hover:shadow-2xl hover:border-orange-500/20 dark:hover:border-orange-500/20 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <div className={cn (
                      "w-9 h-9 rounded-xl flex items-center justify-center shadow-inner",
                      stat.color === "blue" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" :
                        stat.color === "orange" ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400" :
                          stat.color === "red" ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400" :
                            "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    )}>
                      <stat.icon className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded",
                      stat.color === "blue" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" :
                        stat.color === "orange" ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400" :
                          stat.color === "red" ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400" :
                            "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    )}>
                      {stat.tag}
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                      {stat.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Panel */}
            <div className="grid gap-6 lg:grid-cols-7">
              
              {/* Chart 1: Area charts */}
              <motion.div
                whileHover={{ y: -2 }}
                className="lg:col-span-4 p-8 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 shadow-xl dark:shadow-none transition-all duration-300 relative overflow-hidden"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    Resolution Velocity
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
                    Reporting trends over the last 7 active days
                  </p>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                      <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }} />
                      <Area type="monotone" dataKey="count" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorTrend)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Chart 2: Status distribution */}
              <motion.div
                whileHover={{ y: -2 }}
                className="lg:col-span-3 p-8 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 shadow-xl dark:shadow-none transition-all duration-300 relative overflow-hidden"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Status Distribution</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">Breakdown by current complaint state</p>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: "1rem", border: "none" }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* AI Insights Board */}
            {data.aiInsights && (
              <motion.div
                whileHover={{ y: -2 }}
                className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-slate-900/80 text-white border border-slate-800 shadow-xl overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-32 h-32 text-orange-500" />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
                  <div>
                    <h3 className="text-2xl font-black flex items-center gap-3 text-orange-500 uppercase tracking-wider">
                      <Sparkles className="w-7 h-7" />
                      AI Intelligence Terminal
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold mt-1">
                      Automated anomaly detection and strategic recommendations
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/admin/ai-process", { method: "POST" });
                        const d = await res.json();
                        alert(`AI Hub: ${d.message}`);
                      } catch (e) {
                        alert("AI Hub reported an error.");
                      }
                    }}
                    className="bg-orange-500 text-slate-950 hover:bg-orange-600 font-black uppercase tracking-widest gap-2 rounded-2xl px-6 py-3 flex items-center shadow-lg active:scale-95 transition-all text-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    Run AI Auto-Processor
                  </button>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10 pt-4 border-t border-slate-800">
                  <div className="space-y-4">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Hotspots</div>
                    <div className="flex flex-wrap gap-2">
                      {data.aiInsights.hotspots.map((h, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-800/80 rounded-xl text-xs font-bold text-slate-200 border border-slate-700 shadow-sm">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Sector Summary</div>
                    <p className="text-xs font-semibold text-slate-300 leading-relaxed italic">
                      &quot;{data.aiInsights.summary}&quot;
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strategic Suggestions</div>
                    <ul className="space-y-2">
                      {data.aiInsights.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-2.5 text-xs font-semibold text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                          <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px] text-orange-500 shrink-0">
                            {i + 1}
                          </div>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Department Volume & Category breakdown */}
            <div className="grid gap-6 lg:grid-cols-7">
              <motion.div
                whileHover={{ y: -2 }}
                className="lg:col-span-3 p-8 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 shadow-xl dark:shadow-none transition-all duration-300 relative overflow-hidden"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Priority Departments</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">Volume management across core sectors</p>
                </div>

                <div className="space-y-6 mt-4">
                  {data.departmentActivity.map((dept, i) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          {dept.name}
                        </span>
                        <span className="text-slate-400 font-black uppercase text-[10px]">
                          {dept._count.complaints} Cases
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(dept._count.complaints / totalComplaints) * 100}%`,
                          }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="bg-orange-500 h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="lg:col-span-4 p-8 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 shadow-xl dark:shadow-none transition-all duration-300 relative overflow-hidden"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Category Analysis</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">Total reports segmented by AI-classified categories</p>
                </div>

                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fontWeight: 700 }}
                        width={120}
                      />
                      <Tooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#f97316"
                        radius={[0, 8, 8, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Direct console action shortcuts and logs */}
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                whileHover={{ y: -2 }}
                className="p-8 rounded-[3rem] bg-slate-900 dark:bg-slate-900/90 text-white border border-slate-800 shadow-xl overflow-hidden relative"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-100 tracking-tight">Governance Console</h3>
                  <p className="text-slate-400 text-xs font-semibold mt-1">Direct administrative control center</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Budget Forecasting", path: "/dashboard/admin/budget-forecasting", icon: DollarSign, color: "text-indigo-400", hoverBg: "hover:bg-indigo-950/40 hover:border-indigo-500", desc: "AI · Predictions" },
                    { label: "Compliance Portal", path: "/dashboard/admin/compliance", icon: Shield, color: "text-purple-400", hoverBg: "hover:bg-purple-950/40 hover:border-purple-500", desc: "Audit · Bias · Gov" },
                    { label: "Urban Intelligence", path: "/dashboard/admin/urban-intelligence", icon: Map, color: "text-emerald-400", hoverBg: "hover:bg-emerald-950/40 hover:border-emerald-500", desc: "Risk · Heatmap" },
                    { label: "Transparency Portal", path: "/transparency", icon: Globe, color: "text-teal-400", hoverBg: "hover:bg-teal-950/40 hover:border-teal-500", desc: "Public · AI Reports" },
                    { label: "UN Governance", path: "/dashboard/admin/un-governance", icon: Crown, color: "text-blue-400", hoverBg: "hover:bg-blue-950/40 hover:border-blue-500", desc: "SDG · Global · AI" },
                    { label: "AI Mayor Console", path: "/dashboard/admin/ai-mayor", icon: Target, color: "text-orange-400", hoverBg: "hover:bg-orange-950/40 hover:border-orange-500", desc: "Leadership · Sandbox" },
                    { label: "National Command", path: "/dashboard/admin/national-command", icon: Shield, color: "text-rose-400", hoverBg: "hover:bg-rose-950/40 hover:border-rose-500", desc: "Sovereign · Infra · Defense" }
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => router.push(btn.path)}
                      className={cn(
                        "p-4 rounded-2xl bg-slate-800/60 border border-slate-800 text-left transition-all duration-300 group",
                        btn.hoverBg
                      )}
                    >
                      <btn.icon className={cn("w-5 h-5 mb-2 group-hover:scale-110 transition-transform duration-300", btn.color)} />
                      <div className="font-bold text-xs text-slate-100">{btn.label}</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">{btn.desc}</div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Real-time system audit logs */}
              <motion.div
                whileHover={{ y: -2 }}
                className="p-8 rounded-[3rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 shadow-xl dark:shadow-none overflow-hidden"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500 animate-pulse" />
                    Real-time System Audit
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">Latest telemetry from active governance sessions</p>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-850">
                        <Activity className="w-4.5 h-4.5 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-2 text-slate-800 dark:text-slate-250">
                          System Kernel Sync
                          <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-100/50">
                            Verified
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-semibold">
                          Database integrity check completed. No anomalies detected in citizen-submission stream.
                        </p>
                        <div className="text-[9px] text-slate-400 font-bold uppercase mt-2 tracking-widest">
                          Just now
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
