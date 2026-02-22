"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Mic,
  X,
  MessageSquare,
  Sparkles,
  User,
  Brain,
  ChevronDown,
  Volume2,
  Minimize2,
  Maximize2,
  Smile,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "assistant" | "user";
  text: string;
  timestamp: string;
  sentiment?: string;
  actions?: string[];
}

export const AIAssistant = ({
  role = "CITIZEN",
}: {
  role?: "CITIZEN" | "OFFICER";
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text:
        role === "CITIZEN"
          ? "Hello! I am JanSahayak, your official AI Assistant. How can I help you today?"
          : "Greetings Officer. GovInsight ready. Awaiting analysis request.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      role: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/admin/governance?type=assistant-chat", {
        method: "POST",
        body: JSON.stringify({ message: input, role }),
      });

      const data = await res.json();
      const botMsg: Message = {
        role: "assistant",
        text: data.data.text,
        timestamp: new Date(data.data.timestamp).toLocaleTimeString(),
        sentiment: data.data.sentiment,
        actions: data.data.suggested_actions,
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 800);
    } catch (e) {
      console.error(e);
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
        <Bot className="w-8 h-8 text-white relative z-10" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-8 right-8 w-[400px] flex flex-col transition-all duration-300 shadow-2xl overflow-hidden rounded-[2rem] border-none ring-1 ring-slate-100 z-50 ${isMinimized ? "h-20" : "h-[600px] bg-white"}`}
    >
      {/* Header */}
      <div
        className={`p-5 flex items-center justify-between ${role === "CITIZEN" ? "bg-primary" : "bg-slate-900"} text-white`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-sm tracking-tight">
              {role === "CITIZEN" ? "JanSahayak" : "GovInsight AI"}
            </h4>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-none">
                Autonomous
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-xl"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Container */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-4 rounded-[1.5rem] shadow-sm text-sm font-medium leading-relaxed ${
                      msg.role === "user"
                        ? role === "CITIZEN"
                          ? "bg-primary text-white"
                          : "bg-slate-800 text-white"
                        : "bg-white border border-slate-100 text-slate-800"
                    }`}
                  >
                    {msg.text}
                    {msg.sentiment === "FRUSTRATED" && (
                      <div className="mt-2 text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-black w-fit">
                        ESCALATION MODE ENABLED
                      </div>
                    )}
                  </div>

                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.actions.map((action, ai) => (
                        <button
                          key={ai}
                          className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                          onClick={() => {
                            setInput(action);
                            handleSend();
                          }}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="p-4 rounded-[1.5rem] bg-white border border-slate-100 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="relative group">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Talk to AI Assistant..."
                className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-5 pr-24 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 bg-primary text-white rounded-xl disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
