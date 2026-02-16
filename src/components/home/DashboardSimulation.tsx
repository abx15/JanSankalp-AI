"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  Search,
  Bell,
  Filter,
  LayoutDashboard,
  Database,
  Shield,
  Zap,
  Circle,
} from "lucide-react";

export const DashboardSimulation = () => {
  const [timer, setTimer] = useState("09:42:15");
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 100 });
  const [recId, setRecId] = useState<number | null>(null);

  useEffect(() => {
    setRecId(Math.floor(Math.random() * 9));
    const interval = setInterval(() => {
      const now = new Date();
      setTimer(now.toLocaleTimeString("en-US", { hour12: false }));

      // Target random UI elements for the "ghost cursor"
      setCursorPos({
        x: 200 + Math.random() * 400,
        y: 150 + Math.random() * 300,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto py-24 px-6 relative">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-2xl">
          <Circle className="w-2 h-2 fill-red-500 text-red-500 animate-pulse" />
          LIVE SYSTEM RECORDING
          <span className="text-slate-500 ml-4 font-mono">{timer}</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          THE GOVERNANCE PORTAL
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto font-medium">
          A high-fidelity gaze into the backend interface used by city officials
          to manage regional infrastructure.
        </p>
      </div>

      <div className="relative aspect-video bg-slate-900 rounded-[3rem] border-[12px] border-slate-950 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* The Dashboard UI */}
        <div className="absolute inset-0 bg-slate-50 flex pointer-events-none">
          {/* Sidebar */}
          <div className="w-20 md:w-64 border-r border-slate-200 bg-white p-6 hidden md:flex flex-col">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <span className="font-black text-slate-900 tracking-tight">
                KONTROL.AI
              </span>
            </div>
            <div className="space-y-4">
              {[
                { icon: Inbox, label: "Triage Hub", active: true },
                { icon: Database, label: "Data Lake" },
                { icon: Shield, label: "Security" },
                { icon: Bell, label: "Alerts" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl ${item.active ? "bg-primary/5 text-primary" : "text-slate-400"}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
              <div className="relative z-10">
                <div className="text-[10px] font-black tracking-widest text-primary mb-2">
                  LATENCY
                </div>
                <div className="text-2xl font-black mb-1">24ms</div>
                <div className="text-[9px] text-slate-500 font-bold uppercase">
                  Optimal Performance
                </div>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-xl"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="h-20 border-b border-slate-200 px-8 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 italic">
                Regional Dashboard /{" "}
                <span className="text-primary not-italic">Infrastructure</span>
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="w-24 h-3 bg-slate-100 rounded-full" />
              </div>
            </div>

            <div className="p-8 grid grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="w-10 h-1 bg-slate-100 rounded mb-4" />
                  <div className="w-20 h-4 bg-slate-200 rounded mb-2" />
                  <div className="w-12 h-3 bg-slate-50 rounded" />
                </div>
              ))}
            </div>

            <div className="mt-4 px-8 flex-1">
              <div className="h-full rounded-t-[3rem] border-x border-t border-slate-200 bg-white p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-48 h-6 bg-slate-100 rounded-lg" />
                  <div className="flex gap-2">
                    <div className="w-20 h-8 rounded-xl bg-slate-50 border border-slate-100" />
                    <div className="w-20 h-8 rounded-xl bg-slate-50 border border-slate-100" />
                  </div>
                </div>
                <div className="space-y-6">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-6 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-100" />
                      <div className="flex-1 space-y-2">
                        <div className="w-1/3 h-4 bg-slate-200 rounded" />
                        <div className="w-1/4 h-3 bg-slate-100 rounded" />
                      </div>
                      <div className="w-24 h-2 bg-slate-50 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recording Overlay Visuals */}
        <div className="absolute inset-x-8 top-8 flex justify-between pointer-events-none z-20">
          <div className="font-mono text-[10px] text-red-500 font-black uppercase flex items-center gap-2 bg-slate-950/20 backdrop-blur px-3 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            REC 00:0{recId ?? 0}:42:15
          </div>
          <div className="font-mono text-[10px] text-white/50 font-black uppercase tracking-widest bg-slate-950/20 backdrop-blur px-3 py-1 rounded">
            1080P / 60 FPS
          </div>
        </div>

        <div className="absolute inset-8 border border-white/10 rounded-[2rem] pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/30" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/30" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/30" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/30" />
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]" />

        {/* Ghost Cursor */}
        <motion.div
          animate={{ x: cursorPos.x, y: cursorPos.y }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute pointer-events-none z-50 text-slate-800"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0V15L4 11L7 18L10 16.5L7 9.5L13 9L0 0Z"
              fill="currentColor"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </motion.div>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        {[
          "ADMIN ACCESS",
          "ISO CERTIFIED",
          "SECURE LAYER V4",
          "REAL-TIME SYNC",
        ].map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-black text-slate-400 border border-slate-200 px-4 py-2 rounded-full uppercase tracking-[0.2em]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
