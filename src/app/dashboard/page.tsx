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
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    console.log("Dashboard - Session Status:", sessionStatus);
    console.log("Dashboard - Session:", session);
    
    if (sessionStatus === "loading") return;
    
    if (sessionStatus === "authenticated") {
      console.log("User is authenticated, fetching complaints...");
      fetchComplaints();
    } else if (sessionStatus === "unauthenticated") {
      setLoading(false);
      console.log("User not authenticated, redirecting to signin...");
      router.push("/auth/signin");
    }
  }, [sessionStatus, router, session]);

  // Role-based redirect
  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user) {
      if (role === "ADMIN") {
        // Admin can stay on main dashboard or go to admin dashboard
      } else if (role === "OFFICER") {
        // Officer can stay on main dashboard or go to officer dashboard
      }
      // Citizens stay on main dashboard
    }
  }, [sessionStatus, session, role]);

  if (loading) {
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
          <p className="text-muted-foreground">Manage assigned complaints and department tasks</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Cases</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Active assignments</p>
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
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-xs text-muted-foreground">Immediate attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/officer/complaints">
            <Button className="rounded-xl font-bold gap-2 shadow-lg shadow-primary/20">
              <ClipboardList className="w-4 h-4" /> Manage Assigned Cases
            </Button>
          </Link>
          <Link href="/dashboard/complaints">
            <Button variant="outline" className="rounded-xl font-bold gap-2 bg-background shadow-sm">
              View All Complaints
            </Button>
          </Link>
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
            <Link href="/dashboard/admin">
              <Button variant="outline" className="rounded-xl font-bold gap-2 bg-background shadow-sm">
                <Users className="w-4 h-4" /> Admin Panel
              </Button>
            </Link>
          )}
          {(role === "OFFICER") && (
            <Link href="/dashboard/officer">
              <Button variant="outline" className="rounded-xl font-bold gap-2 bg-background shadow-sm">
                <ClipboardList className="w-4 h-4" /> Officer Panel
              </Button>
            </Link>
          )}
          <Link href="/dashboard/complaints">
            <Button className="rounded-xl font-bold gap-2 shadow-lg shadow-primary/20">
              <ClipboardList className="w-4 h-4" /> Manage All
            </Button>
          </Link>
          <Link href="/dashboard/map">
            <Button
              variant="outline"
              className="rounded-xl font-bold gap-2 bg-background shadow-sm"
            >
              <MapPin className="w-4 h-4" /> Spatial View
            </Button>
          </Link>
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

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Charts Section */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black">
                  Issue Trajectory
                </CardTitle>
                <CardDescription>Daily report volume analysis</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <TrendChart />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  Spatial Distribution
                </CardTitle>
                <CardDescription>Hotspots by region</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center bg-muted/20">
                <div className="text-center space-y-2">
                  <MapPin className="w-8 h-8 mx-auto text-primary opacity-20" />
                  <p className="text-xs font-bold text-muted-foreground">
                    Map Data Loading...
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  Category Audit
                </CardTitle>
                <CardDescription>Distribution across sectors</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <DepartmentChart />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Priority Triage Feed */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-xl rounded-3xl h-full bg-slate-900 text-white overflow-hidden ring-1 ring-white/10">
            <CardHeader className="border-b border-white/5 pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" /> Priority
                  Triage
                </CardTitle>
                <span className="text-[10px] font-black bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/20">
                  REQUIRED ATTENTION
                </span>
              </div>
              <CardDescription className="text-slate-400">
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Role-based Navigation Header */}
      <div className="flex flex-wrap gap-3 justify-end">
        {role === "ADMIN" && (
          <Link href="/dashboard/admin">
            <Button variant="outline" className="rounded-xl font-bold gap-2 bg-background shadow-sm">
              <Users className="w-4 h-4" /> Admin Panel
            </Button>
          </Link>
        )}
        {role === "OFFICER" && (
          <Link href="/dashboard/officer">
            <Button variant="outline" className="rounded-xl font-bold gap-2 bg-background shadow-sm">
              <ClipboardList className="w-4 h-4" /> Officer Panel
            </Button>
          </Link>
        )}
        <Link href="/dashboard/complaints">
          <Button variant="outline" className="rounded-xl font-bold gap-2 bg-background shadow-sm">
            <History className="w-4 h-4" /> My Complaints
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-primary">
            Jai Hind, {session?.user?.name || "Citizen"}!
          </h2>
          <p className="text-muted-foreground">
            Thank you for contributing to your city&apos;s progress.
          </p>
        </div>
        <div className="flex items-center gap-3 p-2 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-primary leading-none">
              {points}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Total Points
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-blue-600 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <Award className="w-32 h-32" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">
              Reports Filed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black tracking-tighter mb-1">
              {complaints.length}
            </div>
            <p className="text-xs opacity-80">
              Active contributions to JanSankalp
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-green-600 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-32 h-32" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">
              Impact Made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black tracking-tighter mb-1">
              {resolvedCount}
            </div>
            <p className="text-xs opacity-80">
              Issues resolved by your reporting
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-orange-600 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-32 h-32" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">
              Citizen Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black tracking-tighter mb-1">
              Top 5%
            </div>
            <p className="text-xs opacity-80">Leading in city stewardship</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> Recent Reports
              </CardTitle>
              <CardDescription>
                The status of your latest city improvement efforts.
              </CardDescription>
            </div>
            <Link href="/dashboard/my-reports">
              <Button
                variant="ghost"
                size="sm"
                className="font-bold text-primary gap-1"
              >
                View All <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed">
                  No reports filed yet. Start by reporting a problem!
                </div>
              ) : (
                complaints.slice(0, 3).map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors border border-transparent hover:border-primary/10"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 relative">
                      {complaint.imageUrl ? (
                        <NextImage
                          src={complaint.imageUrl}
                          fill
                          className="object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <MapPin className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">
                        {complaint.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={cn(
                            "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter",
                            complaint.status === "RESOLVED"
                              ? "bg-green-100 text-green-700"
                              : complaint.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700",
                          )}
                        >
                          {complaint.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
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
                        className="rounded-xl h-8 text-[10px] font-black uppercase tracking-widest gap-2 bg-background shadow-sm hover:bg-primary hover:text-white transition-all"
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

        <Card className="border-none shadow-sm bg-slate-900 text-white p-2">
          <CardHeader>
            <CardTitle className="text-2xl font-black">
              Citizen Rewards
            </CardTitle>
            <CardDescription className="text-slate-400">
              Redeem your points for local benefits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary font-bold">
                  5%
                </div>
                <div>
                  <p className="font-bold text-sm">Property Tax Discount</p>
                  <p className="text-xs text-slate-400">
                    Available at 5,000 Points
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors opacity-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-bold">
                  Free
                </div>
                <div>
                  <p className="font-bold text-sm">Metro One-Day Pass</p>
                  <p className="text-xs text-slate-400">
                    Available at 1,000 Points
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
