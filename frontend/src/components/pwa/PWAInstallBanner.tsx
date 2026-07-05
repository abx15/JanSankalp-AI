"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      // Don't show for 7 days after dismissal
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }

    // Detect iOS
    const ua = navigator.userAgent;
    const isIOSDevice = /iphone|ipad|ipod/i.test(ua);
    const isInStandaloneMode = ("standalone" in navigator) && (navigator as any).standalone;
    
    if (isIOSDevice && !isInStandaloneMode) {
      setIsIOS(true);
      // Show iOS install instructions after 3 seconds
      setTimeout(() => setShowBanner(true), 3000);
      return;
    }

    // Android / Desktop — listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after 4s delay
      setTimeout(() => setShowBanner(true), 4000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[9000] w-[calc(100%-32px)] max-w-md"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Gradient top line */}
            <div className="h-1 bg-gradient-to-r from-orange-500 via-indigo-500 to-emerald-500" />

            <div className="p-4 flex items-center gap-4">
              {/* App Icon */}
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-slate-800 border border-slate-700 shadow-inner flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="JanSankalp AI"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">
                  JanSankalp AI
                </p>
                {isIOS ? (
                  <p className="text-slate-400 text-xs leading-relaxed mt-0.5">
                    Tap <span className="inline-block mx-0.5">⎋</span> then{" "}
                    <strong className="text-slate-300">Add to Home Screen</strong>
                  </p>
                ) : (
                  <p className="text-slate-400 text-xs mt-0.5">
                    Install app for quick access and offline use
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {!isIOS && (
                  <button
                    onClick={handleInstall}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Install
                  </button>
                )}
                <button
                  onClick={handleDismiss}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* iOS indicator row */}
            {isIOS && (
              <div className="px-4 pb-3 flex items-center gap-2 text-slate-500 text-[11px]">
                <Smartphone className="w-3 h-3 shrink-0" />
                Safari -&gt; Share -&gt; Add to Home Screen
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
