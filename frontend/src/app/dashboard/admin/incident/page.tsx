"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Zap,
  Terminal,
  Shield,
  AlertOctagon,
  Activity,
  Lock,
  RefreshCw,
  Search,
  ArrowRight,
  Crosshair,
  Wifi,
  Radio,
  Gavel,
  History,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MOCK_THREATS = [
  {
    id: "T-801",
    type: "SQL_INJECTION",
    severity: "CRITICAL",
    source: "142.250.190.46",
    action: "BLOCKED",
    time: "12:45:01",
  },
  {
    id: "T-799",
    type: "BOT_SPAM",
    severity: "HIGH",
    source: "185.12.94.22",
    action: "CHALLENGED",
    time: "12:42:15",
  },
  {
    id: "T-795",
    type: "ANOMALY",
    severity: "MEDIUM",
    source: "103.22.201.5",
    action: "FLAGGED",
    time: "12:35:44",
  },
];

const TRAFFIC_DATA = [
  { time: "12:00", requests: 120, threats: 2 },
  { time: "12:10", requests: 450, threats: 15 },
  { time: "12:20", requests: 380, threats: 8 },
  { time: "12:30", requests: 900, threats: 45 },
  { time: "12:40", requests: 720, threats: 12 },
  { time: "12:50", requests: 600, threats: 5 },
];

