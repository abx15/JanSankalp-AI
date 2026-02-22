"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  MapPin,
  AlertTriangle,
  TrendingUp,
  Leaf,
  BarChart2,
  Loader2,
  RefreshCw,
  Zap,
  Droplets,
  ZapOff,
  ChevronRight,
  DollarSign,
  Building2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RISK_COLORS: Record<string, string> = {
  CRITICAL: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#f59e0b",
  LOW: "#22c55e",
};
const DIST_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

const fmt = (n: number) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(1)}Cr`
    : n >= 100000
      ? `₹${(n / 100000).toFixed(1)}L`
      : `₹${n.toLocaleString()}`;

async function fetchUrban(type: string, params = "") {
  const res = await fetch(
    `/api/admin/urban-intelligence?type=${type}${params}`,
    { cache: "no-store" },
  );
  const json = await res.json();
  return json.data;
}

const MODEL_ICONS: Record<string, any> = {
  "Road Damage": MapPin,
  "Water Shortage": Droplets,
  "Electricity Outage": ZapOff,
  Flooding: AlertTriangle,
  "Traffic Congestion": TrendingUp,
};

export default function UrbanIntelligencePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "heatmap" | "failures" | "investment" | "sustainability" | "districts"
  >("heatmap");
  const [loading, setLoading] = useState(true);
  const [horizon, setHorizon] = useState(3);

  const [failures, setFailures] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [sustainability, setSustainability] = useState<any>(null);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (!["ADMIN", "STATE_ADMIN", "DISTRICT_ADMIN"].includes(role))
        router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    loadAll();
  }, [horizon]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [f, h, i, s, d] = await Promise.all([
        fetchUrban("infrastructure-failures", `&horizon=${horizon}`),
        fetchUrban("risk-heatmap"),
        fetchUrban("investment-recommendations"),
        fetchUrban("sustainability"),
        fetchUrban("district-comparison"),
      ]);
      setFailures(f);
      setHeatmap(Array.isArray(h) ? h : []);
      setInvestments(Array.isArray(i) ? i : []);
      setSustainability(s);
      setDistricts(Array.isArray(d) ? d : []);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const districtPredictions: any[] = failures?.district_predictions || [];
  const summary = failures?.summary || {};

  const RiskBadge = ({ level }: { level: string }) => (
    <span
      style={{
        background: `${RISK_COLORS[level]}20`,
        color: RISK_COLORS[level],
        border: `1px solid ${RISK_COLORS[level]}40`,
      }}
      className="text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest"
    >
      {level}
    </span>
  );

  const tabBtn = (id: string, label: string, icon: any) => {
    const Icon = icon;
    const active = activeTab === id;
    return (
      <button
        key={id}
        onClick={() => setActiveTab(id as any)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
          active
            ? "bg-indigo-600 text-white shadow-lg"
            : "bg-card border hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-muted-foreground"
        }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </button>
    );
  };

  const sustBreakdown = sustainability?.sustainability_score?.breakdown || {};
  const radarData = Object.entries(sustBreakdown).map(([k, v]) => ({
    name: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: Number(v),
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 p-8 text-white shadow-2xl">
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-white/70">
                AI · Predictive Urban Intelligence
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">
              Urban Intelligence Platform
            </h1>
            <p className="text-white/70 mt-1 font-medium">
              Infrastructure failure prediction · Risk heatmaps · Investment
              planning
            </p>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <div className="text-center px-5 py-3 rounded-2xl bg-white/10 border border-white/20">
              <p className="text-2xl font-black">
                {summary.critical_risk_districts ?? 1}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/60">
                Critical Districts
              </p>
            </div>
            <div className="text-center px-5 py-3 rounded-2xl bg-white/10 border border-white/20">
              <p className="text-2xl font-black">
                {sustainability?.sustainability_score?.grade ?? "B+"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/60">
                Sustainability
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-white/70">
                Horizon:
              </label>
              <select
                className="rounded-xl bg-white/20 border border-white/30 text-white text-sm font-bold px-3 py-2"
                value={horizon}
                onChange={(e) => setHorizon(+e.target.value)}
              >
                <option value={1}>1 Month</option>
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
              </select>
            </div>
            <Button
              onClick={loadAll}
              className="rounded-xl bg-white text-slate-900 hover:bg-white/90 font-black gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {tabBtn("heatmap", "Risk Heatmap", MapPin)}
        {tabBtn("failures", "Failure Forecast", AlertTriangle)}
        {tabBtn("investment", "Investment Plan", DollarSign)}
        {tabBtn("sustainability", "Sustainability", Leaf)}
        {tabBtn("districts", "District Comparison", BarChart2)}
      </div>

      {/* ══ TAB: Risk Heatmap (text-based) ══ */}
      {activeTab === "heatmap" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "High Risk Zones",
                value: summary.high_risk_districts ?? 3,
                color: "orange",
              },
              {
                label: "Critical Zones",
                value: summary.critical_risk_districts ?? 1,
                color: "red",
              },
              {
                label: "Heatmap Points",
                value: heatmap.length,
                color: "indigo",
              },
              {
                label: "Est. Total Cost",
                value: fmt(summary.total_estimated_cost_inr ?? 7180000),
                color: "purple",
              },
            ].map((m, i) => (
              <Card
                key={i}
                className="border-none shadow-sm rounded-2xl overflow-hidden"
              >
                <CardContent className="p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                    {m.label}
                  </p>
                  <p className={`text-3xl font-black text-${m.color}-600`}>
                    {m.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" /> Risk Zone
                Breakdown
              </CardTitle>
              <CardDescription>
                Active risk points by type and district
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      {["District", "Risk Type", "Intensity", "Risk Level"].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {heatmap.map((p: any, i: number) => (
                      <tr
                        key={i}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-sm">
                          {p.district}
                        </td>
                        <td className="px-4 py-3 text-sm">{p.risk_type}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${p.intensity * 100}%`,
                                  background:
                                    p.intensity > 0.8
                                      ? "#ef4444"
                                      : p.intensity > 0.6
                                        ? "#f97316"
                                        : p.intensity > 0.4
                                          ? "#f59e0b"
                                          : "#22c55e",
                                }}
                              />
                            </div>
                            <span className="font-black text-xs">
                              {(p.intensity * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <RiskBadge
                            level={
                              p.intensity > 0.8
                                ? "CRITICAL"
                                : p.intensity > 0.6
                                  ? "HIGH"
                                  : p.intensity > 0.4
                                    ? "MEDIUM"
                                    : "LOW"
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══ TAB: Infrastructure Failure Forecast ══ */}
      {activeTab === "failures" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {districtPredictions.map((d: any, i: number) => (
              <Card
                key={i}
                className="border-none shadow-sm rounded-2xl overflow-hidden"
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-black text-sm">{d.district}</p>
                    <RiskBadge level={d.overall_risk_level} />
                  </div>
                  <p
                    className="text-4xl font-black mb-1"
                    style={{ color: RISK_COLORS[d.overall_risk_level] }}
                  >
                    {(d.overall_risk * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Overall failure risk
                  </p>
                  <div className="space-y-2">
                    {Object.entries(d.models).map(([modelName, model]: any) => {
                      const Icon = MODEL_ICONS[modelName] || AlertTriangle;
                      return (
                        <div
                          key={modelName}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Icon className="w-3.5 h-3.5" />
                            {modelName}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${model.failure_probability * 100}%`,
                                  background: RISK_COLORS[model.risk_level],
                                }}
                              />
                            </div>
                            <span className="font-black w-8 text-right">
                              {(model.failure_probability * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base font-black">
                Risk Distribution by District
              </CardTitle>
              <CardDescription>
                Grouped failure probability across infrastructure types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={districtPredictions.map((d: any) => ({
                    district: d.district,
                    ...Object.fromEntries(
                      Object.entries(d.models).map(([k, v]: any) => [
                        k,
                        Math.round(v.failure_probability * 100),
                      ]),
                    ),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="district" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v: any) => `${v}%`} />
                  <Legend />
                  {["Road Damage", "Water Shortage", "Electricity Outage"].map(
                    (m, i) => (
                      <Bar
                        key={m}
                        dataKey={m}
                        fill={DIST_COLORS[i]}
                        radius={[3, 3, 0, 0]}
                      />
                    ),
                  )}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══ TAB: Investment Recommendations ══ */}
      {activeTab === "investment" && (
        <div className="space-y-4">
          {(investments as any[]).map((inv: any, i: number) => (
            <Card
              key={i}
              className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                        <span className="font-black text-indigo-600 text-sm">
                          #{inv.priority ?? i + 1}
                        </span>
                      </div>
                      <p className="font-black text-sm">
                        {inv.title || inv.district}
                      </p>
                      <RiskBadge level={inv.priority_level || "HIGH"} />
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      {inv.recommendation || inv.infrastructure_type}
                    </p>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Investment
                      </p>
                      <p className="font-black text-indigo-600">
                        {fmt(
                          inv.recommended_investment ||
                            inv.investment_required ||
                            0,
                        )}
                      </p>
                    </div>
                    {inv.expected_roi && (
                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          ROI
                        </p>
                        <p className="font-black text-emerald-600">
                          {inv.expected_roi}×
                        </p>
                      </div>
                    )}
                    {inv.cost_if_not_addressed && (
                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Avoided Cost
                        </p>
                        <p className="font-black text-red-600">
                          {fmt(inv.cost_if_not_addressed)}
                        </p>
                      </div>
                    )}
                    <Button
                      size="sm"
                      className="rounded-xl font-black self-center"
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ══ TAB: Sustainability ══ */}
      {activeTab === "sustainability" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 md:col-span-1">
              <CardContent className="p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                  Smart City Score
                </p>
                <p className="text-6xl font-black text-emerald-700">
                  {sustainability?.sustainability_score?.overall ?? 68.4}
                </p>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {sustainability?.sustainability_score?.grade ?? "B+"}
                </p>
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbon (YoY)</span>
                    <span className="font-black text-emerald-600">
                      ▼
                      {Math.abs(
                        sustainability?.carbon_footprint?.yoy_change_percent ??
                          -4.2,
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Digital Adoption
                    </span>
                    <span className="font-black">
                      {Math.round(
                        (sustainability?.smart_city_kpis
                          ?.digital_services_adoption ?? 0.74) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Renewable Energy
                    </span>
                    <span className="font-black">
                      {Math.round(
                        (sustainability?.smart_city_kpis
                          ?.renewable_energy_share ?? 0.28) * 100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-black">
                  Sustainability Dimensions
                </CardTitle>
                <CardDescription>Score 0-100 across 6 axes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.25}
                    />
                    <Tooltip formatter={(v: any) => `${v}/100`} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ══ TAB: District Comparison ══ */}
      {activeTab === "districts" && (
        <div className="space-y-4">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base font-black">
                District Risk Ranking
              </CardTitle>
              <CardDescription>
                Sorted by investment priority — highest risk first
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      {[
                        "Priority",
                        "District",
                        "Risk Score",
                        "Risk Level",
                        "Complaint Density",
                        "Resolution Rate",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {districts.map((d: any, i: number) => (
                      <tr
                        key={i}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                            style={{
                              background: `${DIST_COLORS[i]}20`,
                              color: DIST_COLORS[i],
                            }}
                          >
                            #{d.investment_priority}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-black">
                          {d.district_name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${d.overall_risk_score * 100}%`,
                                  background: RISK_COLORS[d.risk_level],
                                }}
                              />
                            </div>
                            <span className="font-black">
                              {(d.overall_risk_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <RiskBadge level={d.risk_level} />
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {d.complaint_density}/km²
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-black ${d.resolution_rate > 0.9 ? "text-emerald-600" : "text-orange-600"}`}
                          >
                            {Math.round(d.resolution_rate * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base font-black">
                Complaint Density vs Resolution Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={districts.map((d: any) => ({
                    name: d.district_name.split(" ")[0],
                    density: d.complaint_density,
                    resolution: Math.round(d.resolution_rate * 100),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="density"
                    name="Complaint Density"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="resolution"
                    name="Resolution Rate (%)"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
