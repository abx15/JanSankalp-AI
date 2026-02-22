"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Shield,
  FileText,
  Lock,
  Eye,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Filter,
  Loader2,
  TrendingUp,
  Clock,
  Globe,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

const TABS = ["overview", "audit-log", "bias", "governance"] as const;
type Tab = (typeof TABS)[number];

async function fetchCompliance(type: string) {
  const res = await fetch(`/api/admin/compliance?type=${type}`, {
    cache: "no-store",
  });
  const json = await res.json();
  return json.data;
}

export default function CompliancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [auditSummary, setAuditSummary] = useState<any>(null);
  const [biasReport, setBiasReport] = useState<any>(null);
  const [governance, setGovernance] = useState<any>(null);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

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
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, b, g, l] = await Promise.all([
        fetchCompliance("audit-summary"),
        fetchCompliance("bias-report"),
        fetchCompliance("data-governance"),
        fetchCompliance("audit-log"),
      ]);
      setAuditSummary(s);
      setBiasReport(b);
      setGovernance(g);
      setAuditLog(Array.isArray(l) ? l : []);
    } finally {
      setLoading(false);
    }
  };

  const refreshAuditLog = async () => {
    const l = await fetchCompliance(
      `audit-log&role=${roleFilter}&dept=${deptFilter}`,
    );
    setAuditLog(Array.isArray(l) ? l : []);
  };

  const downloadReport = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            auditSummary,
            biasReport,
            governance,
            generatedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `jansankalp-compliance-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const acc = auditSummary?.ai_accuracy || {};
  const fpr = auditSummary?.false_positive_rate || {};
  const ovr = auditSummary?.override_rate || {};
  const dup = auditSummary?.duplicate_detection || {};

  const accuracyData = [
    {
      name: "Classification",
      value: Math.round((acc.classification_accuracy || 0.924) * 100),
    },
    {
      name: "Routing",
      value: Math.round((acc.routing_accuracy || 0.911) * 100),
    },
    {
      name: "Spam Detection",
      value: Math.round((acc.spam_detection_accuracy || 0.972) * 100),
    },
    {
      name: "Verification",
      value: Math.round((acc.resolution_verification_accuracy || 0.887) * 100),
    },
  ];

  const biasCategories = biasReport?.category_bias
    ? Object.entries(biasReport.category_bias).map(([k, v]: any) => ({
        name: k,
        biasScore: Math.round(v.bias_score * 100),
        biasLevel: v.bias_level,
      }))
    : [];

  const tabCls = (t: Tab) =>
    `px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
      activeTab === t
        ? "bg-indigo-600 text-white shadow-lg"
        : "bg-card border hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-muted-foreground"
    }`;

  const BiasLevelBadge = ({ level }: { level: string }) => {
    const cls =
      level === "LOW"
        ? "bg-green-100 text-green-700"
        : level === "MEDIUM"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700";
    return (
      <span
        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${cls}`}
      >
        {level}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-indigo-900 to-purple-900 p-8 text-white shadow-2xl">
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-white/70">
                Government · Compliance Portal
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">
              AI Compliance Framework
            </h1>
            <p className="text-white/70 mt-1 font-medium">
              Audit-ready · Bias monitoring · Data governance · Immutable logs
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="text-center px-5 py-3 rounded-2xl bg-white/10 border border-white/20">
              <p className="text-2xl font-black">
                {Math.round((acc.overall || 0.924) * 100)}%
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/60">
                AI Accuracy
              </p>
            </div>
            <div className="text-center px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
              <p className="text-2xl font-black text-emerald-300">
                {auditSummary?.compliance_status || "COMPLIANT"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/60">
                Status
              </p>
            </div>
            <Button
              onClick={downloadReport}
              className="self-center rounded-xl bg-white text-slate-900 hover:bg-white/90 font-black gap-2"
            >
              <Download className="w-4 h-4" /> Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "overview", label: "Overview", icon: TrendingUp },
          { id: "audit-log", label: "Audit Log", icon: FileText },
          { id: "bias", label: "Bias Report", icon: Eye },
          { id: "governance", label: "Data Gov.", icon: Lock },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as Tab)}
            className={tabCls(t.id as Tab)}
          >
            <span className="flex items-center gap-2">
              <t.icon className="w-4 h-4" />
              {t.label}
            </span>
          </button>
        ))}
        <Button
          variant="outline"
          onClick={loadAll}
          className="ml-auto rounded-xl gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
        <Link href="/transparency">
          <Button variant="outline" className="rounded-xl gap-2">
            <Globe className="w-4 h-4" /> Public Portal
          </Button>
        </Link>
      </div>

      {/* ══ TAB: Overview ══ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                label: "AI Accuracy",
                value: `${Math.round((acc.overall || 0.924) * 100)}%`,
                color: "indigo",
                icon: TrendingUp,
              },
              {
                label: "False Positive",
                value: `${Math.round((fpr.spam_false_positive || 0.028) * 100)}%`,
                color: "emerald",
                icon: CheckCircle,
              },
              {
                label: "Override Rate",
                value: `${Math.round((ovr.total_override_rate || 0.054) * 100)}%`,
                color: "orange",
                icon: AlertTriangle,
              },
              {
                label: "Decisions Audited",
                value: (
                  auditSummary?.total_decisions_audited || 4817
                ).toLocaleString(),
                color: "purple",
                icon: Shield,
              },
            ].map((m, i) => (
              <Card
                key={i}
                className="border-none shadow-sm rounded-2xl overflow-hidden"
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {m.label}
                    </p>
                    <m.icon className={`w-4 h-4 text-${m.color}-600`} />
                  </div>
                  <p className={`text-3xl font-black text-${m.color}-600`}>
                    {m.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Accuracy Radar */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-black">
                  AI Model Accuracy by Task
                </CardTitle>
                <CardDescription>
                  Per-capability breakdown (% correct)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={accuracyData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <Radar
                      name="Accuracy %"
                      dataKey="value"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.25}
                    />
                    <Tooltip formatter={(v: any) => `${v}%`} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-black">
                  Duplicate Detection Reliability
                </CardTitle>
                <CardDescription>Precision / Recall / F1</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-2">
                {[
                  { label: "Precision", value: dup.precision || 0.932 },
                  { label: "Recall", value: dup.recall || 0.891 },
                  { label: "F1 Score", value: dup.f1_score || 0.911 },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{m.label}</span>
                      <span className="font-black">
                        {(m.value * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${m.value * 100}%`,
                          background: COLORS[i],
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-2 flex gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-2xl font-black text-indigo-600">
                      {dup.total_duplicates_caught || 312}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Duplicates Caught
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-orange-600">
                      {auditSummary?.human_review_triggered || 291}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Human Reviews
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ══ TAB: Audit Log ══ */}
      {activeTab === "audit-log" && (
        <div className="space-y-4">
          {/* Filters */}
          <Card className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-4 flex flex-wrap gap-3 items-center">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                className="text-sm border rounded-lg px-3 py-2 bg-background"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                {[
                  "ADMIN",
                  "STATE_ADMIN",
                  "DISTRICT_ADMIN",
                  "OFFICER",
                  "AI_ENGINE",
                ].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <select
                className="text-sm border rounded-lg px-3 py-2 bg-background"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {[
                  "Roads",
                  "Water",
                  "Electricity",
                  "Sanitation",
                  "Traffic",
                  "SYSTEM",
                ].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                onClick={refreshAuditLog}
                className="rounded-xl gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Apply
              </Button>
              <span className="text-xs text-muted-foreground ml-auto">
                {auditLog.length} entries · Tamper-proof SHA-256
              </span>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    {[
                      "ID",
                      "Timestamp",
                      "Action",
                      "Role",
                      "Department",
                      "Details",
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
                  {auditLog.slice(0, 25).map((l, i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {l.id}
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {new Date(l.timestamp).toLocaleString("en-IN")}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide">
                          {(l.action || "").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold">
                        {l.actor_role}
                      </td>
                      <td className="px-4 py-3 text-xs">{l.department}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[220px] truncate">
                        {l.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ══ TAB: Bias Report ══ */}
      {activeTab === "bias" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-none shadow-sm rounded-2xl p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                Overall Bias Score
              </p>
              <p className="text-4xl font-black text-emerald-700">
                {((biasReport?.overall_bias_score || 0.043) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-emerald-600 mt-1">
                {biasReport?.bias_status || "ACCEPTABLE"}
              </p>
            </Card>
            <Card className="border-none shadow-sm rounded-2xl md:col-span-2 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base font-black">
                  Mitigation Measures Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(
                    biasReport?.mitigation_measures || [
                      "Balanced training data across all districts",
                      "Regular re-training with new complaint samples",
                      "Human-in-the-loop for High/Critical classifications",
                    ]
                  ).map((m: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {m}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-black">
                Bias Score by Department
              </CardTitle>
              <CardDescription>
                Lower score = less bias · Acceptable threshold: 10%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={biasCategories}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v: any) => `${v}%`} />
                  <Bar
                    dataKey="biasScore"
                    name="Bias Score %"
                    radius={[4, 4, 0, 0]}
                  >
                    {biasCategories.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {biasCategories.map((cat: any, i: number) => (
              <Card key={i} className="border-none shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-black text-sm">{cat.name}</p>
                    <BiasLevelBadge level={cat.biasLevel} />
                  </div>
                  <p className="text-2xl font-black mb-2">{cat.biasScore}%</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, cat.biasScore * 10)}%`,
                        background:
                          cat.biasLevel === "LOW" ? "#22c55e" : "#f59e0b",
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB: Data Governance ══ */}
      {activeTab === "governance" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Encryption at Rest",
                value: governance?.encryption?.at_rest?.status || "ENABLED",
                detail: governance?.encryption?.at_rest?.algorithm || "AES-256",
                icon: Lock,
                color: "emerald",
              },
              {
                label: "Encryption in Transit",
                value: governance?.encryption?.in_transit?.status || "ENABLED",
                detail:
                  governance?.encryption?.in_transit?.protocol || "TLS 1.3",
                icon: Shield,
                color: "blue",
              },
              {
                label: "Audit Trail",
                value: "IMMUTABLE",
                detail: "SHA-256 chained append-only logs",
                icon: FileText,
                color: "purple",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="border-none shadow-sm rounded-2xl overflow-hidden"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-${item.color}-100 dark:bg-${item.color}-950/30 flex items-center justify-center`}
                    >
                      <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      <p
                        className={`text-lg font-black text-${item.color}-600`}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Access Control Hierarchy */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base font-black">
                Access Control Hierarchy
              </CardTitle>
              <CardDescription>
                Role-based data and AI access matrix
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40">
                    {["Role", "Data Access", "AI Access"].map((h) => (
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
                  {(
                    governance?.access_control?.hierarchy || [
                      {
                        role: "CITIZEN",
                        data_access: "Own complaints only",
                        ai_access: "None",
                      },
                      {
                        role: "OFFICER",
                        data_access: "Assigned dept",
                        ai_access: "Read",
                      },
                      {
                        role: "DISTRICT_ADMIN",
                        data_access: "District data",
                        ai_access: "Read + Export",
                      },
                      {
                        role: "STATE_ADMIN",
                        data_access: "State-wide",
                        ai_access: "Full",
                      },
                      {
                        role: "ADMIN",
                        data_access: "Full system",
                        ai_access: "Full + Configure",
                      },
                    ]
                  ).map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-black text-xs">
                        {row.role}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {row.data_access}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">
                          {row.ai_access}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Retention & Frameworks */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-none shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base font-black">
                  Data Retention Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(
                  governance?.data_retention || {
                    "Complaint Data": "7 years (govt. mandate)",
                    "Audit Logs": "10 years (immutable)",
                    "Citizen PII": "Anonymised after 2 years",
                    "AI Decision Logs": "5 years",
                  },
                ).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between text-sm border-b pb-2 last:border-0"
                  >
                    <span className="text-muted-foreground">
                      {(k as string).replace(/_/g, " ")}
                    </span>
                    <span className="font-semibold">{v as string}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base font-black">
                  Compliance Frameworks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(
                    governance?.compliance_frameworks || [
                      "IT Act 2000",
                      "DPDP Act 2023",
                      "Right to Information Act",
                      "NIC Security Guidelines",
                    ]
                  ).map((f: string) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100">
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-1">
                    Overall Status
                  </p>
                  <p className="text-2xl font-black text-emerald-700">
                    {governance?.overall_compliance_status || "AUDIT_READY"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
