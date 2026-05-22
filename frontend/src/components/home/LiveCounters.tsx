"use client";

import React, { useState, useEffect } from "react";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useLiveEvents } from "@/context/LiveEventContext";
import { Users, CheckCircle2, Building2, TrendingUp } from "lucide-react";

const Counter = ({
  value,
  label,
  icon: Icon,
  suffix = "",
}: {
  value: number;
  label: string;
  icon: any;
  suffix?: string;
}) => {
  const count = useSpring(0, { stiffness: 50, damping: 30 });
  const display = useTransform(count, (v) => Math.floor(v).toLocaleString());

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  return (
    <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-soft relative overflow-hidden group hover:border-primary/30 transition-all">
      <div className="absolute top-0 right-0 p-8 opacity-5 text-foreground group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <motion.span className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            {display}
          </motion.span>
          <span className="text-xl font-black text-primary">{suffix}</span>
        </div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
          {label}
        </p>

        <div className="mt-8 flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />
            +2.4%
          </div>
          <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
            Since last hour
          </span>
        </div>
      </div>
    </div>
  );
};

export const LiveCounters = () => {
  const { stats } = useLiveEvents();

  return (
    <div className="w-full max-w-6xl mx-auto py-24 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Counter
          value={stats.totalToday}
          label="Total Complaints Today"
          icon={Users}
          suffix="+"
        />
        <Counter
          value={stats.resolvedToday}
          label="Resolved Today"
          icon={CheckCircle2}
        />
        <Counter
          value={stats.activeDepartments}
          label="Active Departments"
          icon={Building2}
          suffix="Cells"
        />
      </div>
    </div>
  );
};
