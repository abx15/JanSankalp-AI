"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
  Play
} from "lucide-react";

export default function OfficerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("Officer Dashboard - Session Status:", status);
    console.log("Officer Dashboard - User Role:", session?.user?.role);
    
    if (status === "loading") return;

    if (!session) {
      console.log("No session found, redirecting to signin...");
      router.push("/auth/signin");
      return;
    }

    if (session?.user?.role !== "OFFICER" && session?.user?.role !== "ADMIN") {
      console.log("Access denied - User role:", session?.user?.role);
      router.push("/dashboard");
      return;
    }
    
    console.log("Officer dashboard access granted for:", session?.user?.role);
  }, [session, status, router]);

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading Officer Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session?.user?.role !== "OFFICER") {
    return null;
  }

  // Mock data for demonstration
  const stats = {
    assigned: 12,
    resolved: 8,
    pending: 4,
    highPriority: 2,
    efficiency: 75,
    avgResolutionTime: "2.5 days"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              👮‍♂️ Officer Portal - {session?.user?.name || "Officer"}
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              🏢 {session?.user?.department || "Water Department"} | On Duty
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-xl h-11 px-5 border-border font-semibold gap-2 hover:bg-muted transition-all active:scale-95"
            >
              <History className="w-4 h-4" /> Refresh
            </Button>
          </div>
        </div>

        {/* Today's Overview Stats */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "📋 Assigned Cases",
              value: stats.assigned.toString(),
              icon: ClipboardList,
              color: "blue",
              description: "Active assignments"
            },
            {
              label: "⚡ Pending Cases", 
              value: stats.pending.toString(),
              icon: Clock,
              color: "orange",
              description: "Awaiting action"
            },
            {
              label: "✅ Resolved Cases",
              value: stats.resolved.toString(),
              icon: CheckCircle,
              color: "green", 
              description: "Successfully completed"
            },
            {
              label: "🚨 High Priority",
              value: stats.highPriority.toString(),
              icon: AlertTriangle,
              color: "red",
              description: "Immediate attention"
            }
          ].map((stat, index) => (
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
              <p className="text-xs text-slate-500 mt-2">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Priority Queue */}
        <div className="p-8 rounded-[2rem] bg-card border border-border shadow-soft">
          <h3 className="text-xl font-bold text-foreground mb-6">🎯 Priority Queue</h3>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>High Priority ({stats.highPriority})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Medium Priority ({stats.pending - stats.highPriority})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Low Priority ({stats.assigned - stats.pending})</span>
            </div>
          </div>
        </div>

        {/* My Assigned Cases */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">📱 My Assigned Cases</h3>
            <Link href="/dashboard/officer/complaints">
              <Button className="rounded-xl h-11 px-6 font-bold bg-primary hover:bg-primary/90 text-white shadow-soft transition-all active:scale-95 gap-2">
                <ClipboardList className="w-4 h-4" /> Manage All Cases
              </Button>
            </Link>
          </div>

          {/* Mock Case Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                id: "COMP-2026-0456",
                title: "Water Supply Disruption",
                category: "💧 Water Supply",
                severity: "🔴 High",
                location: "📍 Sector 15",
                filed: "2 days ago",
                citizen: "Arun Kumar"
              },
              {
                id: "COMP-2026-0453", 
                title: "Pipeline Leak",
                category: "💧 Pipeline Leak",
                severity: "🟡 Medium",
                location: "📍 Sector 27",
                filed: "1 day ago",
                citizen: "Meera Patel"
              }
            ].map((complaint) => (
              <div
                key={complaint.id}
                className="p-6 rounded-[2rem] bg-card border border-border shadow-soft hover:border-primary/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0">
                    <h4 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {complaint.id}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">{complaint.title}</p>
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold border border-red-100">
                    {complaint.severity.includes("High") ? "HIGH" : complaint.severity.includes("Medium") ? "MEDIUM" : "LOW"}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>{complaint.category}</span>
                    <span>•</span>
                    <span>{complaint.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>👤 {complaint.citizen}</span>
                    <span>•</span>
                    <span>📅 {complaint.filed}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link href={`/dashboard/officer/complaints?id=${complaint.id}`}>
                    <Button size="sm" className="rounded-lg gap-2">
                      <Eye className="w-4 h-4" /> View Details
                    </Button>
                  </Link>
                  <Link href={`/dashboard/officer/complaints?id=${complaint.id}&action=start`}>
                    <Button size="sm" variant="outline" className="rounded-lg gap-2">
                      <Play className="w-4 h-4" /> Start Work
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Performance */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="p-8 rounded-[2rem] bg-card border border-border shadow-soft">
            <h3 className="text-xl font-bold text-foreground mb-6">📊 Department Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Resolution Rate</span>
                <span className="font-bold text-green-600">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Avg Time</span>
                <span className="font-bold text-blue-600">18h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Satisfaction</span>
                <span className="font-bold text-purple-600">4.6/5</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-card border border-border shadow-soft">
            <h3 className="text-xl font-bold text-foreground mb-6">🗺️ Today's Route</h3>
            <div className="h-48 bg-muted rounded-2xl border border-dashed border-border flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-400">Interactive Map</p>
                <p className="text-xs text-slate-500 mt-1">Showing assigned complaint locations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
