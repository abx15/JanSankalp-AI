"use client";

import React from "react";
import {
  Shield,
  Activity,
  Map,
  Zap,
  Server,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Wifi,
  Lock,
  ArrowRightLeft,
  PieChart as PieChartIcon,
  RefreshCcw,
  BarChart3,
  Globe,
  Database,
  LockKeyhole,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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
import { ScrollArea } from "@/components/ui/scroll-area";

const STATE_HEALTH = [
  { state: "California", health: 94, load: "82%", status: "OPTIMAL" },
  { state: "Texas", health: 88, load: "91%", status: "HIGH_LOAD" },
  { state: "Florida", health: 92, load: "75%", status: "OPTIMAL" },
  { state: "New York", health: 85, load: "88%", status: "ANOMALY_DETECTED" },
  { state: "Illinois", health: 96, load: "64%", status: "OPTIMAL" },
];

const NATIONAL_ANOMALIES = [
  {
    id: "SEC-402",
    title: "Nationwide DNS Probe",
    severity: "HIGH",
    node: "Federal Backbone",
    time: "2m ago",
  },
  {
    id: "INF-109",
    title: "Grid Frequency Deviation",
    severity: "MEDIUM",
    node: "NE Power Cluster",
    time: "14m ago",
  },
  {
    id: "CIV-882",
    title: "Mass Transit Delay Prediction",
    severity: "LOW",
    node: "Chicago Metro AI",
    time: "1h ago",
  },
  {
    id: "ECON-01",
    title: "Currency Velocity Spike",
    severity: "CRITICAL",
    node: "Central Bank Node",
    time: "Just Now",
  },
];

const SOVEREIGN_IDENTITY_METRICS = [
  { subject: "mTLS Integrity", A: 99, fullMark: 100 },
  { subject: "SPIFFE Auth", A: 96, fullMark: 100 },
  { subject: "E2E Encryption", A: 100, fullMark: 100 },
  { subject: "Zero Trust Score", A: 92, fullMark: 100 },
  { subject: "Key Rotation", A: 88, fullMark: 100 },
];

export default function NationalCommandCenter() {
  const [activeNode, setActiveNode] = React.useState<string | null>(null);
  const [metrics, setMetrics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/sovereign/metrics");
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch national metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 20000); // 20s for National Command
    return () => clearInterval(interval);
  }, []);

  const infraHealth =
    metrics?.infrastructure?.map((node: any) => ({
      state: node.name,
      health: node.health,
      load: "74%",
      status: node.status === "OPERATIONAL" ? "OPTIMAL" : "ANOMALY_DETECTED",
    })) || STATE_HEALTH;

  const anomalies =
    metrics?.crises?.map((crisis: any) => ({
      id: crisis.id.slice(-4).toUpperCase(),
      title: crisis.type.replace("_", " "),
      severity: crisis.severity,
      node: crisis.nodeId ? "Regional Hub" : "National Hub",
      time: "Just Now",
    })) || NATIONAL_ANOMALIES;

  const defconLevel =
    metrics?.crises?.length > 1
      ? "DEFCON 2"
      : metrics?.crises?.length > 0
        ? "DEFCON 3"
        : "DEFCON 4";

  return (
    <div className="p-8 space-y-8 bg-[#020617] text-slate-100 min-h-screen font-mono">
      {/* Header with Pulse */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-red-600/10 flex items-center justify-center border border-red-500/20 animate-pulse">
              <Shield className="w-10 h-10 text-red-500 shadow-red-500/50" />
            </div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-[calc(-0.05em)] uppercase">
              National AI Command Console
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                  Sovereign Brain Online
                </span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Version 4.0.1-SOVEREIGN
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              label: "Active Nodes",
              val: metrics?.global?.cities || "1,242",
              color: "text-indigo-400",
            },
            {
              label: "Sync Latency",
              val: metrics?.global?.resolutionTime || "14ms",
              color: "text-emerald-400",
            },
            { label: "Alert Level", val: defconLevel, color: "text-amber-400" },
            { label: "AI Reliability", val: "99.98%", color: "text-primary" },
          ].map((stat, i) => (
            <div key={i} className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight">
                {stat.label}
              </p>
              <p className={`text-xl font-black tabular-nums ${stat.color}`}>
                {stat.val}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* National Health Grid Map/Bars */}
        <Card className="lg:col-span-3 bg-slate-900/40 border-slate-800 rounded-[2.5rem] shadow-none overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                  <Globe className="w-6 h-6 text-primary" /> Multi-State
                  Infrastructure Health
                </CardTitle>
                <CardDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                  Real-time Digital Twin Synchronization
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-slate-700 hover:bg-slate-800 text-slate-400 font-black text-[10px] uppercase gap-2"
              >
                <RefreshCcw className="w-3 h-3" /> Resync Nodes
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={infraHealth}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#1e293b"
                  />
                  <XAxis
                    dataKey="state"
                    axisLine={false}
                    tickLine={false}
                    stroke="#475569"
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    stroke="#475569"
                    fontSize={11}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "1rem",
                    }}
                  />
                  <Bar dataKey="health" radius={[8, 8, 0, 0]} barSize={100}>
                    {infraHealth.map((entry: any, index: number) => (
                      <Cell
                        key={index}
                        fill={
                          entry.status === "ANOMALY_DETECTED"
                            ? "#ef4444"
                            : "#3b82f6"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Anomaly Feed */}
        <Card className="lg:col-span-1 bg-slate-900/40 border-slate-800 rounded-[2.5rem] shadow-none overflow-hidden flex flex-col">
          <CardHeader className="p-8 bg-black/20">
            <CardTitle className="text-xl font-black text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-red-500" /> Neural Anomaly Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-grow">
            <ScrollArea className="h-[480px]">
              <div className="divide-y divide-slate-800">
                {anomalies.map((alert: any, i: number) => (
                  <div
                    key={i}
                    className="p-6 hover:bg-white/5 transition-colors group cursor-pointer border-l-4 border-l-transparent hover:border-l-primary"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className={`text-[8px] font-black tracking-[0.1em] px-2 rounded-lg border-none ${
                          alert.severity === "CRITICAL"
                            ? "bg-red-500/20 text-red-500"
                            : alert.severity === "HIGH"
                              ? "bg-amber-500/20 text-amber-500"
                              : "bg-slate-700/50 text-slate-400"
                        }`}
                      >
                        {alert.severity}
                      </Badge>
                      <span className="text-[9px] font-medium text-slate-600">
                        {alert.time}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-200 group-hover:text-primary transition-colors">
                      {alert.title}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                      Node: {alert.node}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Sovereign Security & Identity */}
        <Card className="bg-slate-900/40 border-slate-800 rounded-[2.5rem] shadow-none overflow-hidden h-full">
          <CardHeader className="p-10 border-b border-slate-800">
            <CardTitle className="text-xl font-black text-white flex items-center gap-2">
              <LockKeyhole className="w-6 h-6 text-emerald-400" /> Sovereign
              Security Mesh
            </CardTitle>
            <CardDescription className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              mTLS & SPIFFE Identity Integrity Score
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 grid md:grid-cols-2 gap-10 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={SOVEREIGN_IDENTITY_METRICS}
                >
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#64748b", fontSize: 10 }}
                  />
                  <Radar
                    name="SOVEREIGN"
                    dataKey="A"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-6">
              {[
                {
                  label: "Encryption Grade",
                  val: "QUANTUM-LIMIT",
                  status: "STABLE",
                },
                {
                  label: "Identity Rotation",
                  val: "EVERY 300s",
                  status: "ACTIVE",
                },
                {
                  label: "Zero Trust Tunnel",
                  val: "AES-256-GCM",
                  status: "ENFORCED",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white/5 border border-white/5"
                >
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {item.label}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm font-black text-slate-200">
                      {item.val}
                    </span>
                    <span className="text-[8px] font-black text-emerald-400/80 tracking-widest">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reallocation Engine */}
        <Card className="bg-slate-900/40 border-slate-800 rounded-[2.5rem] shadow-none overflow-hidden h-full">
          <CardHeader className="p-10 flex flex-row items-center justify-between border-b border-slate-800">
            <div>
              <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                <ArrowRightLeft className="w-6 h-6 text-primary" /> Resource
                Reallocation Engine
              </CardTitle>
              <CardDescription className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                AI-Guided Crisis Balancing
              </CardDescription>
            </div>
            <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black px-4 py-1.5 uppercase">
              Autonomous Mode
            </Badge>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            <div className="flex items-center justify-between gap-6">
              <div className="p-6 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 text-center w-full">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                  Source Node
                </p>
                <p className="text-sm font-black text-indigo-300">
                  Reserve Node 04
                </p>
              </div>
              <div className="flex-shrink-0 animate-pulse">
                <ArrowRightLeft className="w-8 h-8 text-slate-600" />
              </div>
              <div className="p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-center w-full">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">
                  Target Cluster
                </p>
                <p className="text-sm font-black text-red-300">
                  Manhattan Sector 2
                </p>
              </div>
            </div>

            <div className="bg-black/40 p-8 rounded-[2rem] border border-slate-800">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                Command Strategy
              </h5>
              <p className="text-sm font-bold text-slate-300 leading-relaxed italic">
                "Initiating emergency energy load balancing to Sector 2. Routing
                medical personnel from Reserves 04 via autonomous VTOL network.
                ETA: 14 Minutes. Reason: Hurricane surge detected in lower
                grid."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button className="rounded-2xl h-14 bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-white shadow-xl shadow-white/5">
                Confirm Deployment
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl h-14 border-slate-700 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-800"
              >
                Override AI Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terminal Footer */}
      <div className="p-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
        <div className="flex gap-10">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Mainframe Link: STABLE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Satellite Sync: SECURE
            </span>
          </div>
        </div>
        <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">
          JanSankalp National Sovereign Grid &copy; 2026
        </p>
      </div>
    </div>
  );
}
