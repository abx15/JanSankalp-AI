"use client";

import { motion } from "framer-motion";
import {
  Landmark,
  Globe,
  Shield,
  Zap,
  Brain,
  Users,
  BarChart3,
  Lock,
  Bell,
  MapPin,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { FeatureCard } from "@/components/features/FeatureCard";
import { Footer } from "@/components/layout/Footer";

const FEATURES = [
  {
    icon: Globe,
    title: "Multilingual Voice AI",
    description:
      "Speak or type in any of 22+ Indian languages. Our AI understands, translates, and processes your complaint instantly, breaking down language barriers.",
    benefits: [
      "Support for Hindi, English, Tamil, Telugu, Bengali, Marathi, and 16+ more languages",
      "Voice-to-text conversion with 95%+ accuracy",
      "Automatic translation for cross-language communication",
      "Real-time language detection",
    ],
    color: "blue" as const,
  },
  {
    icon: Brain,
    title: "Smart AI Classification",
    description:
      "Advanced machine learning algorithms automatically categorize complaints into the right departments (Roads, Water, Electricity, etc.) with high accuracy.",
    benefits: [
      "99% classification accuracy using GPT-4",
      "Automatic severity scoring (Low, Medium, High, Critical)",
      "Context-aware categorization",
      "Learns from historical data to improve over time",
    ],
    color: "purple" as const,
  },
  {
    icon: Shield,
    title: "Duplicate Detection",
    description:
      "AI-powered geo-spatial clustering identifies similar complaints in the same area, preventing redundant work and grouping related issues.",
    benefits: [
      "Location-based similarity detection",
      "Semantic analysis to find related complaints",
      "Automatic linking of duplicate reports",
      "Reduces processing time by 60%",
    ],
    color: "green" as const,
  },
  {
    icon: Zap,
    title: "Auto-Routing System",
    description:
      "Complaints are automatically routed to the appropriate department and assigned to available officers based on workload and expertise.",
    benefits: [
      "Instant routing to correct department",
      "Load balancing across officers",
      "Priority-based assignment",
      "Reduces manual triage time by 90%",
    ],
    color: "orange" as const,
  },
  {
    icon: Bell,
    title: "Real-time Tracking",
    description:
      "Track your complaint status in real-time with instant notifications via SMS, email, and in-app updates at every stage of resolution.",
    benefits: [
      "Live status updates (Submitted, In Progress, Resolved)",
      "SMS and email notifications",
      "Estimated resolution time",
      "Photo/video evidence upload by officers",
    ],
    color: "indigo" as const,
  },
  {
    icon: MapPin,
    title: "Geo-Spatial Analytics",
    description:
      "Interactive maps show complaint hotspots, helping administrators identify problem areas and allocate resources effectively.",
    benefits: [
      "Heat maps of complaint density",
      "Area-wise issue categorization",
      "Trend analysis over time",
      "Resource optimization insights",
    ],
    color: "red" as const,
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Comprehensive dashboards for officers and admins with real-time metrics, performance tracking, and actionable insights.",
    benefits: [
      "Real-time complaint statistics",
      "Officer performance metrics",
      "Resolution time analytics",
      "Department-wise breakdown",
    ],
    color: "blue" as const,
  },
  {
    icon: Lock,
    title: "Role-Based Access Control",
    description:
      "Secure, role-based permissions ensure citizens, officers, and administrators only see and do what they're authorized to.",
    benefits: [
      "Citizen, Officer, and Admin roles",
      "Department-specific access",
      "Audit logs for all actions",
      "Secure authentication with NextAuth",
    ],
    color: "green" as const,
  },
  {
    icon: FileText,
    title: "Document Management",
    description:
      "Upload photos, videos, and documents as evidence. All files are securely stored and accessible throughout the complaint lifecycle.",
    benefits: [
      "Support for images, videos, PDFs",
      "Automatic compression and optimization",
      "Secure cloud storage",
      "Easy access for officers and citizens",
    ],
    color: "purple" as const,
  },
];

const USE_CASES = [
  {
    title: "Pothole on Main Road",
    scenario:
      "A citizen reports a dangerous pothole using voice input in Hindi. The AI translates, classifies it as 'Roads - High Priority', checks for duplicates, and routes it to the Roads Department. The officer receives it within seconds and resolves it in 18 hours.",
    icon: "🛣️",
  },
  {
    title: "Water Supply Issue",
    scenario:
      "Multiple citizens report water shortage in the same locality. The duplicate detection system groups these complaints, and the Water Department is notified of a widespread issue requiring immediate attention.",
    icon: "💧",
  },
  {
    title: "Street Light Malfunction",
    scenario:
      "A citizen uploads a photo of a broken street light at night. The AI classifies it as 'Electricity - Medium Priority', assigns it to an available electrician, and the citizen receives real-time updates until resolution.",
    icon: "💡",
  },
];

const BENEFITS_BY_USER = [
  {
    role: "Citizens (नागरिक)",
    benefits: [
      "File complaints in your native language",
      "Track status in real-time",
      "Get SMS/email notifications",
      "See proof of resolution",
      "No need to visit government offices",
    ],
    icon: Users,
    color: "blue",
  },
  {
    role: "Officers (अधिकारी)",
    benefits: [
      "Auto-assigned complaints based on expertise",
      "Mobile-friendly interface",
      "Upload resolution photos/videos",
      "Performance tracking dashboard",
      "Reduced manual paperwork",
    ],
    icon: Shield,
    color: "green",
  },
  {
    role: "Administrators (प्रशासक)",
    benefits: [
      "Real-time analytics and insights",
      "Identify problem areas with heat maps",
      "Monitor officer performance",
      "Data-driven resource allocation",
      "Transparent governance metrics",
    ],
    icon: BarChart3,
    color: "purple",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-16 sm:pb-18 md:pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="px-3 sm:px-4 md:px-6 lg:px-8 mb-16 sm:mb-20 md:mb-24 lg:mb-32">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold mb-4 sm:mb-6"
          >
            <Landmark className="w-4 h-4" />
            Platform Features
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 leading-tight"
          >
            Powerful Features for{" "}
            <span className="text-primary italic">Smart Governance</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-full sm:max-w-3xl mx-auto leading-relaxed"
          >
            AI-powered tools that make civic engagement faster, smarter, and
            more accessible for everyone.
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-3 sm:px-4 md:px-6 lg:px-8 mb-16 sm:mb-20 md:mb-24 lg:mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {FEATURES.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                benefits={feature.benefits}
                color={feature.color}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-3 sm:px-4 md:px-6 lg:px-8 mb-16 sm:mb-20 md:mb-24 lg:mb-32 bg-muted/30 py-16 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6">
              Real-World Use Cases
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-full sm:max-w-3xl mx-auto">
              See how JanSankalp AI transforms civic engagement in everyday
              scenarios.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {USE_CASES.map((useCase, i) => (
              <motion.div
                key={useCase.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-card border hover:border-primary/30 transition-all shadow-xl"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">{useCase.icon}</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">{useCase.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {useCase.scenario}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits by User Type */}
      <section className="px-3 sm:px-4 md:px-6 lg:px-8 mb-16 sm:mb-20 md:mb-24 lg:mb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6">
              Benefits for Everyone
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-full sm:max-w-3xl mx-auto">
              Designed to serve citizens, officers, and administrators equally.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {BENEFITS_BY_USER.map((userType, i) => (
              <motion.div
                key={userType.role}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-card border-2 border-primary/20 shadow-xl"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 sm:mb-6">
                  <userType.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">{userType.role}</h3>
                <ul className="space-y-3">
                  {userType.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="px-3 sm:px-4 md:px-6 lg:px-8 mb-16 sm:mb-18 md:mb-20 bg-slate-950 text-white py-16 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6">
              Before vs After JanSankalp AI
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-full sm:max-w-3xl mx-auto">
              The transformation in civic complaint resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Before */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-slate-900 border border-red-500/30"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-red-400">
                ✗ Before (Traditional System)
              </h3>
              <ul className="space-y-4">
                {[
                  "Visit government office in person",
                  "Fill paper forms in English only",
                  "No tracking or status updates",
                  "Manual routing takes days",
                  "Complaints get lost in bureaucracy",
                  "Average resolution: 2-4 weeks",
                  "Zero transparency",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-slate-400"
                  >
                    <span className="text-red-400 mt-1">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 border border-green-400/30"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-white">
                ✓ After (JanSankalp AI)
              </h3>
              <ul className="space-y-4">
                {[
                  "Report from anywhere, anytime",
                  "Use voice or text in any language",
                  "Real-time tracking with notifications",
                  "Instant AI-powered routing",
                  "Transparent, auditable process",
                  "Average resolution: 24 hours",
                  "Full visibility and accountability",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-white/90"
                  >
                    <span className="text-white mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
