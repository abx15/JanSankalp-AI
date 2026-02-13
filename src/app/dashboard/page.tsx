"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
} from "lucide-react";
import { DepartmentChart, TrendChart } from "@/components/dashboard/Charts";
import { RealTimeNotifications } from "@/components/dashboard/RealTimeNotifications";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // @ts-ignore
  const role = session?.user?.role || "CITIZEN";
  // @ts-ignore
  const points = session?.user?.points || 0;

  useEffect(() => {
    fetch("/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data.complaints || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (role === "ADMIN") {
    return <AdminDashboard complaints={complaints} loading={loading} />;
  }

  return (
    <CitizenDashboard
      complaints={complaints}
      points={points}
      loading={loading}
      session={session}
    />
  );
}

function AdminDashboard({
  complaints,
  loading,
}: {
  complaints: any[];
  loading: boolean;
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
      value: "85%",
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <RealTimeNotifications />
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-primary">
            Governance Intelligence
          </h2>
          <p className="text-muted-foreground">
            Real-time city-wide civic analytics powered by JanSankalp AI.
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground bg-muted px-4 py-1.5 rounded-full border">
          <span className="text-green-500 animate-pulse">●</span> Live
          Monitoring Active
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="hover:shadow-xl transition-all border-none bg-card shadow-sm group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon
                className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tabular-nums tracking-tighter">
                {stat.value}
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                <span
                  className={
                    stat.trend.startsWith("+")
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {stat.trend}
                </span>{" "}
                Increase this week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Issue Trends</CardTitle>
            <CardDescription>
              Daily complaint volume trajectory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart />
          </CardContent>
        </Card>
        <Card className="col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Dept. Performance
            </CardTitle>
            <CardDescription>
              Efficiency by administrative sector.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CitizenDashboard({
  complaints,
  points,
  loading,
  session,
}: {
  complaints: any[];
  points: number;
  loading: boolean;
  session: any;
}) {
  const resolvedCount = complaints.filter(
    (c) => c.status === "RESOLVED",
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-primary">
            Jai Hind, {session?.user?.name || "Citizen"}!
          </h2>
          <p className="text-muted-foreground">
            Thank you for contributing to your city's progress.
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
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      {complaint.imageUrl ? (
                        <img
                          src={complaint.imageUrl}
                          className="w-full h-full object-cover"
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
