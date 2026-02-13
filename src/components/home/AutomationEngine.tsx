"use client";

import { motion } from "framer-motion";
import {
  User,
  Brain,
  ShieldCheck,
  MapPin,
  Send,
  Loader2,
  FileText,
} from "lucide-react";

export const AutomationEngine = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto py-20 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative">
        {/* Connection Lines (Background) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 -z-10" />

        {/* Mobile Connection Lines */}
        <div className="md:hidden absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent -translate-x-1/2 -z-10" />

        {/* Node 1: Citizen Input */}
        <div className="flex flex-col items-center gap-4 relative">
          <motion.div
            className="w-20 h-20 rounded-2xl bg-card border-2 border-primary/20 flex items-center justify-center relative shadow-lg z-10"
            whileInView={{
              scale: [1, 1.05, 1],
              borderColor: [
                "rgba(var(--primary), 0.2)",
                "rgba(var(--primary), 0.5)",
                "rgba(var(--primary), 0.2)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <User className="w-10 h-10 text-primary" />

            {/* Pulsing Signal */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-primary/20"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <div className="text-center z-10">
            <h4 className="font-bold">Citizen Report</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Multi-lingual Input
            </p>
          </div>
        </div>

        {/* Node 2: AI Processing */}
        <div className="flex flex-col items-center gap-4 relative">
          <motion.div
            className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/40 flex items-center justify-center relative shadow-xl shadow-primary/5 z-10"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Brain className="w-10 h-10 text-primary" />

            {/* Floating Data Bits */}
            <motion.div
              className="absolute -top-2 -right-2 text-[10px] font-mono text-primary/60"
              animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Parse()
            </motion.div>
          </motion.div>
          <div className="text-center z-10">
            <h4 className="font-bold">AI Hub</h4>
            <p className="text-xs text-muted-foreground mt-1">
              NLU & Translation
            </p>
          </div>
        </div>

        {/* Node 3: Geo-Triage */}
        <div className="flex flex-col items-center gap-4 relative">
          <motion.div className="w-20 h-20 rounded-2xl bg-card border-2 border-primary/20 flex items-center justify-center relative shadow-lg z-10">
            <MapPin className="w-10 h-10 text-primary" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-12 h-12 rounded-full border border-primary/30" />
            </motion.div>
          </motion.div>
          <div className="text-center z-10">
            <h4 className="font-bold">Geo-Triage</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Location Analysis
            </p>
          </div>
        </div>

        {/* Node 4: Resolve */}
        <div className="flex flex-col items-center gap-4 relative">
          <motion.div className="w-20 h-20 rounded-2xl bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center shadow-lg z-10">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </motion.div>
          <div className="text-center z-10">
            <h4 className="font-bold text-green-700">Officer Relay</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-Assignment
            </p>
          </div>
        </div>

        {/* Moving Data Packet (Packet Animation) */}
        <motion.div
          className="absolute top-1/2 left-[10%] -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white shadow-lg"
          animate={{
            left: ["10%", "36%", "62%", "88%"],
            scale: [1, 1.2, 1, 1.2],
            rotate: [0, 90, 180, 270],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            times: [0, 0.33, 0.66, 1],
            ease: "linear",
          }}
        >
          <motion.div
            animate={{ scale: [1, 0.8, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <FileText className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>

      {/* Automation Description overlay */}
      <motion.div
        className="mt-16 p-8 rounded-[2rem] bg-muted/40 border-2 border-primary/5 backdrop-blur-sm relative"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Loader2 className="w-3 h-3 animate-spin" /> Live Triage System
            </div>
            <h3 className="text-3xl font-black">
              Faster than human triage.{" "}
              <span className="text-primary italic">Every time.</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              When a report is filed, our system doesn't wait for humans. It
              immediately <strong>packs the metadata</strong>, performs a{" "}
              <strong>vector search</strong> for nearby duplicates, and routes
              the ticket to the specific terminal of the responsible officer.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-card border shadow-sm">
              <h5 className="text-2xl font-black text-primary"> &lt; 2s</h5>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Processing Time
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-card border shadow-sm">
              <h5 className="text-2xl font-black text-primary">100%</h5>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Auto-Assignment
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-card border shadow-sm">
              <h5 className="text-2xl font-black text-primary">22+</h5>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Languages
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-card border shadow-sm">
              <h5 className="text-2xl font-black text-primary">Geo</h5>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Aware Routing
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
