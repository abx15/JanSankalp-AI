"use client";

import React from "react";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { usePathname } from "next/navigation";

import { ChatBot } from "@/components/ai/ChatBot";

export default function ClientEntry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const pathname = usePathname();

  React.useEffect(() => {
    // Check if splash screen was already shown in this session
    // Or if user prefers not to see it (optional logic)
    // For now, we show it on every full reload or initial visit
    // To make it show ONLY once per user lifetime/session, uncomment below:
    /*
    const hasSeenSplash = sessionStorage.getItem("janSankalp_hasSeenSplash");
    if (hasSeenSplash) {
      setIsLoading(false);
    }
    */
  }, []);

  const handleFinish = () => {
    setIsLoading(false);
    // sessionStorage.setItem("janSankalp_hasSeenSplash", "true");
  };

  return (
    <>
      {isLoading && <SplashScreen onFinish={handleFinish} />}
      <div
        className={
          isLoading
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-700"
        }
      >
        {children}
        <ChatBot />
      </div>
    </>
  );
}
