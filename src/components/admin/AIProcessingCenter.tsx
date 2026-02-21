"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  ShieldAlert,
  Copy,
  Route,
  CheckCircle,
  AlertTriangle,
  Activity,
  TrendingUp,
  BarChart3,
  Users,
  Target,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#6366f1",
  "#8b5cf6",
];

export function AIProcessingCenter() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/ai-stats");
        if (res.ok) {
          const data = (await res.ok) ? await res.json() : null;
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch AI stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const cards = [
    {
      title: "AI Processed",
      value: stats?.aiProcessed || 0,
      icon: Brain,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Duplicates",
      value: stats?.duplicates || 0,
      icon: Copy,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Spam Rejected",
      value: stats?.spamRejected || 0,
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Auto Routed",
      value: stats?.autoRouted || 0,
      icon: Route,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  const severityData = Object.entries(stats?.severityStats || {}).map(
    ([name, value]) => ({ name, value }),
  );
  const deptData = Object.entries(stats?.deptDistribution || {}).map(
    ([name, value]) => ({ name, value }),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary fill-primary/20" />
            AI Autonomous Governance
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Real-time AI monitoring and decision tracking
          </p>
        </div>
        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          AI ENGINE ONLINE
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Live
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">
              {card.value}
            </h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {card.title}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Department Load
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  stroke="#64748b"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  stroke="#64748b"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "1rem",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Severity Heatmap
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Panel */}
      <div className="p-8 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-3xl backdrop-blur-xl flex items-center justify-center border border-white/20">
              <Target className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">AI Decision Confidence</h3>
              <p className="text-slate-400 text-sm">
                Average accuracy across all autonomous actions
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-6xl font-black text-primary mb-2">
              {(stats?.averageConfidence * 100).toFixed(0)}%
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-end text-green-400 font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              +2.4% from last week
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
