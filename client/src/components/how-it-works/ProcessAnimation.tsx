"use client";

import { motion } from "framer-motion";
import { User, Mic, Brain, Building2, CheckCircle2 } from "lucide-react";

export const ProcessAnimation = () => {
  return (
    <div className="w-full py-20 bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black mb-4"
          >
            See It In Action (प्रक्रिया देखें)
          </motion.h2>
          <p className="text-slate-400">
            The seamless journey from complaint to resolution.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 mt-12 min-h-[400px] md:min-h-[200px]">
          {/* Animated Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 hidden md:block rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-purple-500 to-green-500 w-full"
              initial={{ x: "-100%" }}
              whileInView={{ x: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            />
          </div>

          {/* Step 1: Citizen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <User className="w-8 h-8 text-blue-400" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-center"
            >
              <h3 className="font-bold text-lg">Citizen</h3>
              <p className="text-xs text-slate-400">Reports Issue</p>
            </motion.div>
          </motion.div>

          {/* Step 2: Input */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 border-4 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mt-4 text-center"
            >
              <h3 className="font-bold text-lg">Voice Input</h3>
              <p className="text-xs text-slate-400">Any Language</p>
            </motion.div>
          </motion.div>

          {/* Step 3: AI Processing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.4 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-purple-500 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)]">
              <Brain className="w-10 h-10 text-purple-400 animate-spin-slow" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="mt-4 text-center"
            >
              <h3 className="font-bold text-lg text-purple-400">AI Engine</h3>
              <p className="text-xs text-slate-400">Translates & Classifies</p>
            </motion.div>
          </motion.div>

          {/* Step 4: Department */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 2.0 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 border-4 border-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.3)]">
              <Building2 className="w-6 h-6 text-orange-400" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
              className="mt-4 text-center"
            >
              <h3 className="font-bold text-lg">Department</h3>
              <p className="text-xs text-slate-400">Action Taken</p>
            </motion.div>
          </motion.div>

          {/* Step 5: Resolution */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 2.6 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full bg-slate-900 border-4 border-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8 }}
              className="mt-4 text-center"
            >
              <h3 className="font-bold text-lg text-green-400">Resolved</h3>
              <p className="text-xs text-slate-400">Citizen Notified</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
