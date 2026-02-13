"use client";

import { useState, useEffect } from "react";
import {
  Send,
  Loader2,
  Landmark,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { VoiceRecorder } from "./VoiceRecorder";
import { ImageUpload } from "./ImageUpload";
import MapPickerWrapper from "./MapPickerWrapper";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";

const CATEGORIES = [
  { id: "pothole", label: "Pothole", icon: "🕳️" },
  { id: "garbage", label: "Garbage", icon: "🗑️" },
  { id: "water_leakage", label: "Water Leakage", icon: "💧" },
  { id: "streetlight", label: "Streetlight", icon: "💡" },
  { id: "road_damage", label: "Road Damage", icon: "🚧" },
  { id: "drainage", label: "Drain Blockage", icon: "🌊" },
];

export default function ComplaintForm() {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
    latitude: 0,
    longitude: 0,
    authorId: "",
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      setFormData((prev) => ({
        ...prev,
        authorId: session.user?.id as string,
      }));
    }
  }, [session]);

  const isAnalyzing =
    (step === 1 && formData.description.length > 10) ||
    (step === 2 && formData.imageUrl);

  const handleSubmit = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          title: formData.description.slice(0, 40) + "...",
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-t-4 border-t-primary overflow-hidden p-8 text-center transition-all">
        <CardContent className="space-y-6 pt-6">
          <motion.div
            className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Landmark className="w-10 h-10" />
          </motion.div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">
            Please Login to Report
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            To ensure all reports are verified and tracked for the{" "}
            <span className="text-primary font-bold">Reward System</span>, you
            must be signed in.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="px-8 rounded-full">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button variant="outline" asChild className="px-8 rounded-full">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="text-center py-12 px-6 shadow-2xl border-t-4 border-t-green-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Landmark className="w-32 h-32" />
          </div>
          <CardContent className="space-y-4 relative z-10">
            <motion.div
              className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ rotate: -45 }}
              animate={{ rotate: 0 }}
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter">
              Report Filed Successfully!
            </h2>
            <p className="text-muted-foreground text-lg">
              Our <span className="text-primary font-bold">AI Hub</span> is now
              routing your report to the local municipal terminal.
            </p>
            <div className="bg-muted p-4 rounded-2xl mt-6 border border-dashed border-primary/20">
              <p className="text-sm font-mono font-bold text-primary">
                TRACKING_ID: JS-
                {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
            <div className="pt-6 flex gap-3 justify-center">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => window.location.reload()}
              >
                Submit New Report
              </Button>
              <Button className="rounded-full" asChild>
                <Link href="/dashboard">View My Reports</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-t-4 border-t-primary overflow-hidden transition-all duration-500">
      <CardHeader className="bg-muted/30 pb-8 relative overflow-hidden">
        {/* Animated Background Micro-waves */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_1px,_transparent_1px)] bg-[size:20px_20px]"
          />
        </div>

        <div className="flex justify-between items-center mb-4 relative z-10">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
            <Landmark className="w-4 h-4" />
            <span>Gov Engine v1.0</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 w-8 rounded-full transition-all duration-500",
                  s === step
                    ? "bg-primary w-12"
                    : s < step
                      ? "bg-primary/40"
                      : "bg-muted-foreground/20",
                )}
              />
            ))}
          </div>
        </div>
        <CardTitle className="text-3xl font-black tracking-tighter relative z-10">
          {step === 1 && "ISSUE_DESCRIPTION"}
          {step === 2 && "EVIDENCE_HUB"}
          {step === 3 && "GEO_VECTORS"}
        </CardTitle>
        <CardDescription className="relative z-10 font-medium">
          {step === 1 &&
            "Talk to us in your local language. AI will handle the rest."}
          {step === 2 &&
            "Photos help our AI verify the severity score automatically."}
          {step === 3 && "Pinpointing the exact coordinate for rapid routing."}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-8 relative">
        {/* Smart Detection Indicator */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  AI Hub:{" "}
                  {step === 1
                    ? "Analyzing context..."
                    : "Scanning image for metadata..."}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground uppercase tracking-wider flex justify-between">
                  Issue Details <span>(ब्यौरा)</span>
                </label>
                <div className="relative group">
                  <Textarea
                    placeholder="E.g., Large pothole on the main road..."
                    className="min-h-[160px] text-lg p-6 rounded-3xl transition-all focus:ring-4 focus:ring-primary/10 border-2 resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <div className="absolute right-6 bottom-6 scale-125">
                    <VoiceRecorder
                      onTranscription={(text) =>
                        setFormData({ ...formData, description: text })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-2xl border border-dashed border-muted-foreground/20">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                    AI Tip: Speaking in Hindi? We'll translate it automatically.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground uppercase tracking-wider flex justify-between">
                  Category <span>(श्रेणी)</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setFormData({ ...formData, category: cat.id })
                      }
                      className={cn(
                        "p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 group",
                        formData.category === cat.id
                          ? "border-primary bg-primary/5 text-primary shadow-xl scale-[1.02]"
                          : "border-muted hover:border-primary/30 text-muted-foreground",
                      )}
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform">
                        {cat.icon}
                      </span>
                      <span className="text-[8px] uppercase font-black tracking-widest text-center h-4 flex items-center">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Visual Proof <span>(फोटो)</span>
                </label>
                <div className="rounded-3xl border-2 border-dashed border-primary/20 p-2">
                  <ImageUpload
                    value={formData.imageUrl}
                    onUpload={(url) =>
                      setFormData({ ...formData, imageUrl: url })
                    }
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                    Geo-Location <span>(स्थान)</span>
                  </label>
                  <span className="text-[10px] font-mono bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                    {formData.latitude.toFixed(6)},{" "}
                    {formData.longitude.toFixed(6)}
                  </span>
                </div>
                <div className="rounded-3xl border-4 border-primary/5 overflow-hidden shadow-inner">
                  <MapPickerWrapper
                    onLocationSelect={(lat, lng) =>
                      setFormData({
                        ...formData,
                        latitude: lat,
                        longitude: lng,
                      })
                    }
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="bg-muted/10 border-t p-6 flex justify-between items-center">
        {step > 1 ? (
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => setStep(step - 1)}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        ) : (
          <div />
        )}

        <Button
          className="gap-2 px-8 py-6 rounded-full font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all"
          disabled={
            loading ||
            (step === 1 && !formData.description) ||
            (step === 2 && !formData.category)
          }
          onClick={() => (step < 3 ? setStep(step + 1) : handleSubmit())}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : step === 3 ? (
            <>
              Submit Report <Send className="w-5 h-5" />
            </>
          ) : (
            <>
              Continue <ChevronRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
