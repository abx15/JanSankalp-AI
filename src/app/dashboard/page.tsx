"use client";

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
  FileText,
  ArrowUpRight,
  Landmark,
} from "lucide-react";
import { DepartmentChart, TrendChart } from "@/components/dashboard/Charts";
import { RealTimeNotifications } from "@/components/dashboard/RealTimeNotifications";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Complaints",
      value: "1,284",
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
      value: "156",
      icon: Clock,
      color: "text-orange-600",
      trend: "-2%",
    },
    {
      label: "High Severity",
      value: "42",
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
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Governance Intelligence
          </h2>
          <p className="text-muted-foreground">
            Real-time civic analytics and AI-prioritization.
          </p>
        </div>
        <div className="flex gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full border">
          <span className="text-green-500">●</span> Live Updates Active
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="hover:shadow-md transition-all border-l-4 border-l-primary/10"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span
                  className={
                    stat.trend.startsWith("+")
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {stat.trend}
                </span>
                vs last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Issue Trends</CardTitle>
            <CardDescription>
              Daily complaint volume across all sectors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart />
          </CardContent>
        </Card>
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Resolution vs Pending ratio.</CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Critical Reports</CardTitle>
              <CardDescription>
                AI-flagged high priority issues.
              </CardDescription>
            </div>
            <button className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Major Water Leakage",
                  area: "Sector 4",
                  time: "2 min ago",
                  severity: 5,
                },
                {
                  title: "Garbage Pile Up",
                  area: "Model Town",
                  time: "15 min ago",
                  severity: 3,
                },
                {
                  title: "Streetlight Malfunction",
                  area: "MG Road",
                  time: "45 min ago",
                  severity: 2,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-muted-foreground/10 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg",
                      item.severity >= 5
                        ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600",
                    )}
                  >
                    {item.severity}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.area} • {item.time}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-tight">
                    Details
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm bg-primary text-primary-foreground overflow-hidden relative border-none">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Landmark className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-white">Officer Task Force</CardTitle>
            <CardDescription className="text-white/70">
              Resource efficiency tracker.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
              <div>
                <p className="text-3xl font-bold font-mono">24</p>
                <p className="text-[10px] opacity-70 uppercase font-bold tracking-wider">
                  Officers Active
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-accent font-mono">9.2</p>
                <p className="text-[10px] opacity-70 uppercase font-bold tracking-wider">
                  Avg Resolution Rating
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Top Performing Units
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[10px] font-bold">
                  S4
                </div>
                <div className="flex-1 text-sm font-medium">
                  Sector 4 Response Unit
                </div>
                <div className="text-xs bg-accent text-primary px-2 py-0.5 rounded font-bold">
                  98%
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[10px] font-bold">
                  MG
                </div>
                <div className="flex-1 text-sm font-medium">
                  MG Road Lighting Dept
                </div>
                <div className="text-xs bg-accent text-primary px-2 py-0.5 rounded font-bold">
                  92%
                </div>
              </div>
            </div>
            <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold py-6 rounded-xl mt-4 border-none shadow-lg">
              Generate City Report PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
