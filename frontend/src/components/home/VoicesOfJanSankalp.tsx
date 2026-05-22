"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, Users, Heart } from "lucide-react";

const VOICES_DATA = [
  {
    name: "Priya Sharma",
    role: "Citizen, Delhi",
    content: "Sovereign Intelligence transformed how I interact with local governance. My water complaint was resolved in 48 hours instead of weeks!",
    rating: 5,
    avatar: "👩‍💼",
    category: "Fast Resolution"
  },
  {
    name: "Rajesh Kumar",
    role: "Small Business Owner, Mumbai",
    content: "The multilingual support is incredible. I could file complaints in Hindi and track everything easily. This is true Digital India!",
    rating: 5,
    avatar: "👨‍💼",
    category: "User Friendly"
  },
  {
    name: "Anita Desai",
    role: "Senior Citizen, Bangalore",
    content: "At 65, I thought technology was complicated. But Sovereign Intelligence made it so simple. The voice support is a blessing.",
    rating: 5,
    avatar: "👵",
    category: "Accessibility"
  },
  {
    name: "Vikram Singh",
    role: "Officer, Pune Municipal Corp",
    content: "As a government officer, this platform has made our work 10x more efficient. Real-time tracking and AI triage are game-changers.",
    rating: 5,
    avatar: "👮",
    category: "Government Partner"
  },
  {
    name: "Meera Patel",
    role: "Teacher, Ahmedabad",
    content: "My students and I filed a complaint about broken street lights. The response was immediate. Our community feels safer now.",
    rating: 5,
    avatar: "👩‍🏫",
    category: "Community Impact"
  },
  {
    name: "Arjun Reddy",
    role: "Student, Hyderabad",
    content: "The transparency is amazing. I could see exactly when my complaint was received, assigned, and resolved. No more black boxes!",
    rating: 5,
    avatar: "👨‍🎓",
    category: "Transparency"
  }
];

const CATEGORIES = ["All", "Fast Resolution", "User Friendly", "Accessibility", "Government Partner", "Community Impact", "Transparency"];

export function VoicesOfJanSankalp() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  
  const filteredVoices = selectedCategory === "All" 
    ? VOICES_DATA 
    : VOICES_DATA.filter(voice => voice.category === selectedCategory);

  return (
    <section className="w-full py-32 px-4 md:px-10 lg:px-20 bg-gradient-to-b from-background via-muted/5 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[200px] rounded-full"
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
            <Users className="w-4 h-4" />
            Voices of JanSankalp AI
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
            Real Stories, <br />
            <span className="text-gradient">Real Impact</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium mb-12">
            Hear from millions of Indians whose lives have been transformed by JanSankalp AI&apos;s 
            revolutionary civic complaint resolution system.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-2">5M+</div>
              <div className="text-sm font-semibold text-muted-foreground">Happy Citizens</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-2">98%</div>
              <div className="text-sm font-semibold text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-2">24h</div>
              <div className="text-sm font-semibold text-muted-foreground">Avg Resolution</div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Voices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredVoices.map((voice, i) => (
            <motion.div
              key={voice.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="p-8 rounded-[2.5rem] bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card transition-all duration-500 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
              
              {/* Header */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{voice.avatar}</div>
                  <div>
                    <h4 className="font-bold text-foreground">{voice.name}</h4>
                    <p className="text-sm text-muted-foreground">{voice.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(voice.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground leading-relaxed font-medium mb-6">
                  {voice.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary/60 bg-primary/10 px-3 py-1 rounded-full">
                    {voice.category}
                  </span>
                  <Heart className="w-4 h-4 text-red-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-black mb-4">
              Join the Movement
            </h3>
            <p className="text-muted-foreground font-medium mb-8 max-w-2xl mx-auto">
              Be part of India&apos;s largest civic transformation. Your voice matters, and together we&apos;re building a better tomorrow.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors">
                Share Your Story
              </button>
              <button className="px-8 py-3 bg-background border border-border rounded-full font-semibold hover:bg-muted transition-colors">
                Read More Stories
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
