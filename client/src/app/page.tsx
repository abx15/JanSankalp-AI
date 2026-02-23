"use client";

import React from "react";
import ComplaintForm from "@/components/complaints/ComplaintForm";
import {
  Landmark,
  Shield,
  Zap,
  Globe,
  MessageSquare,
  BarChart3,
  Users,
  Code2,
  Database,
  BrainCircuit,
  CheckCircle2,
  Activity,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  AIAnimatedIcon,
  GovWaveBackground,
  FloatingParticle,
} from "@/components/ui/icons/GovIcons";
import { ProcessFlow } from "@/components/home/ProcessFlow";
import { AutomationEngine } from "@/components/home/AutomationEngine";
import { Footer } from "@/components/layout/Footer";

// Live Civic OS Components
import { LiveEventProvider } from "@/context/LiveEventContext";
import { LiveComplaintStream } from "@/components/home/LiveComplaintStream";
import { LiveCityMap } from "@/components/home/LiveCityMap";
import { LiveCounters } from "@/components/home/LiveCounters";
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

const STATS = [
  { label: "Issues Resolved (समाधान)", value: "15,000+" },
  { label: "Active Cities (शहर)", value: "12" },
  { label: "Avg. Resolution (समय)", value: "24h" },
  { label: "Satisfaction (संतुष्टि)", value: "98%" },
];

