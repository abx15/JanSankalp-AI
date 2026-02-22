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
  Shield,
  Search,
  Settings,
  RefreshCw,
  Play,
  ArrowRight,
  Info,
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
  AreaChart,
  Area,
  PieChart,
  Pie,
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
import { Input } from "@/components/ui/input";

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
  const [telemetry, setTelemetry] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [surges, setSurges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [simParams, setSimParams] = useState({
    district: "Global",
    intensity: 0.1,
  });
  const [simResult, setSimResult] = useState<any>(null);

  const fetchAll = async () => {
    try {
      const [statsRes, telRes, sugRes, surRes] = await Promise.all([
        fetch("/api/admin/ai-stats"),
        fetch("/api/admin/governance?type=telemetry"),
        fetch("/api/admin/governance?type=suggestions"),
        fetch("/api/admin/governance?type=surges"),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (telRes.ok) setTelemetry((await telRes.json()).data);
      if (sugRes.ok) setSuggestions((await sugRes.json()).data);
      if (surRes.ok) setSurges((await surRes.json()).data);
    } catch (err) {
      console.error("Governance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      await fetch("/api/admin/governance?type=optimize", {
        method: "POST",
        body: JSON.stringify({}),
      });
      await fetchAll();
    } finally {
      setOptimizing(false);
    }
  };

  const handleSimulate = async () => {
    try {
      const res = await fetch("/api/admin/governance?type=simulate", {
        method: "POST",
        body: JSON.stringify(simParams),
      });
      const data = await res.json();
      setSimResult(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Activity className="w-10 h-10 animate-spin text-primary" />
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
      title: "Governance Efficiency",
      value: `${((telemetry?.governance_efficiency_index || 0.85) * 100).toFixed(0)}%`,
      icon: Target,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Self-Healing Events",
      value: telemetry?.self_healing_events?.length || 0,
      icon: Activity,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Active Surges",
      value: surges.length,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Sovereign AI Terminal
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            Autonomous Governance · Self-Learning Core · Policy Sandbox
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchAll}
            className="rounded-2xl font-black text-xs uppercase tracking-widest gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <Button
            onClick={handleOptimize}
            disabled={optimizing}
            className="rounded-2xl font-black text-xs uppercase tracking-widest gap-2 bg-primary"
          >
            {optimizing ? (
              <Activity className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            {optimizing ? "Optimizing..." : "Trigger RL Loop"}
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => (
          <Card
            key={idx}
            className="border-none shadow-sm rounded-3xl overflow-hidden ring-1 ring-slate-100"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${card.bg}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Autonomous
                </span>
              </div>
              <p className="text-3xl font-black text-slate-900">{card.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                {card.title}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Policy Sandbox */}
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50">
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" /> Policy Simulation
              Sandbox
            </CardTitle>
            <CardDescription>
              Model governance changes before deployment
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Target District
                </label>
                <select
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 text-sm font-bold px-4 py-3"
                  value={simParams.district}
                  onChange={(e) =>
                    setSimParams({ ...simParams, district: e.target.value })
                  }
                >
                  <option>Global</option>
                  <option>Central District</option>
                  <option>North District</option>
                  <option>South District</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Shift Intensity: {Math.round(simParams.intensity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simParams.intensity * 100}
                  onChange={(e) =>
                    setSimParams({
                      ...simParams,
                      intensity: parseInt(e.target.value) / 100,
                    })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 my-4"
                />
              </div>
              <Button
                onClick={handleSimulate}
                className="w-full rounded-2xl font-black py-6 bg-indigo-600 hover:bg-indigo-700 gap-2"
              >
                <Play className="w-4 h-4" /> Run Simulation
              </Button>
            </div>

            {simResult && (
              <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 animate-in slide-in-from-top-2 duration-300">
                <h4 className="font-black text-indigo-900 mb-4 flex items-center justify-between">
                  Simulation Output{" "}
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full ring-1 ring-indigo-200 text-indigo-600">
                    {simResult.simulation_id}
                  </span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(simResult.metrics).map(([k, v]: any) => (
                    <div key={k}>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                        {k.replace(/_/g, " ")}
                      </p>
                      <p className="text-lg font-black text-indigo-700">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-indigo-200 flex items-center justify-between">
                  <p className="text-sm font-bold text-indigo-800 flex items-center gap-2">
                    <Info className="w-4 h-4" /> {simResult.recommendation}
                  </p>
                  <p className="text-lg font-black text-emerald-600">
                    {simResult.estimated_roi}x ROI
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strategic Suggestions */}
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50">
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" /> AI Policy
              Suggestions
            </CardTitle>
            <CardDescription>
              Detected inefficiencies and structural recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="p-5 rounded-3xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xs">
                        #{s.id.split("-")[1]}
                      </div>
                      <h4 className="font-black text-sm text-slate-900">
                        {s.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {Math.round(s.confidence * 100)}% Conf
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
                    {s.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${s.complexity === "LOW" ? "text-emerald-500" : "text-orange-500"}`}
                    >
                      Complexity: {s.complexity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-black text-purple-600 group-hover:translate-x-1 transition-transform p-0 h-auto"
                    >
                      Implement <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Self-Healing & Telemetry */}
        <Card className="lg:col-span-4 border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" /> Self-Healing
              Telemetry
            </CardTitle>
            <CardDescription>
              Real-time autonomous system stabilization events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(telemetry?.self_healing_events || []).map(
                (e: any, i: number) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 items-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-black text-slate-800">
                          {e.service}{" "}
                          <span className="text-slate-400 font-medium">·</span>{" "}
                          {e.action.replace("_", " ")}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400">
                          {new Date(e.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {e.reason ||
                          `Stabilized kernel latency by ${e.latency_saved}`}
                      </p>
                    </div>
                  </div>
                ),
              )}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Governance Efficiency History</span>
                  <span className="text-indigo-600">Optimal (0.8+)</span>
                </div>
                <div className="h-48 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[0.72, 0.75, 0.78, 0.82, 0.85, 0.88].map(
                        (v: number, i) => ({ round: i, value: v }),
                      )}
                    >
                      <defs>
                        <linearGradient
                          id="colorEff"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorEff)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Adaptive Resource Allocation */}
        <Card className="lg:col-span-3 border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Adaptive
              Resources
            </CardTitle>
            <CardDescription>
              Predictive workload surge management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {surges.map((s, i) => (
              <div
                key={i}
                className="p-5 rounded-3xl bg-slate-900 text-white relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all rounded-full" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-sm">{s.district}</h4>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                        Surge Probability:{" "}
                        {Math.round(s.surge_probability * 100)}%
                      </p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white">
                      CRITICAL
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      Recommended Action
                    </p>
                    <p className="text-xs font-bold text-slate-200 leading-relaxed">
                      {s.auto_reassignment}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <p className="text-slate-400 font-medium">
                      Escalated Cases:{" "}
                      <span className="text-white font-black">
                        {s.unresolved_escalationCount}
                      </span>
                    </p>
                    <Button
                      size="sm"
                      className="bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-black text-[10px] h-8 px-4"
                    >
                      DELEGATE
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                AI Decision Confidence by Sector
              </h4>
              <div className="space-y-3">
                {[
                  { name: "Routing", val: 94, color: "bg-indigo-500" },
                  { name: "Classification", val: 92, color: "bg-blue-500" },
                  { name: "Spam Detection", val: 98, color: "bg-emerald-500" },
                  { name: "ETA Prediction", val: 86, color: "bg-purple-500" },
                ].map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-[10px] font-extrabold mb-1">
                      <span>{s.name}</span>
                      <span>{s.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${s.color} rounded-full`}
                        style={{ width: `${s.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
