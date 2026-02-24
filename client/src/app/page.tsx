"use client";

import React from "react";
import ComplaintForm from "@/components/complaints/ComplaintForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Activity, Globe, ArrowUpRight, Zap } from "lucide-react";
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
    desc: "Speak or type in any language. Our AI understands and translates instantly for all Indian languages.",
    color: "blue",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Smart Complaint Triage",
    desc: "AI classifies issues, prevents duplicates, and ensures fast resolution with intelligent routing.",
    color: "green",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Live Tracking",
    desc: "Monitor your complaint progress from report to resolution with real-time updates at your fingertips.",
    color: "orange",
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: "24/7 Service",
    desc: "File complaints anytime, anywhere. Our service is always available when you need help.",
    color: "purple",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Complete Transparency",
    desc: "Full information at every step. No hidden processes, only complete clarity in action.",
    color: "indigo",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Data",
    desc: "Your information is completely protected with government-grade security standards.",
    color: "emerald",
  },
];

export default function Home() {
  const [metrics, setMetrics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

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
      value: metrics?.global?.resolved?.toLocaleString() || "15,000+",
    },
    {
      label: "Active Cities",
      value: metrics?.global?.cities || "12",
    },
    {
      label: "Avg. Resolution Time",
      value: metrics?.global?.resolutionTime || "24h",
    },
    {
      label: "Citizen Satisfaction",
      value: `${metrics?.global?.satisfaction || 98}%`,
    },
  ];

  return (
    <LiveEventProvider>
      <main className="min-h-screen bg-background text-foreground selection:bg-primary/10 overflow-x-hidden">
        {/* Immersive Hero Section */}
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden mesh-gradient">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full"
            />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-20 py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 flex flex-col items-center text-center overflow-x-hidden">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-background/50 backdrop-blur-md text-primary px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-8 sm:mb-12 border border-primary/20 shadow-xl"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Active Governance OS
              </motion.div>

              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black tracking-tighter leading-[0.9] text-foreground mb-4 sm:mb-6 md:mb-8 lg:mb-10 max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl px-2">
                JanSankalp <br />
                <span className="text-gradient">AI</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-full sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed font-semibold mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 opacity-80 px-4">
                Bridging the gap between citizens and administration through
                India&apos;s most advanced real-time civic operating system.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 px-4 w-full max-w-full">
                <Button
                  size="lg"
                  className="rounded-[2.5rem] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 text-sm sm:text-base md:text-lg lg:text-xl font-black bg-primary text-white shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.5)] transition-all hover:-translate-y-2 active:scale-95 group relative overflow-hidden w-full sm:w-auto"
                  asChild
                >
                  <a href="#report">
                    <span className="relative z-10 flex items-center gap-2">
                      Report Issue
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full"
                      animate={{ translateX: ["100%", "-100%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-[2.5rem] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 text-sm sm:text-base md:text-lg lg:text-xl font-black border-border/50 bg-background/50 backdrop-blur-xl hover:bg-muted/80 shadow-2xl transition-all hover:-translate-y-2 active:scale-95 w-full sm:w-auto"
                  asChild
                >
                  <a href="/how-it-works">Citizen Guide</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60"
            >
              {[
                { label: "Secure Protocol", icon: <Shield className="w-3.5 h-3.5 text-primary/60" /> },
                { label: "Real-time Triage", icon: <Activity className="w-3.5 h-3.5 text-primary/60" /> },
                { label: "Universal Context", icon: <Globe className="w-3.5 h-3.5 text-primary/60" /> },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-2.5">
                  {item.icon}
                  {item.label}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trusted Partners Ticker */}
        <TrustedPartners />

        {/* Live Complaint Stream */}
        <section className="bg-background border-y border-border">
          <LiveComplaintStream />
        </section>

        {/* Stats Section */}
        <section className="relative z-20 w-full py-12 sm:py-14 md:py-16 lg:py-18 xl:py-20 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-20 -mt-24 sm:-mt-28 md:-mt-32 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-4 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] glass-card hover:bg-card/80 transition-all text-center group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 group-hover:text-primary transition-colors relative z-10">
                    {stat.label}
                  </p>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-3 sm:mb-4 relative z-10">
                    {stat.value}
                  </p>
                  <div className="w-12 h-1.5 bg-primary/20 rounded-full mx-auto relative z-10 group-hover:w-24 transition-all duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live City Map Section */}
        <section className="bg-background relative z-10 pt-8 sm:pt-10 md:pt-12">
          <div className="max-w-4xl mx-auto text-center px-3 sm:px-4 md:px-6 lg:px-8 mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4">JanSankalp Network Connectivity</h3>
            <p className="text-muted-foreground font-medium">
              Real-time downlink from the JanSankalp AI network nodes across the country.
            </p>
          </div>
          <LiveCityMap />
        </section>

        <section className="bg-muted/10">
          <LiveCounters />
        </section>

        {/* Core Features */}
        <section className="w-full py-20 sm:py-24 md:py-32 lg:py-36 xl:py-40 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-20 bg-muted/20 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -z-10" />
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8 sm:gap-10 md:gap-12 mb-16 sm:mb-20 md:mb-24">
              <div className="max-w-3xl">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-foreground mb-6 sm:mb-8 leading-[0.9]"
                >
                  Intelligent Civic <br />
                  <span className="text-gradient italic font-serif">
                    Resolution Engine
                  </span>
                </motion.h2>
                <p className="text-muted-foreground text-base sm:text-lg md:text-xl lg:text-2xl font-semibold leading-relaxed">
                  JanSankalp AI bridges the gap between citizens and
                  administration. We turn raw grievances into structured, actionable data points.
                </p>
              </div>
              <div className="flex gap-3">
                <motion.div
                  whileHover={{ width: 100 }}
                  className="w-20 h-2 bg-primary rounded-full transition-all cursor-pointer shadow-lg shadow-primary/20"
                />
                <div className="w-6 h-2 bg-primary/20 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                  whileHover={{ y: -15 }}
                  className="p-6 sm:p-8 md:p-10 lg:p-12 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] glass-card group hover:bg-card transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 md:mb-10 bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-3 sm:mb-4 text-foreground tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Automation Showcase */}
        <section className="w-full py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-background">
          <div className="max-w-4xl mx-auto text-center px-3 sm:px-4 md:px-6 mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4">
              The Automation Core
            </h2>
            <p className="text-muted-foreground font-medium">
              How JanSankalp AI manages thousands of reports without missing a single beat.
            </p>
          </div>
          <AutomationEngine />
        </section>

        {/* Flow Simulation - Report Form */}
        <section
          id="report"
          className="w-full py-20 sm:py-24 md:py-28 lg:py-32 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-20 bg-background"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6 sm:mb-8">
                  Direct Line to <br />
                  <span className="text-secondary font-serif italic">
                    Resolution
                  </span>
                </h2>
                <div className="space-y-8">
                  {[
                    {
                      step: "01",
                      title: "Capture & Context",
                      desc: "Speak or type in your regional language. Our AI extracts location, severity, and category instantly.",
                    },
                    {
                      step: "02",
                      title: "Automated Routing",
                      desc: "Issues are cross-referenced with department availability and history to assign the most effective team.",
                    },
                    {
                      step: "03",
                      title: "Transparent Tracking",
                      desc: "Monitor resolution progress with real-time updates and direct communication channels.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-6 group">
                      <span className="text-4xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                        {item.step}
                      </span>
                      <div>
                        <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                        <p className="text-muted-foreground font-medium">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-[3rem] blur-2xl -z-10" />
                <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-2xl">
                  <ComplaintForm />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Impact & Success Stories */}
        <section className="bg-muted/20">
          <ImpactStories />
        </section>

        {/* Second Network Section */}
        <NetworkSection />

        <HomeFAQ />

        <VoicesOfJanSankalp />

        {/* Final CTA */}
        <section className="w-full py-40 px-4 md:px-10 lg:px-20 relative overflow-hidden mesh-gradient">
          <div className="absolute top-0 right-0 w-[60%] h-full bg-primary/10 blur-[150px] rounded-full animate-pulse" />
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.h2
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="text-6xl md:text-9xl font-black mb-12 tracking-tighter leading-[0.8]"
            >
              A Better Bharat <br />
              <span className="text-gradient">Starts with You.</span>
            </motion.h2>
            <p className="text-xl md:text-3xl font-semibold text-muted-foreground mb-20 max-w-4xl mx-auto leading-relaxed">
              Ready to see real-time governance in action? Join the JanSankalp AI network today and help shape a more responsive future.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <Button
                size="lg"
                className="rounded-[3rem] px-16 h-24 text-2xl font-black bg-primary text-white shadow-[0_25px_60px_rgba(59,130,246,0.4)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.6)] transition-all hover:-translate-y-3 active:scale-95 group overflow-hidden relative"
                asChild
              >
                <Link href="/auth/signup">
                  <span className="relative z-10 flex items-center gap-3">
                    Join the Movement
                    <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full"
                    animate={{ translateX: ["100%", "-100%"] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-[3rem] px-16 h-24 text-2xl font-black border-border/50 bg-background/50 backdrop-blur-3xl hover:bg-muted/80 shadow-2xl transition-all hover:-translate-y-3 active:scale-95"
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