const ENGINE_SPECS = [
  {
    icon: <Code2 className="w-5 h-5" />,
    title: "Multilingual NLP",
    desc: "Powered by GPT-4 and custom fine-tuned models for 22+ Indian languages.",
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "Geo-Spatial Clustering",
    desc: "Optimized indexing of reports to group similar issues in real-time.",
  },
  {
    icon: <BrainCircuit className="w-5 h-5" />,
    title: "Automated Urgency",
    desc: "Risk assessment algorithm that flags critical infrastructure failures.",
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <LiveEventProvider>
      <main className="min-h-screen bg-civic-background text-civic-text selection:bg-civic-primary/10">
        {/* Immersive Hero Section */}
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white">
          {/* Subtle Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(6,95,70,0.05),transparent)]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03]" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-20 py-32 md:py-48 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Badge className="bg-civic-primary/10 text-civic-primary border-civic-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Next-Gen Civic Operating System
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tight leading-[0.9] text-civic-text mb-8">
                Empowering <br />
                <span className="text-civic-primary">Governance</span> <br />
                With <span className="text-civic-accent italic">Civic AI</span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                The world&apos;s first{" "}
                <span className="text-civic-secondary font-bold">
                  Civic Intelligence Platform
                </span>{" "}
                designed to bridge the gap between citizens and administration
                through real-time automation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <a
                href="#report"
                className="group relative px-10 py-5 bg-civic-accent text-white rounded-xl font-bold text-xl shadow-2xl shadow-civic-accent/20 hover:shadow-civic-accent/40 hover:-translate-y-1 transition-all duration-300"
              >
                Report Issue Now
              </a>
              <a
                href="/dashboard/admin"
                className="px-10 py-5 bg-white text-civic-primary border-2 border-civic-primary/10 rounded-xl font-bold text-xl hover:bg-civic-primary/5 hover:border-civic-primary/20 transition-all duration-300"
              >
                Admin Command Hub
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-24 flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
            >
              {[
                { label: "Secure", icon: Shield },
                { label: "Real-time", icon: Activity },
                { label: "Multilingual", icon: Globe },
                { label: "Automated", icon: BrainCircuit },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-2">
                  <item.icon className="w-3 h-3 text-civic-primary" />
                  {item.label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Bottom Fade */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-civic-background to-transparent" />
        </section>

        {/* Live Complaint Stream */}
        <LiveComplaintStream />

        {/* Stats Section: High Contrast Professional Bar */}
        <section className="relative z-20 w-full bg-civic-background py-0 md:-mt-20">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden divide-x divide-slate-100">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 md:p-12 flex flex-col items-center text-center group hover:bg-slate-50 transition-colors"
                >
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-civic-primary transition-colors">
                    {stat.label}
                  </span>
                  <span className="text-4xl md:text-5xl font-black text-civic-text tracking-tighter mb-2">
                    {stat.value}
                  </span>
                  <div className="w-10 h-1 bg-civic-accent/20 rounded-full group-hover:w-full transition-all duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Automation Flow Section */}
        <section className="w-full py-24 md:py-32 px-4 md:px-10 lg:px-20 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                How it Works:{" "}
                <span className="text-civic-primary italic">
                  Digital Automation
                </span>
              </h2>
              <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                From your voice to officer&apos;s desk – our AI packages,
                routes, and resolves issues with zero human friction.
              </p>
            </div>
            <AutomationEngine />
          </div>
        </section>

        {/* Live Map Activity */}
        <section className="w-full bg-slate-50 border-b">
          <div className="w-full">
            <LiveCityMap />
          </div>
        </section>

        {/* Process Flow Section */}
        <section className="w-full py-24 md:py-32 px-4 md:px-10 lg:px-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
                Awasthi Se Mukti
              </h2>
              <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                Bridging the gap between citizens and administration with
                national-grade transparency.
              </p>
            </div>
            <ProcessFlow />
          </div>
        </section>

        {/* Reporting Section (Professional Card) */}
        <section
          id="report"
          className="w-full py-24 md:py-32 px-4 md:px-10 lg:px-20 bg-slate-50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-civic-accent/30 to-transparent" />
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="bg-civic-accent/10 text-civic-accent border-none mb-4">
                Direct Action
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                Submit Your Report
              </h2>
            </div>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-[2.5rem] bg-white border border-slate-200 p-2 shadow-3xl"
            >
              <div className="bg-white rounded-[2rem] p-6 md:p-12">
                <ComplaintForm />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Technical Engine Section */}
        <section className="w-full py-24 md:py-32 px-4 md:px-10 lg:px-20 bg-civic-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 blur-[120px] pointer-events-none" />
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <h2 className="text-4xl md:text-6xl font-black leading-tight">
                The Neural Core <br />
                <span className="text-civic-accent italic">Under The Hood</span>
              </h2>
              <div className="space-y-10">
                {ENGINE_SPECS.map((spec, i) => (
                  <motion.div
                    key={spec.title}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-8 group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-civic-accent shrink-0 border border-white/10 group-hover:bg-civic-accent/20 transition-all">
                      {spec.icon}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold mb-2 text-white">
                        {spec.title}
                      </h4>
                      <p className="text-white/60 text-base leading-relaxed">
                        {spec.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-4xl backdrop-blur-xl group"
            >
              <div className="font-mono text-sm text-civic-accent/80 space-y-4">
                <p className="text-slate-500">
                  {"// AI Triage Pipeline Layer"}
                </p>
                <div className="space-y-1">
                  <p>const report = await processVoice(citizenAudio);</p>
                  <p>const embedding = AI.cluster(report.location);</p>
                </div>
                <div className="space-y-1 text-emerald-400">
                  <p>if (embedding.isDuplicate()) {"{"}</p>
                  <p className="pl-6">
                    Citizen.notify(&quot;Issue localized!&quot;);
                  </p>
                  <p>
                    {"}"} else {"{"}
                  </p>
                  <p className="pl-6">Officer.assign(report.category);</p>
                  <p>{"}"}</p>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Model: Civic-GPT v4.0
                </span>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dashboard Simulation */}
        <section className="w-full bg-white border-y">
          <div className="w-full">
            <DashboardSimulation />
          </div>
        </section>

        {/* Command Hubs Bento */}
        <section className="w-full py-24 md:py-48 px-4 md:px-10 lg:px-20 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">
                Sovereign{" "}
                <span className="text-civic-primary italic">Hubs</span>
              </h2>
              <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                Access the multi-layered neural network of national and global
                governance centers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  title: "UN Governance",
                  desc: "Global SDG alignment and international municipal benchmarking portal.",
                  icon: Globe,
                  link: "/dashboard/admin/un-governance",
                  tag: "Global",
                  color: "blue",
                },
                {
                  title: "National Command",
                  desc: "Strategic crisis management and digital twin infrastructure health monitoring.",
                  icon: Shield,
                  link: "/dashboard/admin/national-command",
                  tag: "National",
                  color: "red",
                },
                {
                  title: "AI Mayor Console",
                  desc: "Hyper-local municipal optimization and citizen resonance metrics dashboard.",
                  icon: Landmark,
                  link: "/dashboard/admin",
                  tag: "Municipal",
                  color: "emerald",
                },
              ].map((hub, i) => (
                <motion.a
                  key={hub.title}
                  href={hub.link}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-10 md:p-12 rounded-[3.5rem] bg-white border border-slate-200 hover:border-civic-primary hover:shadow-3xl transition-all duration-500 flex flex-col h-full"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 bg-slate-50 group-hover:bg-civic-primary/10 transition-colors">
                    <hub.icon className="w-8 h-8 text-civic-primary" />
                  </div>
                  <Badge className="w-fit mb-6 bg-slate-100 text-slate-500 border-none uppercase tracking-widest text-[9px] font-black group-hover:bg-civic-primary/5 transition-colors">
                    {hub.tag} Node
                  </Badge>
                  <h3 className="text-2xl font-black mb-4 text-civic-text">
                    {hub.title}
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed mb-10 flex-grow">
                    {hub.desc}
                  </p>
                  <div className="flex items-center gap-3 text-civic-primary font-black text-xs uppercase tracking-widest group-hover:gap-6 transition-all">
                    Initialize Access <ArrowUpRight className="w-4 h-4" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section className="w-full py-24 md:py-32 px-4 md:px-10 lg:px-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 text-balance">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                National Edge Capabilities
              </h2>
              <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
                Advanced structural layers powering the modern digital nation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="p-10 md:p-14 rounded-[3rem] bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-2xl transition-all h-full"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-civic-primary/5 text-civic-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-civic-text">
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

        {/* Dynamic Impact Section */}
        <section className="w-full py-32 md:py-48 px-4 md:px-10 lg:px-20 bg-civic-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter">
              A Smarter Bharat <br /> Starts Here.
            </h2>
            <p className="text-xl md:text-3xl font-medium opacity-80 mb-20 leading-relaxed">
              Join millions using JanSankalp AI to transform neighborhoods.
              Real-time data meets deep structural governance for a better
              tomorrow.
            </p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20">
              {[
                { icon: BarChart3, label: "Data-Driven" },
                { icon: MessageSquare, label: "Transparent" },
                { icon: Users, label: "Citizen-Led" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-4"
                >
                  <item.icon className="w-12 h-12 opacity-50" />
                  <span className="font-bold text-xl uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Responsive FAQ */}
        <section className="w-full py-24 md:py-32 px-4 md:px-10 lg:px-20 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                Citizens’{" "}
                <span className="text-civic-primary italic">Protocol</span>
              </h2>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                Common Briefing & System Queries
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "How do I file a complaint?",
                  a: "Simply use the portal above. Our AI understands 22+ Indian languages via voice or text. Upload proof, and your case is triaged instantly.",
                },
                {
                  q: "What is the resolution TAT?",
                  a: "Average resolution is 24 hours. Critical issues like water or power failures are prioritized for faster human-AI response.",
                },
                {
                  q: "Is my identity secure?",
                  a: "JanSankalp AI uses defense-grade encryption. Your personal data is only visible to authorized municipal officers on a need-to-know basis.",
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-civic-primary/20 transition-all cursor-crosshair group"
                >
                  <h3 className="text-xl font-black mb-4 flex items-center gap-4 group-hover:text-civic-primary transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-civic-primary transition-colors" />
                    {faq.q}
                  </h3>
                  <p className="text-slate-500 text-lg leading-relaxed pl-6 border-l-2 border-slate-200">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Counters */}
        <section className="bg-slate-50 border-y relative z-20">
          <LiveCounters />
        </section>

        {/* Final CTA */}
        <section className="w-full py-32 md:py-48 px-4 md:px-10 lg:px-20 bg-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-5xl md:text-8xl font-black mb-10 tracking-tight"
            >
              Ready to <span className="text-civic-accent">Transform?</span>
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-3xl text-slate-600 mb-16 max-w-3xl mx-auto leading-relaxed"
            >
              Become part of the most advanced civic movement in the world. Real
              change, powered by AI.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <a
                href="#report"
                className="px-12 py-6 bg-civic-primary text-white rounded-2xl font-bold text-xl shadow-3xl hover:bg-civic-primary/95 hover:-translate-y-1 transition-all"
              >
                Start Reporting
              </a>
              <a
                href="/how-it-works"
                className="px-12 py-6 bg-slate-100 text-civic-text rounded-2xl font-bold text-xl hover:bg-slate-200 transition-all"
              >
                Documentation
              </a>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </LiveEventProvider>
  );
}
