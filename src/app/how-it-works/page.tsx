"use client";

import { motion } from "framer-motion";
import {
  Landmark,
  Mic,
  Languages,
  Brain,
  GitBranch,
  Send,
  UserCheck,
  Bell,
  CheckCircle,
  Shield,
  Lock,
  Database,
  Cloud,
} from "lucide-react";
import { StepCard } from "@/components/how-it-works/StepCard";
import { Footer } from "@/components/layout/Footer";

const PROCESS_STEPS = [
  {
    stepNumber: 1,
    icon: Mic,
    title: "Citizen Submits Complaint (शिकायत दर्ज करें)",
    description:
      "Citizens can submit complaints through voice or text input in any of 22+ Indian languages, from anywhere, anytime.",
    details: [
      "Use voice input in your native language (Hindi, Tamil, Bengali, etc.)",
      "Or type your complaint in English or regional languages",
      "Upload photos/videos as evidence",
      "Automatic location detection via GPS",
      "No need to visit government offices",
    ],
  },
  {
    stepNumber: 2,
    icon: Languages,
    title: "AI Processes & Translates",
    description:
      "Our multilingual AI engine processes the input, converts voice to text, and translates it into a standardized format.",
    details: [
      "Voice-to-text conversion with 95%+ accuracy",
      "Automatic language detection",
      "Translation to English for processing",
      "Preserves original complaint for reference",
      "Handles regional dialects and accents",
    ],
  },
  {
    stepNumber: 3,
    icon: Brain,
    title: "Smart Classification & Severity Scoring",
    description:
      "Advanced machine learning models classify the complaint into the correct category and assign a severity score.",
    details: [
      "AI categorizes into departments (Roads, Water, Electricity, etc.)",
      "Severity scoring: Low, Medium, High, Critical",
      "Context-aware classification using GPT-4",
      "Learns from historical data to improve accuracy",
      "99% classification accuracy",
    ],
  },
  {
    stepNumber: 4,
    icon: GitBranch,
    title: "Duplicate Detection",
    description:
      "Geo-spatial clustering identifies similar complaints in the same area to prevent redundant work.",
    details: [
      "Location-based similarity detection (within 500m radius)",
      "Semantic analysis to find related issues",
      "Automatic linking of duplicate reports",
      "Notifies citizen if similar complaint exists",
      "Reduces processing time by 60%",
    ],
  },
  {
    stepNumber: 5,
    icon: Send,
    title: "Auto-Routing to Department",
    description:
      "The complaint is instantly routed to the appropriate department based on category and location.",
    details: [
      "Instant routing to correct department",
      "Location-based department assignment",
      "Priority-based queue management",
      "Reduces manual triage time by 90%",
      "Real-time notification to department head",
    ],
  },
  {
    stepNumber: 6,
    icon: UserCheck,
    title: "Officer Assignment",
    description:
      "The system assigns the complaint to an available officer based on workload, expertise, and location.",
    details: [
      "Load balancing across officers",
      "Expertise-based assignment",
      "Location proximity consideration",
      "Officer receives mobile notification",
      "Automatic escalation if not acknowledged",
    ],
  },
  {
    stepNumber: 7,
    icon: Bell,
    title: "Real-time Tracking & Updates",
    description:
      "Citizens receive instant notifications at every stage via SMS, email, and in-app updates.",
    details: [
      "Status updates: Submitted → In Progress → Resolved",
      "SMS and email notifications",
      "Estimated resolution time",
      "Officer contact information",
      "Photo/video proof of resolution",
    ],
  },
  {
    stepNumber: 8,
    icon: CheckCircle,
    title: "Resolution & Feedback",
    description:
      "Once resolved, the officer uploads proof, and the citizen can provide feedback and close the complaint.",
    details: [
      "Officer uploads before/after photos",
      "Citizen receives resolution notification",
      "Feedback and rating system (1-5 stars)",
      "Complaint marked as resolved",
      "Data archived for analytics",
    ],
  },
];

const ARCHITECTURE_COMPONENTS = [
  {
    icon: Cloud,
    title: "Frontend Layer",
    desc: "Next.js 14 with React, TypeScript, and Tailwind CSS for a responsive, modern UI.",
  },
  {
    icon: Shield,
    title: "Authentication",
    desc: "NextAuth.js with role-based access control (Citizen, Officer, Admin).",
  },
  {
    icon: Database,
    title: "Database",
    desc: "PostgreSQL with Prisma ORM for efficient data management and relationships.",
  },
  {
    icon: Brain,
    title: "AI Engine",
    desc: "GPT-4 for NLP, custom models for classification, TensorFlow for clustering.",
  },
  {
    icon: Lock,
    title: "Security",
    desc: "End-to-end encryption, secure file uploads, audit logs, and GDPR compliance.",
  },
];

