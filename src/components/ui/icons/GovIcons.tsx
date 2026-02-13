import React from "react";
import { motion } from "framer-motion";

export const AIAnimatedIcon = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-24 h-24"
  >
    <motion.circle
      cx="50"
      cy="50"
      r="40"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.path
      d="M30 50L45 65L70 35"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: 1,
      }}
    />
    <motion.circle
      cx="50"
      cy="50"
      r="20"
      fill="currentColor"
      fillOpacity="0.1"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);

export const GovWaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden -z-10 opacity-20">
    <svg
      viewBox="0 0 1440 320"
      className="absolute bottom-0 w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        fill="currentColor"
        animate={{
          d: [
            "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            "M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,213.3C672,213,768,171,864,144C960,117,1056,107,1152,128C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  </div>
);

export const FloatingParticle = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-2 h-2 bg-primary/20 rounded-full"
    animate={{
      y: [0, -100, 0],
      x: [0, 20, -20, 0],
      opacity: [1, 0.5, 1],
    }}
    transition={{
      duration: 5 + Math.random() * 5,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
  />
);
