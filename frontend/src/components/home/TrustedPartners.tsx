"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Landmark,
  LandmarkIcon,
  Building,
  Building2,
  Store,
} from "lucide-react";

const PARTNERS = [
  { name: "Nagpur Municipality", icon: Landmark },
  { name: "Pune Smart City", icon: Building },
  { name: "Lucknow Nagar Nigam", icon: Building2 },
  { name: "Indore Clean City", icon: LandmarkIcon },
  { name: "Bhopal Governance", icon: Store },
];

export const TrustedPartners = () => {
  return (
    <div className="w-full py-8 sm:py-12 md:py-16 border-y border-border bg-muted/5 relative overflow-hidden group">
      {/* Edge Blur Masks */}
      <div className="absolute inset-y-0 left-0 w-12 sm:w-16 md:w-20 lg:w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-16 md:w-20 lg:w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <p className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] text-center mb-6 sm:mb-8 md:mb-10 px-4">
          Trusted by leading municipalities & smart city networks
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-12 md:gap-x-16 lg:gap-x-20 gap-y-6 sm:gap-y-8 md:gap-y-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-in-out px-4">
          {PARTNERS.map((partner, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center gap-2 sm:gap-3 md:gap-4 cursor-default"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-muted flex items-center justify-center border border-border">
                <partner.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-foreground" />
              </div>
              <span className="font-black text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] tracking-tight uppercase hidden sm:block">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
