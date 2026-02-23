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
  Target
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 md:p-12 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight">
                  🛡️ Officer Dashboard
                </h1>
                <p className="text-lg md:text-xl text-emerald-100 font-medium">
                  Welcome back, {session?.user?.name || "Officer"}! Ready to serve our community?
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-white/30">
                    Duty Officer
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-xs font-bold text-green-100 border border-green-500/30">
                    On Duty
                  </span>
                  <span className="px-3 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full text-xs font-bold text-yellow-100 border border-yellow-500/30">
                    Level {Math.floor(stats.efficiency / 20) + 1}
                  </span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white leading-none">{stats.efficiency}%</p>
                    <p className="text-sm font-bold text-emerald-100 uppercase tracking-wider">Efficiency Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <ClipboardList className="w-40 h-40 text-white" />
            </div>
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-100">
                📋 Assigned Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-5xl font-black text-white mb-2">{stats.assigned}</div>
              <p className="text-sm text-blue-100 font-medium">Active assignments requiring attention</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{width: `${(stats.assigned / 20) * 100}%`}}></div>
                </div>
                <span className="text-xs text-blue-100 font-bold">Active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-emerald-500 to-green-600">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <CheckCircle className="w-40 h-40 text-white" />
            </div>
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-green-100">
                ✅ Resolved
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-5xl font-black text-white mb-2">{stats.resolved}</div>
              <p className="text-sm text-green-100 font-medium">Successfully resolved this month</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{width: `${(stats.resolved / stats.assigned) * 100}%`}}></div>
                </div>
                <span className="text-xs text-green-100 font-bold">
                  {Math.round((stats.resolved / stats.assigned) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-red-600">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <Clock className="w-40 h-40 text-white" />
            </div>
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-orange-100">
                ⏰ Pending
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-5xl font-black text-white mb-2">{stats.pending}</div>
              <p className="text-sm text-orange-100 font-medium">Awaiting your action</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full animate-pulse" style={{width: `${(stats.pending / stats.assigned) * 100}%`}}></div>
                </div>
                <span className="text-xs text-orange-100 font-bold">Urgent</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-red-500 to-pink-600">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <AlertTriangle className="w-40 h-40 text-white" />
            </div>
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-red-100">
                🚨 High Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-5xl font-black text-white mb-2">{stats.highPriority}</div>
              <p className="text-sm text-red-100 font-medium">Immediate attention required</p>
              <div className="mt-3 flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full ${i <= stats.highPriority ? 'bg-white animate-pulse' : 'bg-white/30'}`}></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics & Quick Actions */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Performance Metrics */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-800">
                    <TrendingUp className="w-5 h-5 text-emerald-600" /> 
                    📊 Performance Metrics
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Your service delivery statistics and efficiency ratings
                  </CardDescription>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                  This Month
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black text-blue-600">{stats.avgResolutionTime}</span>
                  </div>
                  <p className="font-bold text-gray-800">Avg Resolution Time</p>
                  <p className="text-sm text-gray-600 mt-1">Faster than department average</p>
                </div>
                
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black text-green-600">{stats.efficiency}%</span>
                  </div>
                  <p className="font-bold text-gray-800">Efficiency Rate</p>
                  <p className="text-sm text-gray-600 mt-1">Top performer this quarter</p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black text-purple-600">4.8</span>
                  </div>
                  <p className="font-bold text-gray-800">Citizen Rating</p>
                  <p className="text-sm text-gray-600 mt-1">Excellent service feedback</p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black text-orange-600">15</span>
                  </div>
                  <p className="font-bold text-gray-800">Days on Duty</p>
                  <p className="text-sm text-gray-600 mt-1">Consistent performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/10 to-transparent"></div>
            <CardHeader className="relative z-10 border-b border-white/10">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                ⚡ Quick Actions
              </CardTitle>
              <CardDescription className="text-slate-300">
                Access your most frequently used tools
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 p-6 space-y-3">
              <Link href="/dashboard/officer/complaints">
                <Button className="w-full justify-start gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg rounded-xl font-bold transition-all duration-300 hover:scale-[1.02]">
                  <ClipboardList className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-bold">Manage Cases</div>
                    <div className="text-xs opacity-80">View and update assignments</div>
                  </div>
                </Button>
              </Link>
              
              <Link href="/dashboard/complaints">
                <Button variant="outline" className="w-full justify-start gap-3 bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-xl font-bold transition-all duration-300 hover:scale-[1.02]">
                  <MapPin className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-bold">View All</div>
                    <div className="text-xs opacity-80">Browse all complaints</div>
                  </div>
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full justify-start gap-3 bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-xl font-bold transition-all duration-300 hover:scale-[1.02]">
                <ArrowUpRight className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">Generate Report</div>
                  <div className="text-xs opacity-80">Monthly performance summary</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Priority Alerts */}
        {stats.highPriority > 0 && (
          <Card className="border-0 shadow-xl bg-gradient-to-r from-red-500 to-orange-600 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <CardHeader className="relative z-10 border-b border-white/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  🚨 Priority Alert
                </CardTitle>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-white/30 animate-pulse">
                  {stats.highPriority} Urgent
                </span>
              </div>
              <CardDescription className="text-red-100">
                High priority cases require immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg mb-1">Immediate Action Required</p>
                  <p className="text-sm text-red-100">You have {stats.highPriority} high-priority cases waiting for your response</p>
                </div>
                <Link href="/dashboard/officer/complaints">
                  <Button className="bg-white text-red-600 hover:bg-red-50 font-bold rounded-xl shadow-lg">
                    Take Action
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
