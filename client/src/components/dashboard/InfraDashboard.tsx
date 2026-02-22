"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Map as MapIcon,
  Droplets,
  Wind,
  Zap,
  AlertTriangle,
  Thermometer,
  Cctv,
  Satellite,
  Activity,
  Navigation,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getInfrastructureAnalytics } from "@/lib/ai-service";

const InfraDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getInfrastructureAnalytics();
      if (result) setData(result);
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 15000); // Live updates every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">
        Initializing IoT Ingestion...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Real-time Map Overlay (Simulated with Heatmap list) */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {/* Simulated Grid Background */}
            <div className="w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                <Navigation className="w-5 h-5 text-blue-500" />
                Live Infrastructure Risk Map
              </h3>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Active Risk Zones
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Sensors Stable
                </span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 gap-4 overflow-y-auto">
              {data?.health_map?.map((point: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${point.intensity > 0.7 ? "bg-red-500/20 text-red-500" : "bg-blue-500/20 text-blue-500"}`}
                    >
                      {point.type === "Flood Risk" ? (
                        <Droplets className="w-5 h-5" />
                      ) : point.type === "Road Damage" ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <Activity className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {point.type}
                      </div>
                      <div className="text-xs text-slate-500">
                        Lat: {point.lat}, Lng: {point.lng}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-black ${point.intensity > 0.7 ? "text-red-500" : "text-blue-500"}`}
                    >
                      {(point.intensity * 100).toFixed(0)}% Intensity
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-black">
                      Risk Score
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Predictive Alerts Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/20 rounded-3xl p-6">
            <h4 className="text-sm font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Predictive Maintenance
            </h4>
            <div className="space-y-4">
              <AlertItem
                title="Flood Risk Alert"
                desc={`Water level in North Sector exceeds ${(data?.flood_risk * 10).toFixed(1)}m threshold.`}
                time="Likely in 2h"
                severity="HIGH"
              />
              <AlertItem
                title="Power Outage Prediction"
                desc="Smart meter load in Ward 12 suggests transformer surge risk."
                time="Analysis Active"
                severity="MEDIUM"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h4 className="text-sm font-bold text-slate-400 mb-4 flex items-center justify-between">
              Active Smart Sensors
              <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">
                {data?.active_sensors?.length || 0} Online
              </span>
            </h4>
            <div className="space-y-3">
              {data?.active_sensors?.map((sensor: any) => (
                <div
                  key={sensor.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <SensorIcon type={sensor.type} />
                    <span className="text-xs font-medium text-slate-300">
                      {sensor.id}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-blue-500">
                    {sensor.last_value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertItem = ({ title, desc, time, severity }: any) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
    <div className="flex justify-between items-start">
      <div className="text-sm font-bold text-white">{title}</div>
      <span
        className={`text-[10px] px-2 py-0.5 rounded-full font-black ${severity === "HIGH" ? "bg-red-500/20 text-red-500" : "bg-orange-500/20 text-orange-500"}`}
      >
        {severity}
      </span>
    </div>
    <p className="text-xs text-slate-400 leading-snug">{desc}</p>
    <div className="text-[10px] text-slate-500 font-bold uppercase">{time}</div>
  </div>
);

const SensorIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "water_level":
      return <Droplets className="w-4 h-4 text-blue-400" />;
    case "air_quality":
      return <Wind className="w-4 h-4 text-green-400" />;
    case "smart_meter":
      return <Zap className="w-4 h-4 text-yellow-400" />;
    default:
      return <Activity className="w-4 h-4 text-slate-400" />;
  }
};

export default InfraDashboard;
