"use client";

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
  Cell,
  PieChart,
  Pie,
} from "recharts";

const performanceData = [
  { name: "Waste", resolved: 45, pending: 15 },
  { name: "Roads", resolved: 30, pending: 25 },
  { name: "Water", resolved: 55, pending: 5 },
  { name: "Electric", resolved: 40, pending: 10 },
  { name: "Health", resolved: 20, pending: 30 },
];

const COLORS = ["#1E3A8A", "#F97316", "#16A34A", "#DC2626", "#8B5CF6"];

export function DepartmentChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          />
          <Bar dataKey="resolved" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pending" fill="#F97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const trendData = [
  { day: "Mon", count: 12 },
  { day: "Tue", count: 18 },
  { day: "Wed", count: 15 },
  { day: "Thu", count: 25 },
  { day: "Fri", count: 20 },
  { day: "Sat", count: 10 },
  { day: "Sun", count: 8 },
];

export function TrendChart() {
  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            fontSize={10}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#1E3A8A"
            strokeWidth={3}
            dot={{ r: 4, fill: "#1E3A8A" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
