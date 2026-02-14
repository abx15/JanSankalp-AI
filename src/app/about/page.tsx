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
            className="p-10 rounded-[2.5rem] bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Lightbulb className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black mb-4">Our Solution</h2>
                <p className="text-white/90 text-lg leading-relaxed mb-4">
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
                    <li key={feature} className="flex items-start gap-2">
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

      {/* Team Section */}
      <section className="px-6 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Meet the Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built with passion by developers committed to improving civic
              governance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TeamMember
              name="Arun Kumar"
              role="Full Stack Developer"
              bio="Passionate about using technology to solve real-world problems and improve civic engagement in India."
              links={{
                github: "https://github.com/arunkumar",
                linkedin: "https://linkedin.com/in/arunkumar",
                email: "arun@jansankalp.ai",
              }}
              index={0}
            />
            {/* Add more team members as needed */}
          </div>
        </div>
      </section>
    </main>
  );
}