export default function IncidentCommandDashboard() {
  const [criticalMode, setCriticalMode] = useState(false);
  const [telemetry, setTelemetry] = useState<any>(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch(
          "/api/admin/governance?type=security-telemetry",
        );
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data.data);
        }
      } catch (e) {
        console.error("Telemetry fetch error:", e);
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`min-h-screen p-8 space-y-8 transition-colors duration-500 ${criticalMode ? "bg-red-950 text-white" : "bg-slate-50"}`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black flex items-center gap-3 uppercase tracking-tighter">
              <ShieldAlert
                className={`w-10 h-10 ${criticalMode ? "text-red-500 animate-pulse" : "text-primary"}`}
              />
              Incident Command Console
            </h1>
            {criticalMode && (
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded animate-bounce">
                CRITICAL PROTOCOL ACTIVE
              </span>
            )}
          </div>
          <p
            className={`font-medium text-lg ${criticalMode ? "text-red-300" : "text-slate-500"}`}
          >
            National Critical Infrastructure Protection · Zero Trust Monitoring
            · Crisis Escalation
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={criticalMode ? "destructive" : "outline"}
            className="rounded-2xl font-black text-xs uppercase tracking-widest gap-2 bg-transparent border-red-500 text-red-500 hover:bg-red-500/10"
            onClick={() => setCriticalMode(!criticalMode)}
          >
            <AlertOctagon className="w-4 h-4" />{" "}
            {criticalMode ? "Exit Crisis Mode" : "Engage Protocol Alpha"}
          </Button>
          <Button
            className={`rounded-2xl font-black text-xs uppercase tracking-widest gap-2 ${criticalMode ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 shadow-xl shadow-slate-200"}`}
          >
            <Lock className="w-3.5 h-3.5" /> Emergency Lockout
          </Button>
        </div>
      </div>

      {/* Real-time Status Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Defensive Posture",
            value: telemetry?.defense_mode || "ACTIVE",
            status: "Optimal",
            color: "text-emerald-500",
            icon: Shield,
          },
          {
            title: "Threat Detection Rate",
            value: "99.98%",
            status: "System Integrity Verified",
            color: "text-blue-500",
            icon: Crosshair,
          },
          {
            title: "mTLS Connections",
            value: "2,408",
            status: "All Encrypted",
            color: "text-indigo-500",
            icon: wifiIcon,
          },
          {
            title: "Redundancy Level",
            value: "Level 3",
            status: "Multi-Region Sync",
            color: "text-purple-500",
            icon: Radio,
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className={`border-none shadow-sm rounded-3xl overflow-hidden ring-1 ${criticalMode ? "bg-red-900/40 ring-red-800" : "bg-white ring-slate-100"}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-2xl ${criticalMode ? "bg-red-800/50" : "bg-slate-50"}`}
                >
                  <stat.icon
                    className={`w-6 h-6 ${criticalMode ? "text-white" : stat.color}`}
                  />
                </div>
                <Activity
                  className={`w-4 h-4 ${criticalMode ? "text-red-400" : "text-slate-300"}`}
                />
              </div>
              <p
                className={`text-3xl font-black ${criticalMode ? "text-white" : "text-slate-900"}`}
              >
                {stat.value}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${criticalMode ? "text-red-300" : "text-slate-400"}`}
                >
                  {stat.title}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 rounded ${criticalMode ? "bg-red-800 text-red-200" : "bg-emerald-50 text-emerald-600"}`}
                >
                  {stat.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Threat Analytics Chart */}
        <Card
          className={`lg:col-span-2 border-none shadow-sm rounded-[2.5rem] overflow-hidden ${criticalMode ? "bg-red-900/40 ring-1 ring-red-800" : "bg-white"}`}
        >
          <CardHeader>
            <CardTitle
              className={`text-xl font-black ${criticalMode ? "text-white" : ""}`}
            >
              Cyber Resonance Monitor
            </CardTitle>
            <CardDescription
              className={`${criticalMode ? "text-red-300" : ""}`}
            >
              AI-driven anomaly detection vs baseline traffic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TRAFFIC_DATA}>
                  <defs>
                    <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={criticalMode ? "#ef4444" : "#3b82f6"}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={criticalMode ? "#ef4444" : "#3b82f6"}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={criticalMode ? "#7f1d1d" : "#f1f5f9"}
                  />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke={criticalMode ? "#fecaca" : "#94a3b8"}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke={criticalMode ? "#fecaca" : "#94a3b8"}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "1rem",
                      border: "none",
                      backgroundColor: criticalMode ? "#450a0a" : "#fff",
                      color: criticalMode ? "#fff" : "#000",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke={criticalMode ? "#f87171" : "#3b82f6"}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorReq)"
                  />
                  <Area
                    type="monotone"
                    dataKey="threats"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="transparent"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Actionable Incident Log */}
        <Card
          className={`border-none shadow-sm rounded-[2.5rem] overflow-hidden ${criticalMode ? "bg-red-900/40 ring-1 ring-red-800" : "bg-white"}`}
        >
          <CardHeader>
            <CardTitle
              className={`text-xl font-black flex items-center gap-2 ${criticalMode ? "text-white" : ""}`}
            >
              <Terminal className="w-5 h-5 text-red-500" /> Recent Interceptions
            </CardTitle>
            <CardDescription
              className={`${criticalMode ? "text-red-300" : ""}`}
            >
              Automatic AI threat mitigation logs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_THREATS.map((threat, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border ${criticalMode ? "bg-red-950/50 border-red-800" : "bg-slate-50 border-slate-100"} group hover:ring-2 ring-red-500 transition-all`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${threat.severity === "CRITICAL" ? "bg-red-500 text-white" : "bg-amber-100 text-amber-700"}`}
                  >
                    {threat.severity}
                  </span>
                  <span
                    className={`text-[10px] font-black ${criticalMode ? "text-red-300" : "text-slate-400"}`}
                  >
                    {threat.time}
                  </span>
                </div>
                <h4
                  className={`font-black text-sm mb-1 ${criticalMode ? "text-white" : "text-slate-900"}`}
                >
                  {threat.type.replace("_", " ")}
                </h4>
                <p
                  className={`text-[10px] font-bold mb-3 ${criticalMode ? "text-red-400" : "text-slate-500"}`}
                >
                  SRC: {threat.source}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1">
                    <History className="w-3 h-3" /> {threat.action}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-[10px] font-black h-7 ${criticalMode ? "text-white hover:bg-red-800" : ""}`}
                  >
                    ANALYSIS <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Autonomous Crisis Management */}
      <Card
        className={`border-none shadow-sm rounded-[2.5rem] overflow-hidden ${criticalMode ? "bg-red-900 border-none" : "bg-slate-900 text-white"}`}
      >
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 rounded-full bg-red-600/20 flex items-center justify-center shrink-0 border-2 border-red-600/30">
              <Zap className="w-12 h-12 text-red-500 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                Autonomous Escalaion Engine
                <span className="px-3 py-1 bg-red-600 rounded-full text-[10px] uppercase font-black tracking-widest">
                  ENABLED
                </span>
              </h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                The Sovereign AI is monitoring all complaints for &quot;National
                Security&quot; keywords. In &quot;Protocol Alpha&quot;, complaints involving
                public utilities or critical infrastructure are automatically
                escalated to the
                <span className="text-white font-black">
                  {" "}
                  Incident Command Level 1
                </span>{" "}
                without manual triage.
              </p>
            </div>
            <div className="flex gap-4">
              <Button className="rounded-2xl font-black px-8 py-6 bg-white text-slate-900 hover:bg-slate-100 flex gap-2">
                <Gavel className="w-5 h-5" /> Override AI
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function wifiIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13a10 10 0 0 1 14 0" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M2 8a15 15 0 0 1 20 0" />
      <line x1="12" x2="12.01" y1="20" y2="20" />
    </svg>
  );
}
