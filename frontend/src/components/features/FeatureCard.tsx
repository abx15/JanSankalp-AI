"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  color?: "blue" | "green" | "orange" | "purple" | "red" | "indigo";
  index?: number;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  benefits,
  color = "blue",
  index = 0,
}: FeatureCardProps) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 dark:bg-blue-950 dark:text-blue-400 dark:group-hover:bg-blue-600",
    green:
      "bg-green-100 text-green-600 group-hover:bg-green-600 dark:bg-green-950 dark:text-green-400 dark:group-hover:bg-green-600",
    orange:
      "bg-orange-100 text-orange-600 group-hover:bg-orange-600 dark:bg-orange-950 dark:text-orange-400 dark:group-hover:bg-orange-600",
    purple:
      "bg-purple-100 text-purple-600 group-hover:bg-purple-600 dark:bg-purple-950 dark:text-purple-400 dark:group-hover:bg-purple-600",
    red: "bg-red-100 text-red-600 group-hover:bg-red-600 dark:bg-red-950 dark:text-red-400 dark:group-hover:bg-red-600",
    indigo:
      "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 dark:group-hover:bg-indigo-600",
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative p-8 rounded-[2rem] bg-card border hover:border-primary/30 transition-all shadow-xl shadow-primary/5"
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all ${colorClasses[color]} group-hover:text-white`}
      >
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-bold mb-3">{title}</h3>

      <p className="text-muted-foreground leading-relaxed mb-6">
        {description}
      </p>

      <div className="space-y-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">
          Key Benefits
        </h4>
        <ul className="space-y-2">
          {benefits.map((benefit, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="text-primary mt-1">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};
