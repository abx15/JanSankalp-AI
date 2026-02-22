"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  TrendingUp,
  Users,
  MapPin,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  Building2,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
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

const MOCK_CITIES = [
  {
    id: "1",
    name: "New York City",
    country: "USA",
    users: 12500,
    complaints: 450,
    efficiency: 92,
    status: "PREMIUM",
    growth: "+12%",
  },
  {
    id: "2",
    name: "London",
    country: "UK",
    users: 8400,
    complaints: 320,
    efficiency: 88,
    status: "ENTERPRISE",
    growth: "+8%",
  },
  {
    id: "3",
    name: "Delhi",
    country: "India",
    users: 45000,
    complaints: 1200,
    efficiency: 74,
    status: "BASIC",
    growth: "+24%",
  },
  {
    id: "4",
    name: "Singapore",
    country: "Singapore",
    users: 9800,
    complaints: 150,
    efficiency: 98,
    status: "ENTERPRISE",
    growth: "+5%",
  },
  {
    id: "5",
    name: "Dubai",
    country: "UAE",
    users: 15200,
    complaints: 480,
    efficiency: 85,
    status: "PREMIUM",
    growth: "+15%",
  },
];

const GLOBAL_STATS = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 600 },
  { name: "Wed", value: 550 },
  { name: "Thu", value: 800 },
  { name: "Fri", value: 700 },
  { name: "Sat", value: 900 },
  { name: "Sun", value: 850 },
];

export default function SaaSGlobalDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCities = MOCK_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Globe className="w-10 h-10 text-primary" />
            Global SaaS Architect
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Cross-City Performance · Multi-Tenant Monitoring · Global Compliance
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-2xl font-black text-xs uppercase tracking-widest gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Export Global Report
          </Button>
          <Button className="rounded-2xl font-black text-xs uppercase tracking-widest gap-2 bg-primary">
            <Building2 className="w-3.5 h-3.5" /> Provision New City
          </Button>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Global Users",
            value: "90,900",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: "+14.2%",
          },
          {
            title: "Active Tenants",
            value: "48",
            icon: MapPin,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            trend: "+3 new",
          },
          {
            title: "Governance Score",
            value: "88.4",
            icon: ShieldCheck,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            trend: "+2.1%",
          },
          {
            title: "API Health",
            value: "99.99%",
            icon: Activity,
            color: "text-purple-600",
            bg: "bg-purple-50",
            trend: "Stable",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-3xl overflow-hidden ring-1 ring-slate-100"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {stat.trend}
                </span>
              </div>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                {stat.title}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Global Volume Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black">
                  Global Interaction Volume
                </CardTitle>
                <CardDescription>
                  Aggregate citizen complaints across all tenants
                </CardDescription>
              </div>
              <div className="p-2 bg-slate-100 rounded-xl flex gap-1">
                <button className="px-3 py-1 bg-white rounded-lg text-xs font-bold shadow-sm">
                  Real-time
                </button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500">
                  History
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={GLOBAL_STATS}>
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
                      borderRadius: "1rem",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Global Performance Ranking */}
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Leaderboard
            </CardTitle>
            <CardDescription>
              Governance Efficiency ranking by city
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {MOCK_CITIES.sort((a, b) => b.efficiency - a.efficiency)
              .slice(0, 4)
              .map((city, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400">
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-black text-slate-900">
                        {city.name}
                      </p>
                      <p className="text-xs font-black text-emerald-600">
                        {city.efficiency}%
                      </p>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${city.efficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* City Management Table */}
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-black">City Tenants</CardTitle>
              <CardDescription>
                Manage global multi-tenant deployments
              </CardDescription>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search city/country..."
                  className="pl-10 rounded-xl border-slate-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl gap-2">
                <Filter className="w-4 h-4" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    City / Country
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Subscription
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Active Users
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Growth
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCities.map((city, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 flex items-center justify-center font-bold text-primary">
                          {city.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {city.name}
                          </p>
                          <p className="text-xs font-medium text-slate-400">
                            {city.country}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                          city.status === "ENTERPRISE"
                            ? "bg-purple-100 text-purple-700"
                            : city.status === "PREMIUM"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {city.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900">
                        {city.users.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1 font-black text-xs text-emerald-500">
                        <ArrowUpRight className="w-4 h-4" /> {city.growth}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Button
                        variant="ghost"
                        className="rounded-xl font-black text-xs text-primary hover:bg-white hover:shadow-sm"
                      >
                        Console <ArrowRight className="w-3.5 h-3.5 ml-2" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ArrowRight(props: any) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
