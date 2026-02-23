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
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Officer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage assigned complaints and department tasks
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Assigned Cases
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Active assignments
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">8</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">4</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                High Priority
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-xs text-muted-foreground">
                Immediate attention
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            className="rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
            asChild
          >
            <Link href="/dashboard/officer/complaints">
              <ClipboardList className="w-4 h-4" /> Manage Assigned Cases
            </Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-xl font-bold gap-2 bg-background shadow-sm"
            asChild
          >
            <Link href="/dashboard/complaints">View All Complaints</Link>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-primary">
            Governance Dashboard
          </h2>
          <p className="text-muted-foreground mt-1 font-medium">
            Administrative oversight and real-time civic intelligence.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={refresh}
            variant="outline"
            className="rounded-xl font-bold gap-2 bg-background shadow-sm"
          >
            <History className="w-4 h-4" /> Refresh
          </Button>
          {role === "ADMIN" && (
            <Button
              variant="outline"
              className="rounded-xl font-bold gap-2 bg-background shadow-sm"
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
              className="rounded-xl font-bold gap-2 bg-background shadow-sm"
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
              <ClipboardList className="w-4 h-4" /> Manage All
            </Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-xl font-bold gap-2 bg-background shadow-sm"
            asChild
          >
            <Link href="/dashboard/map">
              <MapPin className="w-4 h-4" /> Spatial View
            </Link>
          </Button>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="hover:shadow-2xl transition-all border-none bg-card shadow-sm group rounded-3xl overflow-hidden relative"
          >
            <div
              className={`absolute top-0 left-0 w-1 h-full ${stat.color.replace("text", "bg")}`}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                {stat.label}
              </CardTitle>
              <stat.icon
                className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tabular-nums tracking-tighter">
                {stat.value}
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-2">
                <span
                  className={cn(
                    "flex items-center font-black",
                    stat.trend.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600",
                  )}
                >
                  <ArrowUpRight
                    className={cn(
                      "w-3 h-3 mr-0.5",
                      !stat.trend.startsWith("+") && "rotate-90",
                    )}
                  />
                  {stat.trend}
                </span>{" "}
                vs last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Federated Learning Monitor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-primary flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-500" /> Decentralized AI Consensus
          </h2>
          <span className="text-[10px] font-black bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">
            Federated Mode Active
          </span>
        </div>
        <FLDashboard />
      </div>

      {/* IoT & Infrastructure Monitoring */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-primary flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-500" /> Predictive
            Infrastructure Monitor
          </h2>
          <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
            IoT + Satellite Active
          </span>
        </div>
        <InfraDashboard />
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Charts Section */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-white/20">
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Issue Trajectory
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Daily report volume analysis
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <TrendChart />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Spatial Distribution
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Hotspots by region
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
                <div className="text-center space-y-3">
                  <MapPin className="w-12 h-12 mx-auto text-emerald-600 opacity-60" />
                  <p className="text-sm font-bold text-emerald-700">
                    Map Data Loading...
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Category Audit
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Distribution across sectors
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <DepartmentChart />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Priority Triage Feed */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-2xl rounded-3xl h-full bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden ring-2 ring-white/10 hover:ring-4 hover:shadow-3xl transition-all duration-300">
            <CardHeader className="border-b border-white/10 pb-8 bg-gradient-to-r from-slate-800 to-slate-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400" /> Priority
                  <span className="ml-2">Triage</span>
                </CardTitle>
                <span className="text-[10px] font-black bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30 uppercase tracking-widest">
                  REQUIRED ATTENTION
                </span>
              </div>
              <CardDescription className="text-slate-300">
                High severity issues requiring immediate resolution.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {highPriority.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-10" />
                    <p className="font-bold">No high-priority issues</p>
                  </div>
                ) : (
                  highPriority.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="min-w-0">
                          <p className="font-black text-sm truncate group-hover:text-primary transition-colors">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                            <MapPin className="w-3 h-3" /> {item.region}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[10px] font-black border border-red-500/10">
                          S{item.severity}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          {format(new Date(item.createdAt), "MMM d, h:mm a")}
                        </p>
                        <Link href={`/dashboard/complaints?id=${item.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-[10px] font-black hover:bg-white/10 text-primary"
                          >
                            RESOLVE <ArrowUpRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <div className="p-6 border-t border-white/5 bg-white/5">
              <Link href="/dashboard/complaints">
                <Button className="w-full rounded-xl font-black text-xs bg-white text-slate-900 hover:bg-white/90">
                  VIEW FULL COMMAND FEED
                </Button>
              </Link>
            </div>
          </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Section with Personalized Welcome */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Welcome back,{" "}
                <span className="text-yellow-400 capitalize">
                  {session?.user?.name || "Citizen"}
                </span>
              </h2>
              <p className="text-blue-100 text-lg font-medium max-w-xl">
                Your active participation is shaping a better Bharat. Track your
                impact and reports below.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-black text-white leading-none">
                  {points}
                </p>
                <p className="text-sm font-bold text-blue-100 uppercase tracking-wider">
                  Impact Points
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/dashboard/my-reports" className="block outline-none">
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
                <Award className="w-40 h-40 text-white" />
              </div>
              <CardHeader className="relative z-10 pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-100">
                  📝 Reports Filed
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-black text-white mb-2">
                  {complaints.length}
                </div>
                <p className="text-sm text-blue-100 font-medium">
                  Active contributions to civic progress
                </p>
                <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${Math.min((complaints.length / 10) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/my-reports" className="block outline-none">
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-emerald-500 to-green-600 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
                <CheckCircle className="w-40 h-40 text-white" />
              </div>
              <CardHeader className="relative z-10 pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-green-100">
                  ✅ Impact Made
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-black text-white mb-2">
                  {resolvedCount}
                </div>
                <p className="text-sm text-green-100 font-medium">
                  Issues resolved through your action
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{
                        width: `${complaints.length > 0 ? (resolvedCount / complaints.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-green-100 font-bold">
                    {complaints.length > 0
                      ? Math.round((resolvedCount / complaints.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/rewards" className="block outline-none">
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-pink-600 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="w-40 h-40 text-white" />
              </div>
              <CardHeader className="relative z-10 pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-purple-100">
                  🏆 Citizen Rank
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-black text-white mb-2">
                  Top 5%
                </div>
                <p className="text-sm text-purple-100 font-medium">
                  Leading in city stewardship
                </p>
                <div className="mt-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full ${i <= 4 ? "bg-white" : "bg-white/30"}`}
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Reports & Rewards Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Reports Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-800">
                    <History className="w-5 h-5 text-blue-600" />
                    📋 Your Recent Reports
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Track the status of your civic contributions
                  </CardDescription>
                </div>
                <Link href="/dashboard/my-reports">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-bold text-blue-600 gap-1 border-blue-200 hover:bg-blue-50 rounded-xl"
                  >
                    View All <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : complaints.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ClipboardList className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      No reports filed yet
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Be the change - start by reporting a city issue!
                    </p>
                    <Link href="/dashboard/complaints">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                        File Your First Report
                      </Button>
                    </Link>
                  </div>
                ) : (
                  complaints.slice(0, 3).map((complaint) => (
                    <div
                      key={complaint.id}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:shadow-lg"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative group-hover:scale-105 transition-transform">
                        {complaint.imageUrl ? (
                          <NextImage
                            src={complaint.imageUrl}
                            fill
                            className="object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                            <MapPin className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                          {complaint.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={cn(
                              "text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter border",
                              complaint.status === "RESOLVED"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : complaint.status === "IN_PROGRESS"
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : "bg-orange-100 text-orange-700 border-orange-200",
                            )}
                          >
                            {complaint.status === "RESOLVED"
                              ? "✅ Resolved"
                              : complaint.status === "IN_PROGRESS"
                                ? "🔄 In Progress"
                                : "⏳ Pending"}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">
                            {format(
                              new Date(complaint.createdAt),
                              "MMM d, h:mm a",
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl h-8 text-[10px] font-black uppercase tracking-widest gap-2 bg-white border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                          onClick={() => generateComplaintReceipt(complaint)}
                        >
                          <FileDown className="w-3.5 h-3.5" /> Receipt
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Citizen Rewards Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent"></div>
            <CardHeader className="relative z-10 border-b border-white/10">
              <CardTitle className="text-2xl font-black flex items-center gap-2">
                🎁 Citizen Rewards
              </CardTitle>
              <CardDescription className="text-slate-300">
                Redeem your impact points for exclusive benefits
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 p-6 space-y-4">
              <Link href="/dashboard/rewards" className="block outline-none">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 flex items-center justify-between group cursor-pointer hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      5%
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">
                        Property Tax Discount
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Available at 5,000 Points
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((points / 5000) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400 font-bold">
                          {Math.min(Math.round((points / 5000) * 100), 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              <Link
                href={points >= 1000 ? "/dashboard/rewards" : "#"}
                className={cn(
                  "block outline-none",
                  points < 1000 && "pointer-events-none",
                )}
              >
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between group transition-all duration-300 ${
                    points >= 1000
                      ? "bg-gradient-to-r from-white/10 to-white/5 border-white/20 cursor-pointer hover:bg-white/15 hover:scale-[1.02]"
                      : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
                        points >= 1000
                          ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      Free
                    </div>
                    <div>
                      <p className="font-bold text-sm">Metro One-Day Pass</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {points >= 1000
                          ? "Available now!"
                          : `Need ${1000 - points} more points`}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              points >= 1000
                                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                : "bg-white/10"
                            }`}
                            style={{
                              width: `${Math.min((points / 1000) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400 font-bold">
                          {Math.min(Math.round((points / 1000) * 100), 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-bold text-blue-300">Next Milestone</p>
                </div>
                <p className="text-sm text-slate-300">
                  Earn {1000 - (points % 1000)} more points to unlock Premium
                  Rewards
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 justify-end">
          {role === "ADMIN" && (
            <Button
              variant="outline"
              className="rounded-xl font-bold gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 shadow-lg"
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
              className="rounded-xl font-bold gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 shadow-lg"
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
