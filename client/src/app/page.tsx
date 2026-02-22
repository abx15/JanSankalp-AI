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
      <main className="min-h-screen bg-slate-950 selection:bg-primary/30 text-slate-100">
        {/* Futuristic Hero Section: Civilizational OS */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          {/* Advanced Background Layer */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-slate-900" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 brightness-100 contrast-150 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900 to-slate-900 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_90%,transparent_100%)]" />
          </div>

          <GovWaveBackground />
          {[...Array(20)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.3} />
          ))}

          <motion.div
            className="max-w-6xl mx-auto text-center z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-8">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl backdrop-blur-xl px-6 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-8">
                Next-Gen Sovereign Intelligence
              </Badge>
              <h1 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-b from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                JanSankalp <br />
                <span className="italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sovereign AI</span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-3xl font-semibold bg-gradient-to-r from-blue-100 via-purple-100 to-blue-200 bg-clip-text text-transparent max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              The world&apos;s first{" "}
              <span className="font-bold text-blue-600">
                Civilizational Operating System
              </span>
              {" "}. Bridging the gap between{" "}
              <span className="font-bold text-purple-600">
                1.4 Billion voices
              </span>
              {" "}and{" "}
              <span className="font-bold text-blue-600">
                autonomous smart governance.
              </span>
              {" "}🏛️
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-6"
            >
              <a
                href="#report"
                className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-black text-xl shadow-2xl hover:from-blue-700 hover:to-purple-700 hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                Report Crisis Now
              </a>
              <a
                href="/dashboard/admin"
                className="px-12 py-6 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 backdrop-blur-xl rounded-full font-black text-lg hover:from-slate-700 hover:to-slate-800 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Enter Command Hub
              </a>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-20 flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              {[
                "Defense Grade Security",
                "Edge Computing",
                "Neural Triage",
                "Real-time Mesh",
              ].map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Abstract Interface Preview */}
          <div className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-full max-w-5xl h-screen bg-primary/5 rounded-[5rem] blur-[80px] -z-10" />
        </section>

        <LiveComplaintStream />

        {/* Live Sovereignty Pulse Stats */}
        <section className="py-20 bg-black/40 border-y border-white/5 backdrop-blur-2xl relative z-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">
                    {stat.label}
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tighter mb-1">
                    {stat.value}
                  </div>
                  <div className="w-12 h-1 bg-primary/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Automation Flow Section */}
        <section className="py-20 md:py-32 px-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                How it Works:{" "}
                <span className="text-primary italic">
                  Automation in Action
                </span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                From your voice to the officer&apos;s desk – see how our AI
                engine packages, routes, and resolves issues in real-time.
              </p>
            </div>
            <AutomationEngine />
          </div>
        </section>

        {/* SECTION 2: LIVE MAP ACTIVITY (After How It Works) */}
        <section className="bg-white border-b relative z-20">
          <LiveCityMap />
        </section>

        {/* Traditional Process Flow Section */}
        <section className="py-20 md:py-32 px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 text-balance">
              <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter">
                Awasthi Se Mukti (आज़ादी अव्यवस्था से)
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                Bridging the gap between citizens and administration with
                transparency and speed.
              </p>
            </div>
            <ProcessFlow />
          </div>
        </section>

        {/* Reporting Section (Glassmorphic) */}
        <section id="report" className="relative py-16 md:py-24 px-6 z-30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary font-bold text-sm tracking-widest uppercase">
                Take Action
              </span>
              <h2 className="text-4xl font-black mt-2">
                Report an Issue Today
              </h2>
            </div>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-primary/5 p-1 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)]"
            >
              <ComplaintForm />
            </motion.div>
          </div>
        </section>

        {/* Technical Engine Section */}
        <section className="py-20 md:py-32 px-6 bg-slate-950 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] pointer-events-none" />
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8 leading-tight">
                The AI Engine Under <br />
                <span className="text-primary italic">The Hood</span>
              </h2>
              <div className="space-y-8">
                {ENGINE_SPECS.map((spec, i) => (
                  <motion.div
                    key={spec.title}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-6"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0 border border-primary/30">
                      {spec.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{spec.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {spec.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-slate-900 border border-primary/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
              <div className="font-mono text-sm text-primary/80 space-y-2">
                <p className="text-slate-500">{"// AI Triage Pipeline"}</p>
                <p>const report = await processVoice(citizenAudio);</p>
                <p>const embedding = AI.cluster(report.location);</p>
                <p className="text-green-400">
                  if (embedding.isDuplicate()) {"{"}
                </p>
                <p className="pl-4">
                  Citizen.notify(&quot;Similar issue nearby tagged!&quot;);
                </p>
                <p>
                  {"}"} else {"{"}
                </p>
                <p className="pl-4">
                  Officer.assign(report.category, report.urgency);
                </p>
                <p>{"}"}</p>
              </div>
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mt-8 pt-8 border-t border-slate-800"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Active Models
                  </span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 5: DASHBOARD SIMULATION */}
        <section className="bg-slate-50 border-y relative z-20">
          <DashboardSimulation />
        </section>

        {/* Sovereign Command Hubs Preview */}
        <section className="py-32 px-6 relative overflow-hidden bg-slate-900/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
                Sovereign{" "}
                <span className="text-primary italic">Command Hubs</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                Access the multi-layered neural network of national and global
                governance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "UN Governance",
                  desc: "Global SDG alignment and international municipal benchmarking.",
                  icon: Globe,
                  link: "/dashboard/admin/un-governance",
                  tag: "Global",
                  color: "blue",
                },
                {
                  title: "National Command",
                  desc: "Strategic crisis management and digital twin infrastructure health.",
                  icon: Shield,
                  link: "/dashboard/admin/national-command",
                  tag: "National",
                  color: "red",
                },
                {
                  title: "AI Mayor Console",
                  desc: "Hyper-local municipal optimization and citizen resonance metrics.",
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
                  whileHover={{ y: -10 }}
                  className="group p-8 rounded-[3rem] bg-white/5 border border-white/5 hover:border-primary/50 transition-all backdrop-blur-3xl overflow-hidden relative"
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-${hub.color}-500/10 blur-[60px] -z-10`}
                  />
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/5 group-hover:bg-${hub.color}-500/20 transition-colors`}
                  >
                    <hub.icon
                      className={`w-8 h-8 text-${hub.color === "blue" ? "primary" : hub.color + "-500"}`}
                    />
                  </div>
                  <Badge className="mb-4 bg-white/5 text-slate-400 border-none uppercase tracking-widest text-[9px] font-black">
                    {hub.tag} Node
                  </Badge>
                  <h3 className="text-2xl font-black mb-4">{hub.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                    {hub.desc}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                    Initialize Link <ArrowUpRight className="w-4 h-4" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Core Capabilities Bento Grid */}
        <section className="py-16 md:py-24 px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4 tracking-tight">
                System Core Capabilities
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Advanced neural layers powering the modern digital nation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="group relative p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 text-primary`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 md:py-24 px-6 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-8">
              Building a Smarter Tomorrow
            </h2>
            <p className="text-xl opacity-90 mb-12 leading-relaxed">
              Join thousands of citizens who are using JanSankalp AI to
              transform their neighborhoods. Real-time data meets human
              governance.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 opacity-70" />
                <span className="font-bold text-lg">Data-Driven</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 opacity-70" />
                <span className="font-bold text-lg">Transparent</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 opacity-70" />
                <span className="font-bold text-lg">Community Oriented</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-24 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Why Choose JanSankalp AI? (क्यों चुनें?)
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The smart choice for modern civic engagement.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-card border hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Proven Results</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  15,000+ complaints resolved with 98% satisfaction rate across
                  12 cities.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-card border hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Average resolution time of just 24 hours vs weeks in
                  traditional systems.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-card border hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Precision AI</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  99% classification accuracy ensures your complaint reaches the
                  right department.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-card border hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  Continuous Improvement
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI learns from every complaint to get smarter and more
                  efficient over time.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section: Neural Command Style */}
        <section className="py-24 px-6 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
                Resonance <span className="text-primary italic">Protocol</span>{" "}
                (FAQ)
              </h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                System Briefing & Common Inquiries
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How do I file a complaint?",
                  a: "Simply use the complaint form on this page. You can type or use voice input in any of 22+ Indian languages. Upload photos/videos as evidence, and our AI will handle the rest.",
                },
                {
                  q: "How long does it take to resolve a complaint?",
                  a: "On average, complaints are resolved within 24 hours. Critical issues are prioritized and addressed even faster. You'll receive real-time updates throughout the process.",
                },
                {
                  q: "Is my data secure and private?",
                  a: "Absolutely. All data is encrypted (TLS 1.3 in transit, AES-256 at rest), and we follow strict defense-grade compliance protocols.",
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2rem] bg-slate-950/50 border border-white/5 hover:border-primary/20 transition-all cursor-crosshair group"
                >
                  <h3 className="text-lg font-black mb-3 flex items-center gap-3 group-hover:text-primary transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary" />
                    {faq.q}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed pl-5 border-l border-white/5">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: LIVE ACTIVITY COUNTER (Before CTA) */}
        <section className="bg-slate-50 border-y relative z-20">
          <LiveCounters />
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-24 px-6 bg-gradient-to-br from-primary to-primary/80 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Ready to Transform Your City?
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl opacity-90 mb-8 leading-relaxed"
            >
              Join thousands of citizens using JanSankalp AI to make their
              voices heard and drive real change in their communities.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <a
                href="#report"
                className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform"
              >
                File a Complaint Now
              </a>
              <a
                href="/how-it-works"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-colors"
              >
                Learn More
              </a>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </LiveEventProvider>
  );
}
