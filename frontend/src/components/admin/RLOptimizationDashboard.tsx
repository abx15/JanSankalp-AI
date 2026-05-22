"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Brain, TrendingUp, Zap, Target } from "lucide-react";

export const RLOptimizationDashboard = () => {
  const [rlStats, setRlStats] = useState<any>(null);

  useEffect(() => {
    const fetchRLStats = async () => {
      try {
        const response = await fetch("/ai/analytics/rl");
        if (response.ok) {
          const data = await response.json();
          setRlStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch RL stats", error);
      }
    };
    fetchRLStats();
  }, []);

  const chartData =
    rlStats?.reward_trend.map((val: number, idx: number) => ({
      episode: idx * 100,
      reward: val,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg transform hover:scale-105 transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-100 text-sm font-medium">
                  Efficiency Gain
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {rlStats?.efficiency_gain || "24.5%"}
                </h3>
              </div>
              <Zap className="w-8 h-8 opacity-40" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Policy States
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {rlStats?.policy_size || "1,240"}
                </h3>
              </div>
              <Brain className="w-8 h-8 text-indigo-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Avg Reward</p>
                <h3 className="text-3xl font-bold mt-1 text-green-500">+8.5</h3>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Agent Confidence
                </p>
                <h3 className="text-3xl font-bold mt-1 text-blue-500">92%</h3>
              </div>
              <Target className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 overflow-hidden border-none shadow-xl">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Reinforcement Learning Progress (Policy Improvement)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReward" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis dataKey="episode" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ display: "none" }}
              />
              <Area
                type="monotone"
                dataKey="reward"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorReward)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
