"use client";

import React from "react";
import {
  Globe,
  Leaf,
  Activity,
  ShieldCheck,
  TrendingUp,
  Award,
  AlertCircle,
  BarChart3,
  Search,
  ArrowUpRight,
  Wind,
  Droplets,
  RefreshCcw,
  Lightbulb,
  ExternalLink,
  Info,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SDG_DATA = [
  {
    id: 1,
    title: "No Poverty",
    value: 88.5,
    target: 100,
    status: "ON_TRACK",
    icon: Award,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    id: 3,
    title: "Good Health",
    value: 92.1,
    target: 100,
    status: "ON_TRACK",
    icon: Activity,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    id: 6,
    title: "Clean Water",
    value: 84.4,
    target: 100,
    status: "AT_RISK",
    icon: Droplets,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    id: 11,
    title: "Sustainable Cities",
    value: 78.9,
    target: 100,
    status: "ON_TRACK",
    icon: Globe,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    id: 13,
    title: "Climate Action",
    value: 4.2,
    target: 1.5,
    status: "BEHIND",
    icon: Wind,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];

const GLOBAL_LEADERBOARD = [
  { city: "Singapore", score: 98.4, sdg: "96%", status: "AAA" },
  { city: "New York", score: 94.2, sdg: "92%", status: "AA+" },
  { city: "Tokyo", score: 92.5, sdg: "90%", status: "AA" },
  { city: "London", score: 89.8, sdg: "88%", status: "A+" },
  { city: "Berlin", score: 88.4, sdg: "85%", status: "A" },
];

const SUSTAINABILITY_TREND = [
  { month: "Jan", co2: 12.4, index: 82 },
  { month: "Feb", co2: 11.2, index: 84 },
  { month: "Mar", co2: 10.8, index: 85 },
  { month: "Apr", co2: 13.1, index: 81 },
  { month: "May", co2: 11.5, index: 86 },
  { month: "Jun", co2: 9.8, index: 89 },
];

export default function UNGovernanceDashboard() {
  const [activeSDG, setActiveSDG] = React.useState<any>(null);
  const [metrics, setMetrics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/sovereign/metrics");
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const getSDGIcon = (goalNumber: number) => {
    switch (goalNumber) {
      case 1:
        return Award;
      case 3:
        return Activity;
      case 6:
        return Droplets;
      case 11:
        return Globe;
      case 13:
        return Wind;
      default:
        return Leaf;
    }
  };

  const getSDGColor = (goalNumber: number) => {
    switch (goalNumber) {
      case 1:
        return { color: "text-red-500", bg: "bg-red-50" };
      case 3:
        return { color: "text-emerald-500", bg: "bg-emerald-50" };
      case 6:
        return { color: "text-blue-500", bg: "bg-blue-50" };
      case 11:
        return { color: "text-indigo-500", bg: "bg-indigo-50" };
      case 13:
        return { color: "text-amber-500", bg: "bg-amber-50" };
      default:
        return { color: "text-slate-500", bg: "bg-slate-50" };
    }
  };

  const sdgData =
    metrics?.sdgs?.map((sdg: any) => ({
      ...sdg,
      id: sdg.goalNumber,
      icon: getSDGIcon(sdg.goalNumber),
      ...getSDGColor(sdg.goalNumber),
      value: sdg.currentValue,
      target: sdg.targetValue,
    })) || SDG_DATA;

  const leaderboard = metrics?.global?.compare || GLOBAL_LEADERBOARD;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                UN Global Governance Console
              </h1>
              <p className="text-slate-500 font-medium text-lg italic">
                Aligning Municipal AI with UN Sustainable Development Goals
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-2xl font-black text-xs uppercase tracking-widest gap-2 bg-white ring-1 ring-slate-100"
          >
            <Award className="w-4 h-4" /> Global Audit Report
          </Button>
          <Button className="rounded-2xl font-black text-xs uppercase tracking-widest bg-primary shadow-xl shadow-primary/20">
            Export SDG Alignment
          </Button>
        </div>
      </div>

      {/* Sustainable Development Goals Grid */}
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-50">
          <CardTitle className="text-2xl font-black flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest">
              REAL-TIME
            </Badge>
            International SDG Monitoring
          </CardTitle>
          <CardDescription>
            Live tracking of universal goals across planetary municipal nodes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {sdgData.map((sdg: any) => (
              <div
                key={sdg.id}
                className={`p-6 rounded-[2rem] transition-all cursor-pointer group relative overflow-hidden ring-1 ring-slate-100 ${activeSDG?.id === sdg.id ? "bg-primary ring-primary" : "bg-white hover:bg-slate-50"}`}
                onMouseEnter={() => setActiveSDG(sdg)}
              >
                <div
                  className={`p-4 rounded-2xl mb-4 w-fit transition-colors ${activeSDG?.id === sdg.id ? "bg-white/20" : sdg.bg}`}
                >
                  <sdg.icon
                    className={`w-6 h-6 ${activeSDG?.id === sdg.id ? "text-white" : sdg.color}`}
                  />
                </div>
                <h4
                  className={`font-black text-sm mb-1 uppercase tracking-tight ${activeSDG?.id === sdg.id ? "text-white" : "text-slate-900"}`}
                >
                  {sdg.title}
                </h4>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-2xl font-black ${activeSDG?.id === sdg.id ? "text-white" : "text-slate-900"}`}
                  >
                    {sdg.value}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${activeSDG?.id === sdg.id ? "text-white/60" : "text-slate-400"}`}
                  >
                    {sdg.unit || (sdg.id === 13 ? "MT CO2" : "%")}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      sdg.status === "ON_TRACK"
                        ? "bg-emerald-100 text-emerald-600"
                        : sdg.status === "AT_RISK"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    {sdg.status}
                  </span>
                  <ArrowUpRight
                    className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeSDG?.id === sdg.id ? "text-white" : "text-primary"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sustainability & Carbon Modeling */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black">
                  Environmental Resonance Modeling
                </CardTitle>
                <CardDescription>
                  AI-driven predictive carbon and sustainability trends
                </CardDescription>
              </div>
              <div className="p-2 bg-slate-50 rounded-2xl flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-[10px] font-black text-slate-500 uppercase">
                    Sustainability Index
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase">
                    CO2 Reductions
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SUSTAINABILITY_TREND}>
                  <defs>
                    <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke="#94a3b8"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "1.5rem",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="index"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorIndex)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="co2"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="transparent"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Global Performance Ranking */}
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" /> Global Leaderboard
            </CardTitle>
            <CardDescription className="text-slate-400">
              Benchmarking municipal performance scores
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {leaderboard.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-6 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-black text-slate-600 w-8">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-black text-sm">
                        {item.city || item.name}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        SDG Alignment: {item.sdg || "92%"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg text-primary">
                      {item.score || 94.2}
                    </p>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-400 text-[9px] px-1.5 font-bold"
                    >
                      {item.status || "AA+"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6">
              <Button
                variant="ghost"
                className="w-full rounded-2xl border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10"
              >
                View Full UN Registry <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Transparency & Sustainability Insights */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="p-8 pb-0">
            <h3 className="text-xl font-black flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" /> Explainable AI
              (XAI) Resilience
            </h3>
            <p className="text-sm font-medium text-slate-500">
              How the AI nodes make sovereign governance decisions
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex gap-6 items-center">
              <div className="w-20 h-20 rounded-full border-4 border-primary border-t-white animate-spin duration-3000 shrink-0" />
              <div>
                <p className="text-xs font-black text-primary mb-1 uppercase tracking-widest">
                  Decision Pulse
                </p>
                <p className="text-[13px] font-bold text-slate-800 leading-relaxed italic">
                  &quot;Prioritizing SDG 6 (Clean Water) infrastructure in Tokyo node
                  because the predictive anomaly sensor detected a 14% drop in
                  hydraulic pressure.&quot;
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Equity Neutrality", value: 99.4 },
                { label: "Bias Mitigation", value: 98.2 },
                { label: "XAI Transparency", value: 96.5 },
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>{metric.label}</span>
                    <span>{metric.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="p-8 pb-0">
            <h3 className="text-xl font-black flex items-center gap-2">
              <RefreshCcw className="w-6 h-6 text-emerald-500" /> Circular
              Economy Ingestion
            </h3>
            <p className="text-sm font-medium text-slate-500">
              Autonomous waste and energy optimization layers
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "Renewable Mix",
                  val: "64%",
                  icon: Lightbulb,
                  color: "text-amber-500",
                },
                {
                  title: "Waste Diversion",
                  val: "92.4%",
                  icon: RefreshCcw,
                  color: "text-emerald-500",
                },
                {
                  title: "Grid Efficiency",
                  val: "98.8%",
                  icon: Zap,
                  color: "text-indigo-500",
                },
                {
                  title: "Water Reuse",
                  val: "45.0%",
                  icon: Droplets,
                  color: "text-blue-500",
                },
              ].map((sys, i) => (
                <div
                  key={i}
                  className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4"
                >
                  <sys.icon className={`w-8 h-8 ${sys.color}`} />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {sys.title}
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      {sys.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-black text-xs uppercase tracking-widest h-14 shadow-lg shadow-emerald-500/20">
              Trigger Circular Optimization
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
