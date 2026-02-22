"use client";

import { motion } from "framer-motion";
import { Mic, Cpu, UserCog, CheckCircle2, ArrowRight } from "lucide-react";

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
  delay: number;
}

const ProcessStep = ({
  icon,
  title,
  description,
  isLast,
  delay,
}: StepProps) => (
  <div className="relative flex flex-col items-center flex-1 w-full">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 200, delay }}
      className="z-10 w-20 h-20 rounded-3xl bg-card border-2 border-primary/20 flex items-center justify-center text-primary shadow-xl shadow-primary/5 shrink-0"
    >
      <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl" />
      {icon}
    </motion.div>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: delay + 0.2 }}
      className="text-center mt-6 z-10"
    >
      <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm max-w-[280px] md:max-w-[200px] mx-auto px-2 leading-relaxed">
        {description}
      </p>
    </motion.div>

    {!isLast && (
      <>
        {/* Horizontal Line (Desktop) */}
        <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-[2px]">
          <div className="absolute inset-0 bg-muted-foreground/10" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + 0.5 }}
            className="absolute inset-0 bg-primary origin-left"
          />
          <motion.div
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary/20 rounded-full blur-sm"
          />
        </div>

        {/* Vertical Line (Mobile) */}
        <div className="lg:hidden absolute top-20 left-1/2 -translate-x-1/2 w-[2px] h-12 flex flex-col items-center">
          <div className="flex-1 w-full bg-muted-foreground/10" />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + 0.5 }}
            className="absolute inset-0 bg-primary origin-top"
          />
        </div>
      </>
    )}
  </div>
);

export const ProcessFlow = () => {
  const steps = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Citzen Report",
      description: "Submit issues via voice or text in any local language.",
      delay: 0,
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "AI Analysis",
      description:
        "Our AI translates, categorizes, and ranks urgency instantly.",
      delay: 0.3,
    },
    {
      icon: <UserCog className="w-8 h-8" />,
      title: "Officer Action",
      description: "Route to the right department for investigation.",
      delay: 0.6,
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: "Issue Resolved",
      description: "Citizen receives a live update and proof of resolution.",
      delay: 0.9,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-0 justify-between items-start">
        {steps.map((step, index) => (
          <ProcessStep
            key={index}
            {...step}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
