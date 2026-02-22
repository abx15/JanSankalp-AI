"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onFinish, 500); // Wait for exit animation to finish
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[80px] animate-pulse delay-75" />

          {/* Animated Particles/Streaks (Simple CSS implementation for performance) */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-[10%] left-[20%] w-1 h-20 bg-gradient-to-b from-transparent to-blue-400 opacity-50 rotate-45 animate-ping duration-&lsqb;3000ms&rsqb;" />
            <div className="absolute top-[60%] right-[20%] w-1 h-32 bg-gradient-to-b from-transparent to-orange-400 opacity-50 -rotate-12 animate-pulse duration-&lsqb;4000ms&rsqb;" />
            <div className="absolute bottom-[20%] left-[40%] w-2 h-2 bg-white rounded-full opacity-30 animate-bounce duration-&lsqb;5000ms&rsqb;" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1], // Custom bezier for premium feel
              }}
              className="relative mb-6"
            >
              {/* Logo Glow */}
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-110" />

              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src="/logo.png"
                  alt="JanSankalp AI Logo"
                  fill
                  sizes="(max-width: 768px) 128px, 160px"
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </motion.div>

            {/* Tagline Animation */}
            <motion.div
              className="text-center px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                JanSankalp <span className="text-blue-400">AI</span>
              </h1>
              <motion.p
                className="text-sm md:text-base text-gray-400 font-light tracking-wide max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 1 }}
              >
                Har Awaaz, Har Shehar – Smart Governance for a Smarter India
              </motion.p>
            </motion.div>
          </div>

          {/* Loading Bar / Progress Indicator (Subtle) */}
          <motion.div
            className="absolute bottom-10 left-0 right-0 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
