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
  Registered: "bg-muted text-muted-foreground border-border",
  Assigned: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "In Progress": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Resolved: "bg-green-500/10 text-green-500 border-green-500/20",
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
              ? "bg-foreground text-background border border-border/10"
              : "bg-background text-foreground border border-border"
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
              <div className="bg-card/90 backdrop-blur-xl p-3 rounded-2xl border border-border shadow-2xl mb-2 pointer-events-auto hidden md:block">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest">
                      Live Signals
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground px-2 py-0.5 bg-muted rounded-full uppercase tracking-tighter">
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
                    className="bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xl pointer-events-auto group relative overflow-hidden"
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
                      <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 border border-border group-hover:bg-primary/5 transition-colors">
                        {CATEGORY_ICONS[c.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight">
                            {c.id}
                          </span>
                          <span className="text-[9px] font-bold text-muted-foreground/40 uppercase">
                            {getTimeAgo(c.timestamp)}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-foreground truncate mb-1 uppercase tracking-tight">
                          {c.category} Issue
                        </h4>
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
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
