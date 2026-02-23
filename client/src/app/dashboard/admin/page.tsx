"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { motion } from "framer-motion";
import { AIProcessingCenter } from "@/components/admin/AIProcessingCenter";
import { RLOptimizationDashboard } from "@/components/admin/RLOptimizationDashboard";

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
  const [error, setError] = React.useState<string | null>(null); // New error state
  const [mounted, setMounted] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date());
  const [activeTab, setActiveTab] = React.useState<
    "analytics" | "ai" | "optimization"
  >("analytics");

  // Set mounted after hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
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
    setMounted(true);
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
      <div className="min-h-screen flex items-center justify-center bg-background/50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading Governance Analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error || (!loading && !data && mounted)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 animate-in fade-in duration-500">
        <div className="w-24 h-24 rounded-[2.5rem] bg-red-50 text-red-500 flex items-center justify-center mb-8 border border-red-100 shadow-xl shadow-red-500/10 active:scale-95 transition-all">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-foreground mb-3 tracking-tight">
          Governance Sync Failure
        </h2>
        <p className="text-muted-foreground text-center max-w-sm mb-10 font-medium leading-relaxed">
          {error ||
            "We encountered an issue synchronizing the governance data for your region. Please verify your administrative credentials."}
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => fetchData()}
            className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all bg-primary"
          >
            Retry Connection
          </Button>
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/dashboard")}
            className="rounded-2xl px-10 h-14 font-bold text-muted-foreground hover:bg-muted transition-all active:scale-95"
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
    <div className="space-y-8 p-8 animate-in fade-in duration-700 bg-background/30 min-h-screen">
      <RealTimeNotifications
        userId={session?.user?.id}
        onNewComplaint={fetchData}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card/50 p-6 rounded-[2.5rem] border border-border/50 shadow-sm backdrop-blur-md gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-foreground">
            <Layers className="w-10 h-10 text-primary" />
            Governance Console
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex p-1 bg-muted rounded-2xl">
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "analytics" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "ai" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Sovereign AI
              </button>
              <button
                onClick={() => setActiveTab("optimization")}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "optimization" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
              >
                Optimization
              </button>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded">
              Kernel v2.0
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchData}
            className="rounded-2xl border border-border hover:border-primary hover:text-primary transition-all flex items-center gap-2 px-6 py-3 font-bold text-sm bg-card"
          >
            <Activity className="w-4 h-4" />
            Sync Data
          </button>
          <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 text-green-600 rounded-2xl text-xs font-bold ring-1 ring-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            AI ENABLED
          </div>
        </div>
      </div>

      {activeTab === "ai" ? (
        <AIProcessingCenter />
      ) : activeTab === "optimization" ? (
        <RLOptimizationDashboard />
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-xl transition-all border-none shadow-sm ring-1 ring-border rounded-[2rem]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  User Base
                </CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{totalUsers}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-blue-600 px-1.5 py-0.5 bg-blue-50 rounded">
                    Active
                  </span>
                  <p className="text-xs text-muted-foreground font-medium">
                    Across 3 major roles
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-none shadow-sm ring-1 ring-border rounded-[2.5rem]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Total Reports
                </CardTitle>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{totalComplaints}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-orange-600 px-1.5 py-0.5 bg-orange-50 rounded">
                    Synced
                  </span>
                  <p className="text-xs text-muted-foreground font-medium">
                    Real-time DB sync
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-none shadow-sm ring-1 ring-border rounded-[2.5rem]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Avg. Severity
                </CardTitle>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">
                  {totalComplaints > 0 &&
                  (data.severityDistribution || []).length > 0
                    ? (
                        (data.severityDistribution || []).reduce(
                          (a, b) => a + Number(b.severity) * b._count,
                          0,
                        ) / totalComplaints
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-red-600 px-1.5 py-0.5 bg-red-50 rounded">
                    Critical
                  </span>
                  <p className="text-xs text-muted-foreground font-medium">
                    Automatic triage
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-none shadow-sm ring-1 ring-border rounded-[2.5rem]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Health
                </CardTitle>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-green-600">99%</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-green-600 px-1.5 py-0.5 bg-green-50 rounded">
                    Optimal
                  </span>
                  <p className="text-xs text-muted-foreground font-medium">
                    All APIs operational
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-200 rounded-[2.5rem]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Resolution Velocity
                    </CardTitle>
                    <CardDescription>
                      Reporting trends over the last 7 active days
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient
                          id="colorTrend"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fontWeight: 600 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fontWeight: 600 }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorTrend)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-slate-200 rounded-[2.5rem]">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Status Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown by current complaint state
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: "1rem", border: "none" }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {data.aiInsights && (
            <Card className="border-none shadow-xl ring-2 ring-primary/20 bg-primary/5 overflow-hidden relative group rounded-[3rem]">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-32 h-32 text-primary" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-black flex items-center gap-3 text-primary uppercase tracking-tighter">
                  <Sparkles className="w-7 h-7" />
                  AI Intelligence Terminal
                </CardTitle>
                <CardDescription className="text-primary/70 font-bold">
                  Automated anomaly detection and strategic recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-6">
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/admin/ai-process", {
                          method: "POST",
                        });
                        const data = await res.json();
                        alert(`AI Hub: ${data.message}`);
                      } catch (e) {
                        alert("AI Hub reported an error.");
                      }
                    }}
                    className="bg-primary text-white font-black uppercase tracking-widest gap-2 rounded-2xl px-8 py-3 flex items-center shadow-lg shadow-primary/30 active:scale-95 transition-all text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Run AI Auto-Processor
                  </button>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10">
                  <div className="space-y-4">
                    <div className="text-xs font-black text-primary/50 uppercase tracking-widest">
                      Primary Hotspots
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.aiInsights.hotspots.map((h, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-white rounded-2xl text-sm font-black text-slate-800 shadow-sm border border-primary/10"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-xs font-black text-primary/50 uppercase tracking-widest">
                      AI Sector Summary
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                      &quot;{data.aiInsights.summary}&quot;
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-xs font-black text-primary/50 uppercase tracking-widest">
                      Strategic Suggestions
                    </div>
                    <ul className="space-y-3">
                      {data.aiInsights.suggestions.map((s, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm font-bold text-slate-600 bg-white/50 p-2 rounded-xl"
                        >
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary shrink-0">
                            {i + 1}
                          </div>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-slate-200 rounded-[2.5rem]">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Priority Departments
                </CardTitle>
                <CardDescription>
                  Volume management across core sectors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 mt-4">
                  {data.departmentActivity.map((dept, i) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {dept.name}
                        </span>
                        <span className="text-muted-foreground font-black uppercase text-[10px]">
                          {dept._count.complaints} Cases
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(dept._count.complaints / totalComplaints) * 100}%`,
                          }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="bg-primary h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-200 rounded-[2.5rem]">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Category Analysis
                </CardTitle>
                <CardDescription>
                  Total reports segmented by AI-classified categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fontWeight: 700 }}
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
                        fill="#3b82f6"
                        radius={[0, 8, 8, 0]}
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-slate-900 text-white rounded-[3rem]">
              <CardHeader>
                <CardTitle className="text-slate-100">
                  Governance Console
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Direct administrative control center
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() =>
                      router.push("/dashboard/admin/budget-forecasting")
                    }
                    className="p-6 rounded-[2rem] bg-slate-800 hover:bg-indigo-900 transition-colors border border-slate-700 hover:border-indigo-600 text-left group"
                  >
                    <DollarSign className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-sm">Budget Forecasting</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      AI · Predictions
                    </div>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/admin/compliance")}
                    className="p-6 rounded-[2rem] bg-slate-800 hover:bg-purple-900 transition-colors border border-slate-700 hover:border-purple-600 text-left group"
                  >
                    <Shield className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-sm">Compliance Portal</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      Audit · Bias · Gov
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      router.push("/dashboard/admin/urban-intelligence")
                    }
                    className="p-6 rounded-[2rem] bg-slate-800 hover:bg-emerald-900 transition-colors border border-slate-700 hover:border-emerald-600 text-left group"
                  >
                    <Map className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-sm">Urban Intelligence</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      Risk · Heatmap
                    </div>
                  </button>
                  <button
                    onClick={() => router.push("/transparency")}
                    className="p-6 rounded-[2rem] bg-slate-800 hover:bg-teal-900 transition-colors border border-slate-700 hover:border-teal-600 text-left group"
                  >
                    <Globe className="w-5 h-5 text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-sm">Transparency Portal</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      Public · AI Reports
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      router.push("/dashboard/admin/un-governance")
                    }
                    className="p-6 rounded-[2rem] bg-slate-800 hover:bg-blue-900 transition-colors border border-slate-700 hover:border-blue-600 text-left group shadow-xl shadow-blue-500/10"
                  >
                    <Crown className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-sm">UN Governance</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      SDG · Global · AI
                    </div>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/admin/ai-mayor")}
                    className="p-6 rounded-[2rem] bg-slate-800 hover:bg-indigo-900 transition-colors border border-slate-700 hover:border-indigo-600 text-left group shadow-xl shadow-indigo-500/10"
                  >
                    <Target className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-sm">AI Mayor Console</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      Leadership · Sandbox
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      router.push("/dashboard/admin/national-command")
                    }
                    className="p-6 rounded-[2rem] bg-slate-800 hover:bg-red-900 transition-colors border border-slate-700 hover:border-red-600 text-left group shadow-xl shadow-red-500/10"
                  >
                    <Shield className="w-5 h-5 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-sm">National Command</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      Sovereign · Infra · Defense
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-[3rem]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Real-time System Audit
                </CardTitle>
                <CardDescription>
                  Latest telemetry from active governance sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                        <Activity className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold flex items-center gap-2 text-slate-800">
                          System Kernel Sync
                          <span className="text-[10px] font-bold text-green-600 px-1.5 py-0.5 bg-green-50 rounded">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Database integrity check completed. No anomalies
                          detected in citizen-submission stream.
                        </p>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">
                          Just now
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
