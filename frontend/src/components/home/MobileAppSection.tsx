"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Bell, Target, ShieldCheck } from "lucide-react";

export const MobileAppSection = () => {
  return (
    <div className="w-full py-32 px-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="bg-primary rounded-[4rem] p-12 md:p-24 relative flex flex-col lg:flex-row items-center gap-16 overflow-hidden shadow-[0_50px_100px_-20px_rgba(59,130,246,0.3)]">
          {/* Animated Background Glows */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/20 blur-[120px] rounded-full"
          />

          <div className="flex-1 space-y-8 relative z-10 text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] border border-white/20 backdrop-blur-md"
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile Experience
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              Governance in <br />
              <span className="text-white/40 italic font-serif">
                your pocket.
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80 font-medium max-w-xl leading-relaxed">
              Report issues, chat with AI, and track resolutions on the move.
              The JanSankalp mobile app brings transparency to your fingertips.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10">
              {[
                {
                  icon: Bell,
                  title: "Instant Alerts",
                  desc: "Real-time push status updates.",
                },
                {
                  icon: Target,
                  title: "Precision Geo",
                  desc: "Pin-point accuracy coding.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white group-hover:text-primary transition-all duration-500">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-sm text-white/60 font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-5 pt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-16 px-10 rounded-2.5rem bg-black flex items-center justify-center gap-4 cursor-pointer hover:bg-black/90 transition-all border border-white/10 shadow-2xl"
              >
                <div className="text-left leading-tight">
                  <p className="text-[10px] uppercase font-black text-white/40 tracking-widest">
                    Download on
                  </p>
                  <p className="text-xl font-bold">App Store</p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-16 px-10 rounded-2.5rem bg-black flex items-center justify-center gap-4 cursor-pointer hover:bg-black/90 transition-all border border-white/10 shadow-2xl"
              >
                <div className="text-left leading-tight">
                  <p className="text-[10px] uppercase font-black text-white/40 tracking-widest">
                    Get it on
                  </p>
                  <p className="text-xl font-bold">Google Play</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="flex-1 relative flex justify-center">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <div className="w-[320px] h-[640px] bg-slate-950 rounded-[4rem] border-[14px] border-slate-900 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden ring-4 ring-white/10">
                {/* Simulated App Screen */}
                <div className="absolute inset-x-0 top-0 h-8 flex justify-center items-end pb-2">
                  <div className="w-24 h-5 bg-slate-900 rounded-full" />
                </div>
                <div className="p-8 pt-16 space-y-8">
                  <div className="h-4 w-2/3 bg-slate-900 rounded-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-28 rounded-[1.5rem] bg-primary/20 border border-primary/20" />
                    <div className="h-28 rounded-[1.5rem] bg-slate-900" />
                  </div>
                  <div className="h-44 rounded-[2rem] bg-slate-900 border border-white/5" />
                  <div className="space-y-4">
                    <div className="h-2.5 w-full bg-slate-900 rounded-full" />
                    <div className="h-2.5 w-full bg-slate-900 rounded-full" />
                    <div className="h-2.5 w-1/2 bg-slate-900 rounded-full" />
                  </div>
                  <div className="h-20 rounded-[1.5rem] bg-primary shadow-lg shadow-primary/20 flex items-center justify-center font-black">
                    REPORT ISSUE
                  </div>
                </div>
                {/* Screen Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Dynamic Light Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/20 rounded-full blur-[120px] -z-10 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
