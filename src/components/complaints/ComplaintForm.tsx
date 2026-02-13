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
      setFormData((prev) => ({ ...prev, authorId: session.user.id as string }));
    }
  }, [session]);

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
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-t-4 border-t-primary overflow-hidden p-8 text-center">
        <CardContent className="space-y-6 pt-6">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Landmark className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold">Please Login to Report</h2>
          <p className="text-muted-foreground">
            To ensure all reports are verified and tracked, you must be signed
            in to submit a complaint.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
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
        <Card className="text-center py-12 px-6 shadow-2xl border-t-4 border-t-green-500">
          <CardContent className="space-y-4">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Complaint Submitted!
            </h2>
            <p className="text-muted-foreground text-lg">
              Thank you for contributing to your city's governance. Our AI is
              analyzing your report for severity scoring.
            </p>
            <div className="bg-muted p-4 rounded-lg mt-6">
              <p className="text-sm font-medium">
                Tracking ID: #JS-
                {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
            <Button
              className="mt-8"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Submit Another Issue
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-t-4 border-t-primary overflow-hidden">
      <CardHeader className="bg-muted/30 pb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Landmark className="w-5 h-5" />
            <span>JanSankalp AI</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 w-8 rounded-full transition-all",
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
        <CardTitle className="text-2xl font-bold">
          {step === 1 && "Describe the Issue"}
          {step === 2 && "Visual Proof & Category"}
          {step === 3 && "Tag Location"}
        </CardTitle>
        <CardDescription>
          {step === 1 &&
            "The more detail you provide, the better our AI can categorize it."}
          {step === 2 &&
            "Attachments help officers verify and prioritize your report."}
          {step === 3 && "Pin the exact location for faster resolution."}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-8">
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
                <label className="text-sm font-semibold text-foreground">
                  What's the problem?
                </label>
                <div className="relative group">
                  <Textarea
                    placeholder="E.g., Major pothole on MG Road near the metro pillar..."
                    className="min-h-[160px] text-lg p-4 transition-all focus:ring-2 focus:ring-primary/20"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <div className="absolute right-4 bottom-4">
                    <VoiceRecorder
                      onTranscription={(text) =>
                        setFormData({ ...formData, description: text })
                      }
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Tip: You can speak in any language, our AI will automatically
                  detect and translate it.
                </p>
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
                <label className="text-sm font-semibold text-foreground">
                  Issue Category
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setFormData({ ...formData, category: cat.id })
                      }
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                        formData.category === cat.id
                          ? "border-primary bg-primary/5 text-primary shadow-md"
                          : "border-muted hover:border-primary/50 text-muted-foreground",
                      )}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Attached Photo
                </label>
                <ImageUpload
                  value={formData.imageUrl}
                  onUpload={(url) =>
                    setFormData({ ...formData, imageUrl: url })
                  }
                />
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
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-foreground text-primary flex items-center gap-1">
                    Mark the exact spot
                  </label>
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded italic">
                    {formData.latitude.toFixed(4)},{" "}
                    {formData.longitude.toFixed(4)}
                  </span>
                </div>
                <MapPickerWrapper
                  onLocationSelect={(lat, lng) =>
                    setFormData({ ...formData, latitude: lat, longitude: lng })
                  }
                />
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
