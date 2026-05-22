"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const STORIES = [
  {
    name: "Rajesh Kumar",
    role: "Resident, New Delhi",
    story:
      "I reported a waste management issue at 10 AM, and by 4 PM the same day, a truck was here. The real-time tracking gave me peace of mind.",
    avatar: "RK",
    rating: 5,
  },
  {
    name: "Anjali Singh",
    role: "Daily Commuter",
    story:
      "Pothole reporting has never been easier. The AI knew exactly where I was, and the resolution update came directly to my phone.",
    avatar: "AS",
    rating: 5,
  },
  {
    name: "Dr. Samarth",
    role: "Healthcare Professional",
    story:
      "The transparency of the JanSankalp network is what India needs. Every action is logged and visible. True digital democracy!",
    avatar: "DS",
    rating: 5,
  },
];

export const ImpactStories = () => {
  return (
    <div className="w-full py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Voices of <span className="text-primary italic">JanSankalp</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
            Real impact measured through citizen trust and swift administrative
            response.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORIES.map((story, i) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[3rem] glass-card relative flex flex-col group hover:bg-card/80 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-secondary/50 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

              <Quote className="w-12 h-12 text-primary/5 absolute top-10 right-10 group-hover:text-primary/10 transition-colors" />

              <div className="flex gap-1.5 mb-8">
                {[...Array(story.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-lg font-bold leading-relaxed mb-8 flex-1">
                &ldquo;{story.story}&rdquo;
              </p>

              <div className="flex items-center gap-4 border-t border-border/50 pt-8 mt-auto">
                <div className="w-14 h-14 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">
                  {story.avatar}
                </div>
                <div>
                  <h4 className="font-black text-foreground text-lg tracking-tight">
                    {story.name}
                  </h4>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">
                    {story.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
