"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import dynamic from "next/dynamic";

const DepartmentChart = dynamic(
  () => import("@/components/dashboard/DepartmentChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-xl" />
    ),
  },
);

const TrendChart = dynamic(() => import("@/components/dashboard/TrendChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] w-full bg-muted/20 animate-pulse rounded-xl" />
  ),
});

const FLDashboard = dynamic(
  () => import("@/components/dashboard/FLDashboard"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-xl" />
    ),
  },
);

const InfraDashboard = dynamic(
  () => import("@/components/dashboard/InfraDashboard"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-xl" />
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

  // Set mounted after hydration
  useEffect(() => {
    setMounted(true);
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      if (res.status === 401) {
        // User is not authenticated, don't try to fetch
        return;
      }
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // @ts-ignore
  const role = session?.user?.role || "CITIZEN";
  // @ts-ignore
  const points = session?.user?.points || 0;

  useEffect(() => {
    console.log("Dashboard useEffect - Session Status:", sessionStatus);
    console.log("Dashboard useEffect - Role:", role);
    console.log("Dashboard useEffect - Session:", session);

    if (sessionStatus === "loading") return;

    if (sessionStatus === "unauthenticated") {
      console.log("User not authenticated, redirecting to signin...");
      router.push("/auth/signin");
      return;
    }

    if (sessionStatus === "authenticated") {
      console.log("User authenticated, checking role...");

      if (role === "ADMIN") {
        console.log("Redirecting ADMIN to admin dashboard...");
        router.push("/dashboard/admin");
      } else if (role === "OFFICER") {
        console.log("Redirecting OFFICER to officer dashboard...");
        router.push("/dashboard/officer");
      } else if (role === "CITIZEN") {
        console.log("Loading CITIZEN dashboard...");
        fetchComplaints();
      } else {
        console.log("Unknown role, defaulting to citizen dashboard...");
        fetchComplaints();
      }
    }
  }, [sessionStatus, role, router, session]);

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
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Officer Command
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Operational oversight and assigned civic resolutions.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-xl h-11 px-5 border-border font-semibold gap-2 hover:bg-muted transition-all active:scale-95"
              onClick={fetchComplaints}
            >
              <History className="w-4 h-4" /> Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Assigned Cases",
              value: "12",
              icon: ClipboardList,
              color: "blue",
            },
            {
              label: "Resolved",
              value: "8",
              icon: CheckCircle,
              color: "green",
            },
            { label: "Pending", value: "4", icon: Clock, color: "orange" },
            {
              label: "High Priority",
              value: "2",
              icon: AlertTriangle,
              color: "red",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-8 rounded-[2rem] bg-card border border-border shadow-soft group hover:border-primary/20 transition-all"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all",
                  stat.color === "blue"
                    ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                    : stat.color === "green"
                      ? "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white"
                      : stat.color === "orange"
                        ? "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                        : "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white",
                )}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <div className="text-4xl font-bold text-foreground">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <Button
            className="rounded-xl h-12 px-8 font-bold bg-primary hover:bg-primary/90 text-white shadow-soft transition-all active:scale-95 gap-2"
            asChild
          >
            <Link href="/dashboard/officer/complaints">
              <ClipboardList className="w-4 h-4" /> Resolve Assigned Cases
            </Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-xl h-12 px-8 font-bold border-slate-200 hover:bg-slate-50 transition-all active:scale-95 gap-2 text-slate-600"
            asChild
          >
            <Link href="/dashboard/complaints">
              <Users className="w-4 h-4" /> Global Command Feed
            </Link>
          </Button>
        </div>
      </div>
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
  const router = useRouter();
  const stats = [
    {
      label: "Total Complaints",
      value: complaints.length.toString(),
      icon: Users,
      color: "text-blue-600",
      trend: "+12%",
    },
    {
      label: "Resolved",
      value: complaints
        .filter((c) => c.status === "RESOLVED")
        .length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      trend: "+5%",
    },
    {
      label: "Pending",
      value: complaints.filter((c) => c.status === "PENDING").length.toString(),
      icon: Clock,
      color: "text-orange-600",
      trend: "-2%",
    },
    {
      label: "High Severity",
      value: complaints.filter((c) => c.severity > 3).length.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      trend: "+8%",
    },
  ];

  const highPriority = complaints
    .filter((c) => c.severity > 3 && c.status !== "RESOLVED")
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <RealTimeNotifications
        userId={session?.user?.id}
        onNewComplaint={refresh}
      />

      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Operations Command
          </h2>
          <p className="text-slate-500 font-medium">
            Real-time administrative oversight and civic intelligence.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={refresh}
            variant="outline"
            className="rounded-xl h-11 px-5 border-border font-semibold gap-2 hover:bg-muted transition-all active:scale-95"
          >
            <History className="w-4 h-4" /> Refresh
          </Button>
          {role === "ADMIN" && (
            <Button
              variant="secondary"
              className="rounded-xl h-11 px-5 font-semibold gap-2 transition-all active:scale-95"
              asChild
            >
              <Link href="/dashboard/admin">
                <Users className="w-4 h-4" /> Admin Console
              </Link>
            </Button>
          )}
          <Button
            className="rounded-xl h-11 px-6 font-semibold gap-2 bg-primary hover:bg-primary/90 shadow-soft transition-all active:scale-95"
            asChild
          >
            <Link href="/dashboard/complaints">
              <ClipboardList className="w-4 h-4" /> Open Command Feed
            </Link>
          </Button>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-8 rounded-[2rem] bg-card border border-border shadow-soft group hover:border-primary/20 transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                  stat.color.includes("blue")
                    ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                    : stat.color.includes("green")
                      ? "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white"
                      : stat.color.includes("orange")
                        ? "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                        : "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white",
                )}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1",
                  stat.trend.startsWith("+")
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600",
                )}
              >
                <ArrowUpRight
                  className={cn(
                    "w-3 h-3",
                    !stat.trend.startsWith("+") && "rotate-90",
                  )}
                />
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              {stat.label}
            </p>
            <div className="text-4xl font-bold text-foreground tracking-tight tabular-nums">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Intelligence & Infrastructure Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-soft relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] -mr-16 -mt-16 group-hover:bg-primary/40 transition-all duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Consensus Core</h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
                    Federated AI Active
                  </p>
                </div>
              </div>
            </div>
            <FLDashboard />
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-card border border-border shadow-soft relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-[80px] -mr-16 -mt-16 group-hover:bg-secondary/10 transition-all duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Infrastructure Monitor
                  </h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1 text-emerald-500/80">
                    IoT + Satellite Grid
                  </p>
                </div>
              </div>
            </div>
            <InfraDashboard />
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-7 mb-12">
        {/* Charts Section */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-soft group hover:border-primary/20 transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Issue Trajectory
                </h3>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  Real-time daily volume analysis
                </p>
              </div>
              <div className="flex gap-2">
                <div className="w-12 h-1 bg-primary/10 rounded-full" />
                <div className="w-4 h-1 bg-primary/5 rounded-full" />
              </div>
            </div>
            <div className="h-[300px] w-full">
              <TrendChart />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-soft group hover:border-secondary/20 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-secondary" />
                <h3 className="font-bold text-foreground">
                  Spatial Distribution
                </h3>
              </div>
              <div className="h-[200px] flex items-center justify-center bg-muted rounded-2xl border border-dashed border-border">
                <div className="text-center">
                  <MapPin className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                  <p className="text-xs font-bold text-slate-400">
                    Map Interface Active
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-soft group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Sector Audit</h3>
              </div>
              <div className="h-[200px] w-full">
                <DepartmentChart />
              </div>
            </div>
          </div>
        </div>

        {/* Priority Triage Feed */}
        <div className="lg:col-span-3">
          <div className="rounded-[2.5rem] bg-card border border-border shadow-soft overflow-hidden h-full flex flex-col">
            <div className="p-8 bg-muted/30 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Priority Triage</h3>
                </div>
                <span className="text-[10px] font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100 uppercase tracking-widest">
                  URGENT
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Critical issues requiring immediate administrative consensus.
              </p>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[600px] divide-y divide-slate-50">
              {highPriority.length === 0 ? (
                <div className="p-16 text-center text-slate-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="font-bold">Clear Sky - No critical issues</p>
                </div>
              ) : (
                highPriority.map((item) => (
                  <div
                    key={item.id}
                    className="p-8 hover:bg-slate-50/50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="min-w-0">
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.region}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold border border-red-100">
                        LVL {item.severity}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">
                        {format(new Date(item.createdAt), "MMM d, h:mm a")}
                      </span>
                      <Link href={`/dashboard/complaints?id=${item.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 rounded-lg text-xs font-bold text-primary hover:bg-primary/5 gap-1"
                        >
                          Resolve <ArrowUpRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-8 bg-slate-50/30 border-t border-slate-100">
              <Button
                className="w-full h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-widest shadow-soft transition-all active:scale-[0.98]"
                asChild
              >
                <Link href="/dashboard/complaints">Open Full Command Feed</Link>
              </Button>
            </div>
          </div>
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Elegant Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border p-10 md:p-16 shadow-soft group">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-1/4 h-full bg-secondary/5 blur-[100px] -ml-16 -mb-16 group-hover:bg-secondary/10 transition-all duration-700" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest border border-primary/10">
                Citizen Portal Active
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-tight">
                Jai Hind, <br />
                <span className="text-primary italic font-serif">
                  {session?.user?.name || "Citizen"}
                </span>
              </h2>
              <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">
                Your contributions are driving the digital transformation of our
                administration. Track your impact across the city.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm min-w-[240px]">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-soft text-primary mb-2">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground leading-none mb-2">
                  {points}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Impact Points
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          <Link href="/dashboard/my-reports">
            <div className="p-8 rounded-[2rem] bg-card border border-border shadow-soft group hover:border-primary/20 transition-all relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <ClipboardList className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Reports Filed
              </p>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {complaints.length}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Active civic contributions
              </p>
            </div>
          </Link>

          <Link href="/dashboard/my-reports">
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-soft group hover:border-secondary/20 transition-all relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-secondary/5 text-secondary flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all">
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Resolved Impact
              </p>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {resolvedCount}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {complaints.length > 0
                  ? Math.round((resolvedCount / complaints.length) * 100)
                  : 0}
                % success rate
              </p>
            </div>
          </Link>

          <Link href="/dashboard/rewards">
            <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-soft group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-[60px] -mr-12 -mt-12 group-hover:bg-primary/40 transition-all" />
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-primary flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Citizen Status
              </p>
              <div className="text-4xl font-bold text-white mb-2">
                Elite Rank
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Top 5% of stewards
              </p>
            </div>
          </Link>
        </div>

        {/* Recent Activity & Stewardship */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Recent Reports List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Recent Activity
                </h3>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  Track the resolution of your filed issues.
                </p>
              </div>
              <Link href="/dashboard/my-reports">
                <Button
                  variant="ghost"
                  className="text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary/5 gap-2"
                >
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center p-20">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : complaints.length === 0 ? (
                <div className="p-12 text-center rounded-[2rem] bg-slate-50 border border-dashed border-slate-200">
                  <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <p className="font-bold text-slate-500 mb-6">
                    No reports filed yet.
                  </p>
                  <Button
                    className="rounded-xl h-11 px-8 font-bold bg-primary hover:bg-primary/90"
                    asChild
                  >
                    <Link href="/dashboard/complaints">
                      File Your First Report
                    </Link>
                  </Button>
                </div>
              ) : (
                complaints.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-soft group hover:border-primary/20 transition-all"
                  >
                    <div className="flex gap-6">
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 relative border border-slate-100 group-hover:scale-105 transition-transform">
                        {item.imageUrl ? (
                          <NextImage
                            src={item.imageUrl}
                            fill
                            className="object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50">
                            <MapPin className="w-8 h-8 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h4 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <div
                            className={cn(
                              "px-2 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
                              item.status === "RESOLVED"
                                ? "bg-green-50 text-green-600"
                                : item.status === "PENDING"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-blue-50 text-blue-600",
                            )}
                          >
                            {item.status}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />{" "}
                          {item.region}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">
                            {format(new Date(item.createdAt), "MMM d, yyyy")}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 rounded-lg text-xs font-bold text-slate-500 hover:text-primary"
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
                ))
              )}
            </div>
          </div>

          {/* Quick Actions / Impact Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground">
              Digital Stewardship
            </h3>
            <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-soft relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 blur-[100px] -mr-24 -mt-24 group-hover:bg-secondary/30 transition-all duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-secondary">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold">Fast-Track Resolution</h4>
                </div>
                <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
                  Our new Sovereign AI core prioritizes verified citizen reports
                  for 2x faster resolution. Keep contributing to maintain your
                  Elite Steward status.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    className="rounded-xl h-12 px-8 font-bold bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 shadow-soft"
                    asChild
                  >
                    <Link href="/dashboard/complaints">New Report</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-xl h-12 px-8 font-bold text-white hover:bg-white/5"
                    asChild
                  >
                    <Link href="/about">How It Works</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-[2rem] bg-card border border-border shadow-soft">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-foreground mb-1">Badges</h5>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  4 Earned
                </p>
              </div>
              <div className="p-6 rounded-[2rem] bg-card border border-border shadow-soft">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-foreground mb-1">Impact</h5>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  124 Citizens Helped
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 justify-end">
          {role === "ADMIN" && (
            <Button
              variant="outline"
              className="rounded-xl font-bold gap-2 bg-background/80 backdrop-blur-sm border-border hover:bg-muted shadow-lg"
              asChild
            >
              <Link href="/dashboard/admin">
                <Users className="w-4 h-4" /> Admin Panel
              </Link>
            </Button>
          )}
          {role === "OFFICER" && (
            <Button
              variant="outline"
              className="rounded-xl font-bold gap-2 bg-background/80 backdrop-blur-sm border-border hover:bg-muted shadow-lg"
              asChild
            >
              <Link href="/dashboard/officer">
                <ClipboardList className="w-4 h-4" /> Officer Panel
              </Link>
            </Button>
          )}
          <Button
            className="rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
            asChild
          >
            <Link href="/dashboard/complaints">
              <ClipboardList className="w-4 h-4" /> Manage My Reports
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
