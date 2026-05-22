"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StepCardProps {
  stepNumber: number;
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
  isLast?: boolean;
}

export const StepCard = ({
  stepNumber,
  icon: Icon,
  title,
  description,
  details,
  isLast = false,
}: StepCardProps) => {
  return (
    <div className="relative">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: stepNumber * 0.1 }}
        className="flex gap-6 items-start"
      >
        {/* Step Number & Icon */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-primary/30">
            {stepNumber}
          </div>
          {!isLast && (
            <div className="w-1 h-24 bg-gradient-to-b from-primary to-primary/20 mt-4" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>

          <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
            {description}
          </p>

          <ul className="space-y-2">
            {details.map((detail, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-primary mt-1">→</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};
