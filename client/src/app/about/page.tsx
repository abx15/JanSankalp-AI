"use client";

import { motion } from "framer-motion";
import {
  Landmark,
  Target,
  Eye,
  Lightbulb,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Heart,
  Award,
  Globe,
  Code2,
} from "lucide-react";
import { TeamMember } from "@/components/about/TeamMember";
import { Footer } from "@/components/layout/Footer";

const VALUES = [
  {
    icon: Shield,
    title: "Transparency (पारदर्शिता)",
    desc: "Every complaint is tracked end-to-end with full visibility for citizens and administrators.",
  },
  {
    icon: Zap,
    title: "Efficiency (दक्षता)",
    desc: "AI-powered automation reduces resolution time from weeks to hours.",
  },
  {
    icon: Users,
    title: "Accessibility (सुलभता)",
    desc: "Multilingual support ensures every citizen can participate in governance.",
  },
  {
    icon: Heart,
    title: "Citizen-First (नागरिक प्रथम)",
    desc: "Built with the needs of everyday citizens at the core of every decision.",
  },
];

const IMPACT_METRICS = [
  { label: "Complaints Resolved", value: "15,000+", icon: Award },
  { label: "Active Cities", value: "12", icon: Globe },
  { label: "Avg Resolution Time", value: "24h", icon: Zap },
  { label: "User Satisfaction", value: "98%", icon: TrendingUp },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      {/* Hero Section */}
      <section className="px-6 mb-32">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6"
          >
            <Landmark className="w-4 h-4" />
            About JanSankalp AI
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 leading-tight"
          >
            Empowering Citizens,{" "}
            <span className="text-primary italic">Transforming Governance</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            JanSankalp AI is an intelligent civic engagement platform that
            bridges the gap between citizens and government through cutting-edge
            AI technology.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 mb-32">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary/80 text-white shadow-2xl shadow-primary/20"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black mb-4">Our Mission (मिशन)</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              To democratize civic engagement by providing every Indian citizen
              with a powerful, accessible platform to voice concerns and drive
              positive change in their communities through AI-powered
              governance.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] bg-card border-2 border-primary/20 shadow-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
              <Eye className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black mb-4">Our Vision (विज़न)</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              A future where every civic issue is heard, processed, and resolved
              efficiently—creating smarter, more responsive cities across India
              through transparent, data-driven governance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="px-6 mb-32 bg-muted/30 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              The Problem We Solve
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Traditional civic complaint systems are broken, inefficient, and
              inaccessible to millions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Language Barriers",
                desc: "Citizens struggle to file complaints in English, limiting participation.",
              },
              {
                title: "Manual Processing",
                desc: "Complaints get lost in bureaucracy, taking weeks or months to resolve.",
              },
              {
                title: "Zero Transparency",
                desc: "Citizens have no way to track their complaints or know the status.",
              },
            ].map((problem, i) => (
              <motion.div
                key={problem.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20"
              >
                <h3 className="text-xl font-bold mb-2 text-destructive">
                  ✗ {problem.title}
                </h3>
                <p className="text-muted-foreground">{problem.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="p-6 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl"
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Lightbulb className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black mb-4">
                  Our Solution
                </h2>
                <p className="text-white/90 text-base md:text-lg leading-relaxed mb-4">
                  JanSankalp AI uses advanced artificial intelligence to
                  automatically process, classify, and route complaints to the
                  right departments in real-time. With multilingual support,
                  duplicate detection, and transparent tracking, we ensure every
                  voice is heard and every issue is resolved efficiently.
                </p>
                <ul className="space-y-2">
                  {[
                    "Voice & text input in 22+ Indian languages",
                    "AI-powered smart classification and routing",
                    "Real-time tracking with SMS/email notifications",
                    "Duplicate detection to prevent redundancy",
                    "Analytics dashboard for administrators",
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm md:text-base"
                    >
                      <span className="text-white mt-1">✓</span>
                      <span className="text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 mb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="px-6 mb-32 bg-slate-950 text-white py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Powered by Cutting-Edge Technology
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Built with modern AI/ML frameworks and scalable cloud
              infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Code2,
                title: "AI & Machine Learning",
                techs: [
                  "GPT-4 for NLP",
                  "Custom fine-tuned models",
                  "TensorFlow & PyTorch",
                  "Scikit-learn for clustering",
                ],
              },
              {
                icon: Globe,
                title: "Web Technologies",
                techs: [
                  "Next.js 14 (React)",
                  "TypeScript",
                  "Tailwind CSS",
                  "Framer Motion",
                ],
              },
              {
                icon: Shield,
                title: "Backend & Database",
                techs: [
                  "Node.js & Express",
                  "PostgreSQL with Prisma",
                  "NextAuth.js",
                  "RESTful APIs",
                ],
              },
            ].map((stack, i) => (
              <motion.div
                key={stack.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-slate-900 border border-slate-800"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                  <stack.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{stack.title}</h3>
                <ul className="space-y-2">
                  {stack.techs.map((tech) => (
                    <li
                      key={tech}
                      className="text-slate-400 flex items-center gap-2"
                    >
                      <span className="text-primary">→</span>
                      {tech}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="px-6 mb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Our Impact (हमारा प्रभाव)
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real numbers, real change in communities across India.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {IMPACT_METRICS.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                  <metric.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-black text-primary mb-2">
                  {metric.value}
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="px-6 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Meet the Founder (संस्थापक)
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built with passion and dedication to transform civic governance in
              India.
            </p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative p-10 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 shadow-2xl overflow-hidden group hover:border-primary/40 transition-all">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-5xl md:text-6xl font-black shadow-2xl shadow-primary/30 ring-4 ring-primary/20 group-hover:scale-105 transition-transform">
                    AK
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-4">
                    <h3 className="text-3xl md:text-4xl font-black mb-2">
                      Arun Kumar
                    </h3>
                    <p className="text-primary font-bold text-lg uppercase tracking-wider">
                      Founder & Full Stack Developer
                    </p>
                  </div>

                  <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-2xl">
                    Passionate about leveraging cutting-edge AI and technology
                    to solve real-world problems and transform civic engagement
                    across India. Committed to building transparent, efficient,
                    and accessible governance solutions for every citizen.
                  </p>

                  {/* Social Links */}
                  <div className="flex gap-3 justify-center md:justify-start">
                    <a
                      href="https://github.com/abx15"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/arun-kumar-a3b047353/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href="mailto:developerarunwork@gmail.com"
                      className="w-12 h-12 rounded-xl bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </a>
                    <a
                      href="https://jansankalp.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
