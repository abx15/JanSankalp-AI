"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SheetProps {
  children: React.ReactNode;
}

const SheetContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function Sheet({ children }: SheetProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const context = React.useContext(SheetContext);
  if (!context) return null;

  return React.cloneElement(children as React.ReactElement, {
    onClick: () => context.setOpen(true),
  });
}

export function SheetContent({
  className,
  children,
  side = "right",
}: {
  className?: string;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}) {
  const context = React.useContext(SheetContext);
  if (!context) return null;

  const variants = {
    left: { x: "-100%" },
    right: { x: "100%" },
    top: { y: "-100%" },
    bottom: { y: "100%" },
  };

  const sideClasses = {
    left: "left-0 inset-y-0 h-full w-full max-w-sm border-r",
    right: "right-0 inset-y-0 h-full w-full max-w-sm border-l",
    top: "top-0 inset-x-0 w-full h-auto border-b",
    bottom: "bottom-0 inset-x-0 w-full h-auto border-t",
  };

  return (
    <AnimatePresence>
      {context.open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => context.setOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={variants[side]}
            animate={{ x: 0, y: 0 }}
            exit={variants[side]}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed z-50 bg-background p-6 shadow-2xl outline-none sm:max-w-md",
              sideClasses[side],
              className,
            )}
          >
            <button
              onClick={() => context.setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function SheetHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SheetTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className={cn("text-lg font-semibold text-foreground", className)}>
      {children}
    </h2>
  );
}
