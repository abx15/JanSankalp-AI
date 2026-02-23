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
    <div className="w-full py-16 border-y border-border bg-muted/5 relative overflow-hidden group">
      {/* Edge Blur Masks */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.4em] text-center mb-10">
          Trusted by leading municipalities & smart city networks
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-in-out">
          {PARTNERS.map((partner, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center gap-4 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                <partner.icon className="w-5 h-5 text-foreground" />
              </div>
              <span className="font-black text-[13px] tracking-tight uppercase">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
