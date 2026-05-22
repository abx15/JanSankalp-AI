"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const trendData = [
  { day: "Mon", count: 12 },
  { day: "Tue", count: 18 },
  { day: "Wed", count: 15 },
  { day: "Thu", count: 25 },
  { day: "Fri", count: 20 },
  { day: "Sat", count: 10 },
  { day: "Sun", count: 8 },
];

export default function TrendChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[200px] w-full bg-muted/20 animate-pulse rounded-xl" />
    );
  }

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
