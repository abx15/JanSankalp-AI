"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveEvents } from "@/context/LiveEventContext";
import {
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Zap,
  Trash2,
  X,
} from "lucide-react";

const CATEGORY_ICONS = {
  Road: <AlertTriangle className="w-4 h-4 text-orange-500" />,
  Garbage: <Trash2 className="w-4 h-4 text-green-500" />,
  Water: <Droplets className="w-4 h-4 text-blue-500" />,
  Electricity: <Zap className="w-4 h-4 text-yellow-500" />,
};

const STATUS_COLORS = {
  Registered: "bg-slate-100 text-slate-600 border-slate-200",
  Assigned: "bg-blue-50 text-blue-600 border-blue-100",
  "In Progress": "bg-orange-50 text-orange-600 border-orange-100",
  Resolved: "bg-green-50 text-green-600 border-green-100",
};

export const LiveComplaintStream = () => {
  const { complaints } = useLiveEvents();
  const [isMobile, setIsMobile] = React.useState(false);
  const [showStream, setShowStream] = React.useState(true);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return "Just Now";
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  const displayCount = isMobile ? 1 : 5;

  return (
    <>
      {/* TOGGLE BUTTON */}
      <div className="fixed bottom-6 left-6 z-[101] pointer-events-auto">
        <button
          onClick={() => setShowStream(!showStream)}
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl ${
            showStream
              ? "bg-slate-900 text-white border border-white/10"
              : "bg-white text-slate-900 border border-slate-200"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${showStream ? "bg-primary" : "bg-red-500"}`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${showStream ? "bg-primary" : "bg-red-500"}`}
            ></span>
          </span>
          {showStream ? "Live: ON" : "Live: OFF"}
        </button>
      </div>

      <AnimatePresence>
        {showStream && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-6 md:top-24 md:right-6 md:bottom-auto z-[100] w-[calc(100%-3rem)] md:w-full md:max-w-[320px] pointer-events-none"
          >
            <div className="flex flex-col gap-3">
              <div className="bg-slate-900/90 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-2xl mb-2 pointer-events-auto hidden md:block">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      Live Signals
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 bg-white/5 rounded-full uppercase tracking-tighter">
                    {complaints.length} active
                  </span>
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {complaints.slice(0, displayCount).map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      x: 20,
                      scale: 0.95,
                      transition: { duration: 0.2 },
                    }}
                    layout
                    className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl pointer-events-auto group relative overflow-hidden"
                  >
                    {/* Progress Bar Background */}
                    {c.status !== "Resolved" && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-primary/20"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 40, ease: "linear" }}
                      />
                    )}

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-primary/5 transition-colors">
                        {CATEGORY_ICONS[c.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                            {c.id}
                          </span>
                          <span className="text-[9px] font-bold text-slate-300 uppercase">
                            {getTimeAgo(c.timestamp)}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 truncate mb-1 uppercase tracking-tight">
                          {c.category} Issue
                        </h4>
                        <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span className="text-[10px] font-bold truncate">
                            {c.location}
                          </span>
                        </div>
                        <div
                          className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_COLORS[c.status]}`}
                        >
                          {c.status}
                        </div>
                      </div>
                      {c.status === "Resolved" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 text-green-500"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {complaints.length === 0 && (
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-dashed border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Awaiting Uplink...
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
