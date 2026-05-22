"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "How does the AI understand different languages?",
    a: "Our platform uses advanced NLP models trained on regional Indian dialects, allowing you to report issues via text or voice in your preferred language.",
  },
  {
    q: "Can I track my complaint in real-time?",
    a: "Yes! Every complaint is assigned a unique ID. You can track its progress from 'Registered' to 'Resolved' directly on your dashboard.",
  },
  {
    q: "What happens if a redundant complaint is filed?",
    a: "Our AI-driven triage system identifies duplicates instantly and merges them into a single parent ticket, ensuring the officer isn't overwhelmed.",
  },
  {
    q: "Is my personal data secure on JanSankalp?",
    a: "We use enterprise-grade encryption and strictly follow data privacy protocols to ensure your information is only accessible by verified officials.",
  },
];

export const HomeFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full py-32 px-6 bg-muted/20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-black tracking-tight">
              Common <br />
              Questions
            </h2>
            <p className="text-muted-foreground font-medium">
              Everything you need to know about navigating the JanSankalp
              digital ecosystem.
            </p>
          </div>

          <div className="flex-1 space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                  openIndex === i
                    ? "glass-card border-primary/30"
                    : "bg-transparent border-border hover:border-primary/10"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-10 py-8 flex items-center justify-between text-left"
                >
                  <span
                    className={`font-black text-xl tracking-tight transition-colors ${openIndex === i ? "text-primary" : "text-foreground"}`}
                  >
                    {faq.q}
                  </span>
                  {openIndex === i ? (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                      <Minus className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                  )}
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-10 pb-10 text-muted-foreground text-lg font-semibold leading-relaxed max-w-2xl italic">
                        &ldquo;{faq.a}&rdquo;
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
