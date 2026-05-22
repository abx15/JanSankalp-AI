"use client";

import React from "react";
import {
  Crown,
  Settings,
  Target,
  Users,
  Zap,
  Heart,
  Sprout,
  BarChart3,
  PieChart as PieChartIcon,
  Play,
  History,
  ShieldAlert,
  Save,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Scale,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
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
import { Slider } from "@/components/ui/slider";

const APPROVAL_TREND = [
  { month: "Jan", rating: 72 },
  { month: "Feb", rating: 74 },
  { month: "Mar", rating: 71 },
  { month: "Apr", rating: 75 },
  { month: "May", rating: 78 },
  { month: "Jun", rating: 82 },
];

const FIVE_YEAR_PLAN = [
  {
    year: 2026,
    task: "Universal Gig-Connectivity",
    budget: "$45M",
    roi: "12%",
    status: "COMPLETED",
  },
  {
    year: 2027,
    task: "Autonomous Transport Mesh",
    budget: "$120M",
    roi: "18%",
    status: "IN_PROGRESS",
  },
  {
    year: 2028,
    task: "Zero-Carbon Grid Transition",
    budget: "$250M",
    roi: "22%",
    status: "PLANNED",
  },
  {
    year: 2029,
    task: "Circular Waste Economy",
    budget: "$85M",
    roi: "15%",
    status: "PLANNED",
  },
  {
    year: 2030,
    task: "AGI Governance Integration",
    budget: "$300M",
    roi: "40%",
    status: "VISIONARY",
  },
];

export default function AIMayorDashboard() {
  const [activeStrategy, setActiveStrategy] = React.useState<any>(null);
  const [infraFocus, setInfraFocus] = React.useState([50]);
  const [welfareFocus, setWelfareFocus] = React.useState([30]);
  const [greenFocus, setGreenFocus] = React.useState([20]);
  const [stabilityScore, setStabilityScore] = React.useState([85]);
  const [simulating, setSimulating] = React.useState(false);

  const total = infraFocus[0] + welfareFocus[0] + greenFocus[0];
  const normalizedInfra = (infraFocus[0] / total) * 100;

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => setSimulating(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-[#fdfcfb] min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-200">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full ring-4 ring-white shadow-lg">
              <Zap className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              AI Mayor Strategic Terminal
            </h1>
            <p className="text-slate-500 font-medium text-lg italic mt-1">
              Sovereign Decision Intelligence & Simulation Engine
            </p>
            <div className="flex gap-2 mt-4">
              <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[10px] tracking-widest px-3">
                NEUTRALITY: VERIFIED
              </Badge>
              <Badge className="bg-indigo-100 text-indigo-600 border-none font-black text-[10px] tracking-widest px-3">
                MODE: AUTONOMOUS-HYBRID
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">
            Projected Approval Rating
          </p>
          <div className="flex items-center gap-3">
            <span className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">
              82.4%
            </span>
            <div className="flex flex-col items-start bg-emerald-50 p-1.5 rounded-xl border border-emerald-100">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-600">
                +1.2%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Policy Sandbox Control */}
        <Card className="lg:col-span-1 border-none shadow-2xl shadow-indigo-100/50 rounded-[3rem] bg-white overflow-hidden flex flex-col">
          <CardHeader className="p-10 pb-4">
            <CardTitle className="text-2xl font-black flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-600" /> Strategy Sandbox
            </CardTitle>
            <CardDescription className="font-bold text-slate-400">
              Balance the city&apos;s existential priorities
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 space-y-12 flex-grow">
            <div className="space-y-6 text-slate-900">
              <div className="space-y-4">
                <div className="flex justify-between font-black text-xs uppercase tracking-widest">
                  <span className="flex items-center gap-2 underline decoration-indigo-200 underline-offset-4 decoration-2">
                    <BarChart3 className="w-3 h-3" /> Infrastructure
                  </span>
                  <span>{infraFocus}%</span>
                </div>
                <Slider
                  value={infraFocus}
                  onValueChange={setInfraFocus}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-indigo-600"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between font-black text-xs uppercase tracking-widest">
                  <span className="flex items-center gap-2 underline decoration-pink-200 underline-offset-4 decoration-2">
                    <Heart className="w-3 h-3" /> Social Welfare
                  </span>
                  <span>{welfareFocus}%</span>
                </div>
                <Slider
                  value={welfareFocus}
                  onValueChange={setWelfareFocus}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-pink-500"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between font-black text-xs uppercase tracking-widest">
                  <span className="flex items-center gap-2 underline decoration-emerald-200 underline-offset-4 decoration-2">
                    <Sprout className="w-3 h-3" /> Planet (ESG)
                  </span>
                  <span>{greenFocus}%</span>
                </div>
                <Slider
                  value={greenFocus}
                  onValueChange={setGreenFocus}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-emerald-500"
                />
              </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Scale className="w-4 h-4" /> Real-Time Strategy Impact
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700">
                    Economic Velocity
                  </span>
                  <Badge
                    variant="outline"
                    className="text-indigo-600 border-indigo-200 bg-white font-black"
                  >
                    HIGH
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700">
                    Wealth Equity
                  </span>
                  <Badge
                    variant="outline"
                    className="text-pink-600 border-pink-200 bg-white font-black"
                  >
                    MODERATE
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700">
                    Biosphere Health
                  </span>
                  <Badge
                    variant="outline"
                    className="text-emerald-600 border-emerald-200 bg-white font-black"
                  >
                    STABLE
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              disabled={simulating}
              onClick={handleSimulate}
              className={`w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all ${simulating ? "bg-slate-100 text-slate-400" : "bg-indigo-600 hover:bg-slate-900 shadow-indigo-200"}`}
            >
              {simulating
                ? "SIMULATING GOVERNANCE..."
                : "EXECUTE STRATEGY MODEL"}
              {!simulating && <Play className="w-4 h-4 ml-2 fill-current" />}
            </Button>
          </CardContent>
        </Card>

        {/* Prediction Graphs & Long-Term Planning */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="p-10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black">
                  Approval Rating Velocity
                </CardTitle>
                <CardDescription className="font-bold text-slate-400 tracking-tight">
                  Simulated sentiment forecasting based on current trajectory
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl bg-slate-50 text-slate-400"
                >
                  <History className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl bg-slate-50 text-slate-400"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-10 pb-10">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={APPROVAL_TREND}>
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
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      stroke="#94a3b8"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "1.5rem",
                        border: "none",
                        boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#4f46e5"
                      strokeWidth={6}
                      dot={{
                        r: 6,
                        fill: "#4f46e5",
                        strokeWidth: 3,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="p-10">
              <CardTitle className="text-2xl font-black">
                Autonomous 5-Year Development Plan
              </CardTitle>
              <CardDescription className="font-bold text-slate-400">
                Roadmap generated by Decision Intelligence Core
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {FIVE_YEAR_PLAN.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-8 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-8">
                      <span className="text-3xl font-black text-slate-200 group-hover:text-indigo-600 transition-colors">
                        {item.year}
                      </span>
                      <div>
                        <h4 className="font-black text-slate-900 group-hover:translate-x-1 transition-transform">
                          {item.task}
                        </h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          EST. BUDGET: {item.budget} | ROI: {item.roi}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        className={`border-none font-black text-[9px] tracking-widest px-3 ${
                          item.status === "COMPLETED"
                            ? "bg-slate-100 text-slate-600"
                            : item.status === "IN_PROGRESS"
                              ? "bg-indigo-100 text-indigo-600"
                              : item.status === "VISIONARY"
                                ? "bg-purple-100 text-purple-600 animate-pulse"
                                : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        {item.status}
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8">
                <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:scale-[1.01] transition-transform">
                  RE-GENERATE ROADMAP FROM NEW DATA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decision Integrity & Crisis Logs */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-none shadow-sm rounded-[3rem] bg-white p-10 space-y-8">
          <h3 className="text-xl font-black flex items-center gap-2">
            <Scale className="w-6 h-6 text-indigo-600" /> Non-Partisan
            Governance Logic
          </h3>
          <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldAlert className="w-20 h-20 text-indigo-600" />
            </div>
            <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-2">
              Neutrality Engine Analysis
            </p>
            <p className="text-sm font-bold text-slate-700 leading-relaxed italic pr-12">
              &quot;Decision to allocate $12M to North District Sanitation was
              flagged for potential ward-bias. Neural guard applied
              equity-correction to redistribute 15% towards South-East education
              nodes.&quot;
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { l: "Equity Score", v: 98.4 },
              { l: "Logic Proof", v: 100 },
              { l: "Bias Guard", v: 99.1 },
            ].map((m, i) => (
              <div key={i} className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {m.l}
                </p>
                <p className="text-xl font-black text-slate-900">{m.v}%</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-[3rem] bg-slate-900 text-white p-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-xl font-black flex items-center gap-2 relative z-10">
            <Target className="w-6 h-6 text-indigo-400" /> Crisis Prioritization
            Logic
          </h3>
          <div className="mt-8 space-y-6 relative z-10">
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 font-black">
                !
              </div>
              <div>
                <h5 className="font-black text-sm">
                  Economic Flash-Crash Prediction
                </h5>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  Status: MITIGATION_ACTIVE
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-center opacity-60">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black">
                #
              </div>
              <div>
                <h5 className="font-black text-sm">
                  Grid Demand Surge Analysis
                </h5>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  Status: STABLE
                </p>
              </div>
            </div>
          </div>
          <Button className="w-full mt-10 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest relative z-10 shadow-2xl shadow-indigo-500/20">
            Run Crisis Simulation Suite
          </Button>
        </Card>
      </div>
    </div>
  );
}
