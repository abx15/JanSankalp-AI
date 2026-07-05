"use client";

import React from "react";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { usePathname } from "next/navigation";
import { ChatBot } from "@/components/ai/ChatBot";
import { PWAInstallBanner } from "@/components/pwa/PWAInstallBanner";
import dynamic from "next/dynamic";



export default function ClientEntry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const pathname = usePathname();

  React.useEffect(() => {
    // Register PWA Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[PWA] Service Worker registered:", reg.scope);
          })
          .catch((err) => {
            console.error("[PWA] Service Worker registration failed:", err);
          });
      });
    }

    // Show splash only once per browser SESSION (not on every navigation)
    const hasSeenSplash = sessionStorage.getItem("jansankalp_splash_shown");
    if (hasSeenSplash) {
      setIsLoading(false);
    }
    // If not seen, the SplashScreen component handles the timeout + calls onFinish
  }, []);

  const handleFinish = () => {
    setIsLoading(false);
    sessionStorage.setItem("jansankalp_splash_shown", "true");
  };

  return (
    <>
      {isLoading && <SplashScreen onFinish={handleFinish} />}
      <div
        className={
          isLoading
            ? "opacity-0 pointer-events-none"
            : "opacity-100 transition-opacity duration-500"
        }
      >
        {children}
        <ChatBot />
        <PWAInstallBanner />
      </div>
    </>
  );
}
