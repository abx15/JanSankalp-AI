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
import { DashboardSimulation } from "@/components/home/DashboardSimulation";

const FEATURES = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multilingual Voice AI",
    desc: "Speak or type in any language. Our AI understands and translates instantly. (अपनी भाषा में बोलें, AI सब समझता है)",
    color: "blue",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Eco-Verified Triage",
    desc: "AI classifies issues and prevents duplicates, ensuring fast resolution. (AI शिकायतों को सही विभाग तक पहुँचाता है)",
    color: "green",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Real-time Tracking",
    desc: "Get instant updates as your complaint moves from report to resolution. (अपनी शिकायत की ताज़ा स्थिति जानें)",
    color: "orange",
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
      label: "Issues Resolved (समाधान)",
      value: metrics?.global?.resolved?.toLocaleString() || "15,000+",
    },
    {
      label: "Active Nodes (शहर/नेटवर्क)",
      value: metrics?.global?.cities || "12",
    },
    {
      label: "Avg. Resolution (समय)",
      value: metrics?.global?.resolutionTime || "24h",
    },
    {
      label: "Sovereign Health (संतुष्टि)",
      value: `${metrics?.global?.satisfaction || 98}%`,
    },
  ];

  return (
    <LiveEventProvider>
      <main className="min-h-screen bg-background text-foreground selection:bg-primary/10">
        {/* Immersive Hero Section */}
        <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-slate-50">
          {/* Subtle Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.08),transparent)]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.05]" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-20 py-32 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 border border-primary/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Active Governance OS
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-slate-900 mb-8 max-w-5xl">
                Smart Governance <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Reimagined
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
                Empowering citizens and administration through an AI-driven
                platform for real-time grievance redressal and transparent civic
                management.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="rounded-2xl px-10 h-16 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-soft transition-all hover:-translate-y-1 active:scale-95"
                  asChild
                >
                  <a href="#report">Report Issue</a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl px-10 h-16 text-lg font-semibold border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all hover:-translate-y-1 active:scale-95"
                  asChild
                >
                  <a href="/how-it-works">How It Works</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400"
            >
              {[
                { label: "Secure Protocol", icon: Shield },
                { label: "Real-time Triage", icon: Activity },
                { label: "Universal Context", icon: Globe },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-2.5">
                  <item.icon className="w-3.5 h-3.5 text-primary/60" />
                  {item.label}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Live Complaint Stream */}
        <section className="bg-white border-y">
          <LiveComplaintStream />
        </section>

        {/* Stats Section */}
        <section className="relative z-20 w-full py-16 px-4 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-soft hover:border-primary/20 transition-all text-center group"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 group-hover:text-primary transition-colors">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
                    {stat.value}
                  </p>
                  <div className="w-12 h-1 bg-primary/10 rounded-full mx-auto" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="w-full py-32 px-4 md:px-10 lg:px-20 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                  Intelligent Civic <br />
                  <span className="text-primary italic font-serif leading-none">
                    Redundancy Core
                  </span>
                </h2>
                <p className="text-slate-600 text-lg font-medium">
                  Our system doesn&apos;t just track issues; it understands
                  them. Using advanced NLP, we ensure every voice is heard and
                  every problem is correctly classified.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="w-12 h-1 bg-primary rounded-full" />
                <div className="w-4 h-1 bg-primary/20 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-soft hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-primary/5 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Flow Simulation */}
        <section
          id="report"
          className="w-full py-32 px-4 md:px-10 lg:px-20 bg-white"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
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
                        <p className="text-slate-500 font-medium">
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
                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl">
                  <ComplaintForm />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-32 px-4 md:px-10 lg:px-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px]" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tight">
              A Better Bharat <br /> Starts with You.
            </h2>
            <p className="text-lg md:text-xl font-medium text-slate-400 mb-16 max-w-2xl mx-auto">
              Ready to see real-time governance in action? Join the JanSankalp
              network today and help shape a more responsive future.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button
                size="lg"
                className="rounded-2xl px-12 h-16 text-lg font-semibold bg-primary hover:bg-primary/90"
                asChild
              >
                <Link href="/auth/signup">Join the Movement</Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="rounded-2xl px-12 h-16 text-lg font-semibold text-white hover:bg-white/5"
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
