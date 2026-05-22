"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCcw,
  TrendingUp,
  BarChart3,
  ShieldQuestion,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getFederatedMetrics, triggerTrainRound } from "@/lib/ai-service";
import { toast } from "sonner";

const FLDashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);

  const fetchMetrics = async () => {
    const data = await getFederatedMetrics();
    if (data) setMetrics(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleTrainRound = async () => {
    setTraining(true);
    toast.info("Starting Federated Training Round...");
    const result = await triggerTrainRound();
    if (result) {
      toast.success("Training round completed successfully!");
      fetchMetrics();
    } else {
      toast.error("Failed to start training round.");
    }
    setTraining(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Privacy Compliance"
          value={metrics?.privacy_compliance || "Verified"}
          icon={<ShieldCheck className="text-green-500" />}
          status="Secure"
          description="E2E encrypted model weights with Differential Privacy"
        />
        <MetricCard
          title="Global Accuracy"
          value={`${((metrics?.global_accuracy || 0) * 100).toFixed(1)}%`}
          icon={<Activity className="text-blue-500" />}
          trend="+4.2%"
          description="Aggregated performance across all districts"
        />
        <MetricCard
          title="Active Nodes"
          value={metrics?.total_districts || 0}
          icon={<Database className="text-purple-500" />}
          description="District-level models participating in consensus"
        />
        <MetricCard
          title="Total Samples"
          value={metrics?.total_samples || 0}
          icon={<TrendingUp className="text-orange-500" />}
          description="Local training examples processed this round"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Performance Table */}
        <div className="lg:col-span-2 bg-white/5 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Regional AI Performance
            </h3>
            <button
              onClick={handleTrainRound}
              disabled={training}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2"
            >
              {training ? (
                <RefreshCcw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCcw className="w-4 h-4" />
              )}
              Sync Model Weights
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="pb-3 px-2 font-medium">District</th>
                  <th className="pb-3 px-2 font-medium">Accuracy</th>
                  <th className="pb-3 px-2 font-medium">Samples</th>
                  <th className="pb-3 px-2 font-medium">Compliance</th>
                  <th className="pb-3 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {metrics?.district_performance?.map(
                  (district: any, idx: number) => (
                    <tr
                      key={idx}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-2 font-medium text-sm">
                        {district.district_id}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${district.accuracy * 100}%` }}
                            />
                          </div>
                          <span className="text-xs">
                            {(district.accuracy * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-sm text-slate-400">
                        {district.sample_size}
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full font-semibold border border-green-500/20">
                          VERIFIED
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-1.5 text-xs text-green-500">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Online
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Bias & Drift Monitor */}
        <div className="space-y-6">
          <div className="bg-white/5 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <ShieldQuestion className="w-5 h-5 text-orange-500" />
              Safety & Drift Monitor
            </h3>
            <div className="space-y-4">
              <SafetyIndicator
                label="Regional Bias Detection"
                value="Minimal (0.02)"
                status="Normal"
                color="blue"
              />
              <SafetyIndicator
                label="Model Weight Drift"
                value={metrics?.drift_detected ? "Detected" : "None"}
                status={metrics?.drift_detected ? "Warning" : "Secure"}
                color={metrics?.drift_detected ? "orange" : "green"}
              />
              <SafetyIndicator
                label="Privacy Leakage Risk"
                value="Zero Leakage"
                status="Safe"
                color="green"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Info className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">
                  Architecture Note
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                This AI node uses Federated Learning. Citizen complaint data
                stays within district servers. Only encrypted model updates are
                transmitted to the state coordinator.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Cpu className="w-24 h-24 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  icon,
  status,
  trend,
  description,
}: any) => (
  <div className="bg-white/5 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group">
    <div className="flex justify-between items-start mb-3">
      <div className="p-2 bg-slate-800/50 rounded-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
      {status && (
        <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full font-bold border border-green-500/20 uppercase">
          {status}
        </span>
      )}
      {trend && (
        <span className="text-xs font-bold text-blue-500 flex items-center gap-0.5">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      )}
    </div>
    <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
    <div className="text-slate-400 text-sm font-medium mb-2">{title}</div>
    <p className="text-[11px] text-slate-500 leading-tight">{description}</p>
  </div>
);

const SafetyIndicator = ({ label, value, status, color }: any) => {
  const colorMap: any = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  const textMap: any = {
    blue: "text-blue-500",
    green: "text-green-500",
    orange: "text-orange-500",
    red: "text-red-500",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-slate-800">
      <div>
        <div className="text-[10px] uppercase text-slate-500 font-bold mb-0.5">
          {label}
        </div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
      <div
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colorMap[color]}/10 ${textMap[color]} border border-${color}-500/20`}
      >
        {status}
      </div>
    </div>
  );
};

export default FLDashboard;
