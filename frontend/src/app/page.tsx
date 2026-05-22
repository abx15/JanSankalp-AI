"use client";

import React from "react";
import ComplaintForm from "@/components/complaints/ComplaintForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Activity, Globe, ArrowUpRight, Zap, ChevronRight, CheckCircle2, Play, Users, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ProcessFlow } from "@/components/home/ProcessFlow";
import { AutomationEngine } from "@/components/home/AutomationEngine";
import { Footer } from "@/components/layout/Footer";

// Live Civic OS Components
import { LiveEventProvider } from "@/context/LiveEventContext";
import { LiveComplaintStream } from "@/components/home/LiveComplaintStream";
import { LiveCityMap } from "@/components/home/LiveCityMap";
import { LiveCounters } from "@/components/home/LiveCounters";
import { TrustedPartners } from "@/components/home/TrustedPartners";
import { ImpactStories } from "@/components/home/ImpactStories";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { DashboardSimulation } from "@/components/home/DashboardSimulation";
import { NetworkSection } from "@/components/home/NetworkSection";
import { VoicesOfJanSankalp } from "@/components/home/VoicesOfJanSankalp";

const FEATURES = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multilingual Voice AI",
    desc: "Speak or type in any local language. Our AI understands, translates, and sanitizes input instantly across all major Indian languages.",
    color: "blue",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Smart Complaint Triage",
    desc: "Multi-agent LLM systems classify issues, detect duplicates, filter spam, and execute smart dynamic routing to active officers in <60s.",
    color: "green",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Live GPS Tracking",
    desc: "Monitor your grievance journey from submission to municipal verification with real-time updates and active interactive feeds.",
    color: "orange",
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: "24/7 Sovereign Grid",
    desc: "Submit issues anytime from anywhere. Our highly resilient decentralized infrastructure operates continuously without interruption.",
    color: "purple",
  },
  {
    icon: <Landmark className="w-6 h-6" />,
    title: "Public Transparency Node",
    desc: "Immutable ledger tracking of complaint lifecycles. Complete operational transparency with zero hidden municipal backchannels.",
    color: "indigo",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: "Social Trust Rewards",
    desc: "Earn verified civic points upon issue resolution. Exchange points for public governance badges and regional steward ranks.",
    color: "emerald",
  },
];

