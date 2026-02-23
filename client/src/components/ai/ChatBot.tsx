"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! I am JanSankalp AI. How can I help you regarding civic issues or governance today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call our FastAPI backend
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          history: messages.filter(m => m.role !== "assistant" || m.content !== "Namaste! I am JanSankalp AI. How can I help you regarding civic issues or governance today?")
                     .map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response || data.message || "I'm here to help!",
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const err = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${err.error || "Failed to get response"}`,
          },
        ]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      // Fallback response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting to my AI services. I can still help you with basic information about filing complaints, tracking status, and our services. What would you like to know?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 flex items-center justify-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <MessageSquare className="w-8 h-8 text-white relative z-10" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className={cn(
              "w-[400px] shadow-2xl rounded-[2.5rem] overflow-hidden border-none ring-1 ring-slate-200 bg-white/80 backdrop-blur-xl transition-all duration-300",
              isMinimized ? "h-[80px]" : "h-[600px]",
            )}
          >
            <Card className="h-full border-none bg-transparent flex flex-col">
              <CardHeader className="p-4 bg-slate-900 text-white flex flex-row items-center justify-between space-y-0 rounded-t-[2.5rem]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest">
                      JanSankalp AI
                    </CardTitle>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Powered by Grok SDK
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl h-8 w-8"
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  <CardContent
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                    ref={scrollRef}
                  >
                    {messages.map((m, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-start gap-3 max-w-[85%]",
                          m.role === "user"
                            ? "ml-auto flex-row-reverse"
                            : "mr-auto",
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            m.role === "user"
                              ? "bg-primary/10 text-primary"
                              : "bg-slate-100 text-slate-600",
                          )}
                        >
                          {m.role === "user" ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div
                          className={cn(
                            "p-3 rounded-2xl text-sm font-medium leading-relaxed",
                            m.role === "user"
                              ? "bg-primary text-white rounded-tr-none shadow-md"
                              : "bg-white border text-slate-700 rounded-tl-none shadow-sm",
                          )}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        </div>
                        <div className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-dashed border-slate-200">
                          Grok is thinking...
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 bg-white border-t rounded-b-[2.5rem]">
                    <div className="w-full relative group">
                      <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg transition-opacity opacity-0 group-focus-within:opacity-100" />
                      <div className="relative flex gap-2">
                        <Textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          placeholder="Type your message..."
                          className="min-h-[50px] max-h-[120px] rounded-2xl border-2 focus-visible:ring-primary/20 bg-slate-50/50 resize-none py-3 text-sm"
                        />
                        <Button
                          onClick={handleSend}
                          disabled={isLoading || !input.trim()}
                          className="h-[50px] w-[50px] shrink-0 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg"
                        >
                          <Send className="w-5 h-5 text-white" />
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