export default function HowItWorksPage() {
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
            How It Works
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 leading-tight"
          >
            From Your Voice to{" "}
            <span className="text-primary italic">Resolution</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            See how JanSankalp AI transforms your complaint into action in 8
            intelligent steps.
          </motion.p>
        </div>
      </section>

      {/* Process Flow */}
      <section className="px-6 mb-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              The Complete Process (पूरी प्रक्रिया)
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every complaint follows this automated, transparent workflow.
            </p>
          </div>

          <div className="space-y-0">
            {PROCESS_STEPS.map((step, i) => (
              <StepCard
                key={step.stepNumber}
                stepNumber={step.stepNumber}
                icon={step.icon}
                title={step.title}
                description={step.description}
                details={step.details}
                isLast={i === PROCESS_STEPS.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Technology Explained */}
      <section className="px-6 mb-32 bg-slate-950 text-white py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              The AI Technology Behind It
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Powered by state-of-the-art machine learning and natural language
              processing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* NLP Pipeline */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-slate-900 border border-slate-800"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                <Languages className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Multilingual NLP Pipeline
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Our natural language processing pipeline handles 22+ Indian
                languages with high accuracy.
              </p>
              <ul className="space-y-3">
                {[
                  "Speech-to-text using Google Cloud Speech API",
                  "Language detection with 99% accuracy",
                  "Translation using Google Translate API",
                  "Custom fine-tuned models for Indian languages",
                  "Context preservation across translations",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-400"
                  >
                    <span className="text-primary mt-1">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Classification Engine */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-slate-900 border border-slate-800"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Smart Classification Engine
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                GPT-4 powered classification with custom training on Indian
                civic issues.
              </p>
              <ul className="space-y-3">
                {[
                  "GPT-4 for context-aware categorization",
                  "Trained on 50,000+ Indian civic complaints",
                  "Multi-label classification support",
                  "Severity scoring algorithm",
                  "Continuous learning from feedback",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-400"
                  >
                    <span className="text-primary mt-1">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Geo-Spatial Clustering */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-slate-900 border border-slate-800"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                <GitBranch className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Geo-Spatial Clustering
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Advanced algorithms group similar complaints in the same area.
              </p>
              <ul className="space-y-3">
                {[
                  "DBSCAN clustering algorithm",
                  "500m radius for similarity detection",
                  "Semantic similarity using embeddings",
                  "Real-time duplicate detection",
                  "Automatic complaint linking",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-400"
                  >
                    <span className="text-primary mt-1">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Routing Algorithm */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-slate-900 border border-slate-800"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                <Send className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Intelligent Routing</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Smart assignment based on workload, expertise, and location.
              </p>
              <ul className="space-y-3">
                {[
                  "Load balancing across officers",
                  "Expertise-based assignment",
                  "Location proximity optimization",
                  "Priority queue management",
                  "Automatic escalation rules",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-400"
                  >
                    <span className="text-primary mt-1">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="px-6 mb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              System Architecture
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built on modern, scalable cloud infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {ARCHITECTURE_COMPONENTS.map((component, i) => (
              <motion.div
                key={component.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <component.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{component.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {component.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Architecture Diagram */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">
              Data Flow Architecture
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center">
              {[
                "Citizen Input",
                "AI Processing",
                "Classification",
                "Routing",
                "Officer Action",
                "Resolution",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/30">
                      {i + 1}
                    </div>
                    <p className="mt-3 font-semibold text-sm">{step}</p>
                  </div>
                  {i < 5 && (
                    <div className="hidden md:block text-primary text-2xl">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="px-6 mb-20 bg-muted/30 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Security & Privacy (सुरक्षा और गोपनीयता)
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your data is protected with enterprise-grade security measures.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Data Encryption",
                desc: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256).",
              },
              {
                title: "Role-Based Access",
                desc: "Strict permissions ensure users only access authorized data.",
              },
              {
                title: "Audit Logs",
                desc: "Every action is logged for transparency and accountability.",
              },
              {
                title: "GDPR Compliance",
                desc: "Full compliance with data protection regulations.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl bg-card border"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
