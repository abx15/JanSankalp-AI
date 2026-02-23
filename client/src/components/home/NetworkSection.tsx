"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Wifi, 
  Globe, 
  Server, 
  Users, 
  Shield, 
  Activity,
  MapPin,
  Zap,
  Clock,
  CheckCircle
} from "lucide-react";

const NETWORK_STATS = [
  {
    icon: <MapPin className="w-5 h-5" />,
    value: "28+",
    label: "States Covered",
    desc: "Active service across 28+ states in India",
  },
  {
    icon: <Users className="w-5 h-5" />,
    value: "5M+",
    label: "Citizens",
    desc: "Trusted and satisfied citizens using our platform",
  },
  {
    icon: <Server className="w-5 h-5" />,
    value: "150+",
    label: "Servers",
    desc: "High-performance data centers nationwide",
  },
  {
    icon: <Activity className="w-5 h-5" />,
    value: "99.9%",
    label: "Uptime",
    desc: "Year-round uninterrupted service availability",
  },
];

const NETWORK_FEATURES = [
  {
    icon: <Wifi className="w-6 h-6" />,
    title: "Pan-India Connectivity",
    desc: "From Kashmir to Kanyakumari, reaching every village and city in India.",
    color: "blue",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Military-Grade Security",
    desc: "Your data is secured with Indian government security standards.",
    color: "green",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Millisecond Response",
    desc: "Instant complaint processing with cutting-edge technology.",
    color: "orange",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "24/7 Monitoring",
    desc: "Continuous system health and performance monitoring around the clock.",
    color: "purple",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Auto Verification",
    desc: "AI-powered automatic complaint verification and validation.",
    color: "emerald",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multilingual Support",
    desc: "Complete support for 12+ Indian languages.",
    color: "indigo",
  },
];

const NETWORK_CITIES = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", 
  "Chennai", "Kolkata", "Pune", "Jaipur",
  "Lucknow", "Ahmedabad", "Surat", "Nagpur"
];

export function NetworkSection() {
  return (
    <section className="w-full py-32 px-4 md:px-10 lg:px-20 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[200px] rounded-full"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8"
          >
            <Server className="w-4 h-4" />
            Network Infrastructure
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
            India&apos;s Largest <br />
            <span className="text-gradient">Civic AI Network</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
            Connecting thousands of cities and millions of citizens with India&apos;s most reliable and fastest AI-powered complaint resolution network.
          </p>
        </motion.div>

        {/* Network Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {NETWORK_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 rounded-[2.5rem] bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card transition-all text-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 mx-auto relative z-10">
                {stat.icon}
              </div>
              <p className="text-4xl font-black text-foreground tracking-tighter mb-2 relative z-10">
                {stat.value}
              </p>
              <p className="text-sm font-bold text-foreground mb-2 relative z-10">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Network Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {NETWORK_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="p-8 rounded-[2rem] glass-card group hover:bg-card transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner relative z-10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black mb-4 text-foreground tracking-tight relative z-10">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-medium relative z-10">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Cities Network */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl md:text-3xl font-black mb-8">
            Active in Major Cities
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {NETWORK_CITIES.map((city, i) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.1, y: -4 }}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                {city}
              </motion.div>
            ))}
          </div>
          <p className="text-muted-foreground mt-8 font-medium">
            And expanding rapidly to 500+ more cities...
          </p>
        </motion.div>
      </div>
    </section>
  );
}
