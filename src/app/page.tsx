"use client";

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
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  AIAnimatedIcon,
  GovWaveBackground,
  FloatingParticle,
} from "@/components/ui/icons/GovIcons";
import { ProcessFlow } from "@/components/home/ProcessFlow";
import { AutomationEngine } from "@/components/home/AutomationEngine";
import { Footer } from "@/components/layout/Footer";

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
    <main className="min-h-screen bg-background selection:bg-primary/10">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 md:pt-28 pb-10 md:pb-12 px-6">
        <GovWaveBackground />
        {[...Array(10)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} />
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background/50 -z-20" />

        <motion.div
          className="max-w-5xl mx-auto text-center z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-6 mb-10"
          >
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full" />
              <AIAnimatedIcon />
            </div>
            <div className="w-56 h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-transparent rounded-3xl flex items-center justify-center p-2 group transition-transform hover:scale-105 relative">
              <Image
                src="/logojansanklp.png"
                alt="JanSankalp AI"
                fill
                sizes="(max-width: 768px) 224px, (max-width: 1024px) 288px, 384px"
                className="object-contain scale-110 group-hover:scale-125 transition-transform duration-700"
                priority
              />
            </div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-2xl md:text-3xl font-medium text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            “Har Awaaz, Har Shehar –{" "}
            <span className="text-foreground font-bold">
              Digital Governance for a Smart India.
            </span>
            ”
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 text-sm font-bold"
          >
            {[
              "Digital Reporting",
              "Bilingual Support",
              "Auto-Routing",
              "Smart Triage",
            ].map((tag) => (
              <span
                key={tag}
                className="bg-card/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-primary/10 shadow-sm hover:border-primary/30 transition-colors"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-12 bg-muted/30 border-y backdrop-blur-sm relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
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
              <span className="text-primary italic">Automation in Action</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              From your voice to the officer's desk – see how our AI engine
              packages, routes, and resolves issues in real-time.
            </p>
          </div>
          <AutomationEngine />
        </div>
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
            <h2 className="text-4xl font-black mt-2">Report an Issue Today</h2>
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
              <p className="text-slate-500">// AI Triage Pipeline</p>
              <p>const report = await processVoice(citizenAudio);</p>
              <p>const embedding = AI.cluster(report.location);</p>
              <p className="text-green-400">
                if (embedding.isDuplicate()) {"{"}
              </p>
              <p className="pl-4">
                Citizen.notify("Similar issue nearby tagged!");
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

      {/* Features Grid */}
      <section className="py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Core Capabilities</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Technological bridge between citizens and administrators for
              efficient problem-solving.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative p-8 rounded-[2rem] bg-card border hover:border-primary/30 transition-all shadow-xl shadow-primary/5"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors
                  ${feature.color === "blue" ? "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : ""}
                  ${feature.color === "green" ? "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white" : ""}
                  ${feature.color === "orange" ? "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white" : ""}
                `}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
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
            Join thousands of citizens who are using JanSankalp AI to transform
            their neighborhoods. Real-time data meets human governance.
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
                15,000+ complaints resolved with 98% satisfaction rate across 12
                cities.
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
                Average resolution time of just 24 hours vs weeks in traditional
                systems.
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
              <h3 className="text-lg font-bold mb-2">Continuous Improvement</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI learns from every complaint to get smarter and more efficient
                over time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Frequently Asked Questions (सामान्य प्रश्न)
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about JanSankalp AI.
            </p>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-card border"
            >
              <h3 className="text-xl font-bold mb-3 flex items-start gap-3">
                <MessageSquare className="w-6 h-6 text-primary shrink-0 mt-1" />
                How do I file a complaint? (शिकायत कैसे दर्ज करें?)
              </h3>
              <p className="text-muted-foreground leading-relaxed pl-9">
                Simply use the complaint form on this page. You can type or use
                voice input in any of 22+ Indian languages. Upload photos/videos
                as evidence, and our AI will handle the rest.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border"
            >
              <h3 className="text-xl font-bold mb-3 flex items-start gap-3">
                <Zap className="w-6 h-6 text-primary shrink-0 mt-1" />
                How long does it take to resolve a complaint?
              </h3>
              <p className="text-muted-foreground leading-relaxed pl-9">
                On average, complaints are resolved within 24 hours. Critical
                issues are prioritized and addressed even faster. You'll receive
                real-time updates throughout the process.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-card border"
            >
              <h3 className="text-xl font-bold mb-3 flex items-start gap-3">
                <BarChart3 className="w-6 h-6 text-primary shrink-0 mt-1" />
                Can I track my complaint status?
              </h3>
              <p className="text-muted-foreground leading-relaxed pl-9">
                Yes! You'll receive SMS and email notifications at every stage.
                You can also log in to your dashboard to see real-time status,
                officer details, and estimated resolution time.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-card border"
            >
              <h3 className="text-xl font-bold mb-3 flex items-start gap-3">
                <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
                Is my data secure and private?
              </h3>
              <p className="text-muted-foreground leading-relaxed pl-9">
                Absolutely. All data is encrypted (TLS 1.3 in transit, AES-256
                at rest), and we follow strict GDPR compliance. Only authorized
                personnel can access your complaint.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-card border"
            >
              <h3 className="text-xl font-bold mb-3 flex items-start gap-3">
                <Globe className="w-6 h-6 text-primary shrink-0 mt-1" />
                What types of complaints can I file?
              </h3>
              <p className="text-muted-foreground leading-relaxed pl-9">
                You can report civic issues like potholes, water supply
                problems, electricity failures, garbage collection, street
                lights, and more. Our AI categorizes them automatically.
              </p>
            </motion.div>
          </div>
        </div>
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
            Join thousands of citizens using JanSankalp AI to make their voices
            heard and drive real change in their communities.
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
  );
}
