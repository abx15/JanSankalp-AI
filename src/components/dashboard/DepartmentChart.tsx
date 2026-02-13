"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const performanceData = [
  { name: "Waste", resolved: 45, pending: 15 },
  { name: "Roads", resolved: 30, pending: 25 },
  { name: "Water", resolved: 55, pending: 5 },
  { name: "Electric", resolved: 40, pending: 10 },
  { name: "Health", resolved: 20, pending: 30 },
];

export default function DepartmentChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-xl" />
    );
  }

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