export default function Home() {
  const [metrics, setMetrics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/sovereign/metrics");
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch home metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const stats = [
    {
      label: "Issues Resolved",
      value: metrics?.global?.resolved?.toLocaleString() || "15,247+",
      desc: "Verified local resolutions",
    },
    {
      label: "Active Cities",
      value: metrics?.global?.cities || "12+",
      desc: "Municipal territories connected",
    },
    {
      label: "Avg. Resolution Time",
      value: metrics?.global?.resolutionTime || "24h",
      desc: "Under strict SLA metrics",
    },
    {
      label: "Citizen Satisfaction",
      value: `${metrics?.global?.satisfaction || 98}%`,
      desc: "Verified trust score feedback",
    },
  ];

  const pipelineSteps = [
    {
      title: "Grievance Filed",
      actor: "Citizen Portal",
      desc: "Issue captured via multilingual text or voice AI.",
      badge: "Pending",
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "AI Triage & Classification",
      actor: "JanSankalp Llama Core",
      desc: "Checks duplicates, analyzes spam score, assigns severity levels.",
      badge: "Processing",
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Queue & Dynamic Routing",
      actor: "BullMQ Triage Engine",
      desc: "Automated handoff to the designated regional department head.",
      badge: "In Progress",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Resolution & Rewards",
      actor: "Municipal Officer",
      desc: "Verifies repair, credits +50 Social Points, dispatches PDF invoice.",
      badge: "Resolved",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <LiveEventProvider>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground selection:bg-primary/10 overflow-x-hidden">
        
        {/* Dynamic Premium Header Hero */}
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
          {/* Subtle Cybernetic Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
          
          {/* Dynamic Mesh Gradients */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-indigo-500/20 to-orange-500/10 blur-[140px] rounded-full" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-emerald-500/15 to-blue-500/20 blur-[140px] rounded-full" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 flex flex-col items-center text-center">
            
            {/* National Identity Live Status Tag */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-full px-5 py-2 shadow-2xl mb-10"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] flex items-center gap-1.5">
                Sovereign Municipal OS <span className="text-orange-500">•</span> Active Node
              </span>
            </motion.div>

            {/* Typography Header Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] text-white">
                JanSankalp <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-emerald-500">
                  AI Grid
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-semibold mb-12 px-4">
                Decentralized municipal automation framework empowering Indian citizens and governance with real-time AI-driven resolution pipelines.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4 w-full max-w-lg mx-auto">
                <Button
                  size="lg"
                  className="rounded-2xl h-14 sm:h-16 text-sm sm:text-base font-black bg-gradient-to-r from-orange-500 to-indigo-600 text-white shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 active:scale-95 transition-all w-full sm:w-auto px-8"
                  asChild
                >
                  <a href="#report">
                    <span className="flex items-center justify-center gap-2">
                      Report Grievance <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl h-14 sm:h-16 text-sm sm:text-base font-black border-slate-800 bg-slate-900/60 text-slate-300 backdrop-blur-xl hover:bg-slate-800/80 shadow-2xl hover:-translate-y-1 active:scale-95 transition-all w-full sm:w-auto px-8"
                  asChild
                >
                  <a href="/how-it-works">Citizen Guide</a>
                </Button>
              </div>
            </motion.div>

            {/* Sovereign Standards Footer Tag */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-orange-500" /> Defense-Grade Triage
              </span>
              <span className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-white" /> BullMQ Micro-routing
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-500" /> 22 Official Languages
              </span>
            </motion.div>

          </div>
        </section>

        {/* Dynamic National Trusted Partners Ticker */}
        <TrustedPartners />

        {/* Live Active Complaint streaming log */}
        <section className="bg-slate-900 border-y border-slate-800">
          <LiveComplaintStream />
        </section>

        {/* Grid Statistics Segment */}
        <section className="relative z-20 w-full py-16 px-6 -mt-16 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-xl text-center group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 group-hover:text-indigo-600 transition-colors">
                    {stat.label}
                  </p>
                  <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4">
                    {stat.desc}
                  </p>
                  <div className="w-10 h-1 bg-gradient-to-r from-orange-500 to-indigo-600 rounded-full mx-auto group-hover:w-20 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Step-by-Step AI Routing pipeline showcase */}
        <section className="py-24 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-950">
                Resolution Lifecycle
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                JanSankalp Autonomous Pipeline
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
                Watch the defensive-grade AI triage and routing logic dispatch municipal issues instantly.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {pipelineSteps.map((step, i) => (
                <div
                  key={step.title}
                  onClick={() => setActiveStep(i)}
                  className={`p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer relative group ${
                    activeStep === i
                      ? "bg-slate-900 border-slate-800 text-white shadow-2xl"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 text-slate-900 dark:text-white hover:bg-slate-100/50"
                  }`}
                >
                  <div className="absolute top-4 right-4 flex items-center justify-center">
                    <span className={`w-3.5 h-3.5 rounded-full animate-pulse bg-gradient-to-r ${step.color}`} />
                  </div>

                  <div className="text-3xl font-black text-slate-300 dark:text-slate-700 group-hover:text-indigo-600 transition-colors mb-6">
                    0{i + 1}
                  </div>

                  <h4 className="text-lg font-bold tracking-tight mb-1">{step.title}</h4>
                  <p className={`text-[10px] font-black uppercase tracking-wider mb-4 ${activeStep === i ? "text-orange-400" : "text-slate-400"}`}>
                    Actor: {step.actor}
                  </p>

                  <p className={`text-xs font-semibold leading-relaxed ${activeStep === i ? "text-slate-300" : "text-slate-500"}`}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live GIS Map hot nodes */}
        <section className="bg-slate-50 dark:bg-slate-950 py-12">
          <div className="max-w-4xl mx-auto text-center px-6 mb-8 space-y-2">
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Active GIS Sensor Node Matrix</h3>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
              Real-time spatial telemetry telemetry maps public complaints to coordinate hotspots dynamically.
            </p>
          </div>
          <LiveCityMap />
        </section>

        <section className="bg-slate-50 dark:bg-slate-900/30">
          <LiveCounters />
        </section>

        {/* Live Dashboard Control Center */}
        <section className="bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
          <DashboardSimulation />
        </section>

        {/* Feature Grid with dynamic HSL indicators */}
        <section className="w-full py-24 px-6 bg-slate-100 dark:bg-slate-900/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20">
              <div className="max-w-3xl space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-950">
                  Resiliency Features
                </span>
                <h2 className="text-3xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[0.9]">
                  Decentralized Municipal <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-indigo-600 italic font-serif font-medium">
                    Operating System
                  </span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-semibold leading-relaxed max-w-2xl">
                  Structured to process thousands of municipal reports, execute zero-delay routing, protect privacy, and dynamic trust profiles.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-2 bg-gradient-to-r from-orange-500 to-indigo-600 rounded-full" />
                <div className="w-6 h-2 bg-slate-300 dark:bg-slate-800 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ y: 25, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-xl group hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-8 group-hover:scale-105 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Queue automation visuals */}
        <section className="w-full py-20 px-6 bg-white dark:bg-slate-950">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Queue Processing Framework
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
              Under the hood of the BullMQ cluster triaging regional complaints concurrently.
            </p>
          </div>
          <AutomationEngine />
        </section>

        {/* Grievance Submission Node */}
        <section
          id="report"
          className="w-full py-24 px-6 bg-slate-50 dark:bg-slate-900/20 relative"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-orange-50 dark:bg-orange-950/40 text-orange-600 px-4 py-1.5 rounded-full border border-orange-100 dark:border-orange-950">
                    File Portal
                  </span>
                  <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.95]">
                    Direct Connection <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-indigo-600 font-serif italic">
                      to Officers
                    </span>
                  </h2>
                </div>
                
                <div className="space-y-8">
                  {[
                    {
                      step: "01",
                      title: "Capture & Context",
                      desc: "Submit your report via text or voice. The Llama extractor analyzes regional coordinates, severity, and filters duplicates instantly.",
                    },
                    {
                      step: "02",
                      title: "Dynamic BullMQ Route",
                      desc: "The complaint is dispatched through priority queues and assigned directly to the active municipal head.",
                    },
                    {
                      step: "03",
                      title: "Civic Point Reward",
                      desc: "Once verified resolved, receive exactly +50 impact points and your secure HTML email invoice receipt.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-6 group">
                      <span className="text-4xl font-black text-slate-200 dark:text-slate-800 group-hover:text-indigo-500 transition-colors">
                        {item.step}
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{item.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/5 to-indigo-500/10 rounded-[3rem] blur-2xl" />
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-2xl relative z-10">
                  <ComplaintForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stories */}
        <section className="bg-slate-100 dark:bg-slate-950">
          <ImpactStories />
        </section>

        {/* Connectivity Nodes */}
        <NetworkSection />

        <HomeFAQ />

        <VoicesOfJanSankalp />

        {/* Sovereign CTA Call to Action */}
        <section className="w-full py-32 px-6 relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-indigo-500/10 blur-[130px] rounded-full" />
          <div className="max-w-6xl mx-auto text-center relative z-10 space-y-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85]">
              A Better Bharat <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-emerald-500">
                Starts with You.
              </span>
            </h2>
            <p className="text-slate-400 font-semibold text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Experience the power of transparent governance. Join the JanSankalp AI municipal network today.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <Button
                size="lg"
                className="rounded-2xl h-16 text-base font-black bg-gradient-to-r from-orange-500 to-indigo-600 text-white shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 active:scale-95 transition-all px-12"
                asChild
              >
                <Link href="/auth/signup">Join the Movement</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl h-16 text-base font-black border-slate-800 bg-slate-900/60 text-slate-300 backdrop-blur-xl hover:bg-slate-800/80 shadow-2xl hover:-translate-y-1 active:scale-95 transition-all px-12"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </LiveEventProvider>
  );
}
