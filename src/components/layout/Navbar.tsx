"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Landmark, LogOut, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const NavItem = ({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      "px-4 py-2 rounded-full text-sm font-bold transition-all uppercase tracking-widest",
      active
        ? "bg-primary text-white shadow-lg shadow-primary/20"
        : "text-muted-foreground hover:text-primary hover:bg-primary/5",
    )}
  >
    {children}
  </Link>
);

export const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none",
      )}
    >
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          mass: 1,
        }}
        className={cn(
          "mt-6 mx-auto transition-all duration-700 pointer-events-auto",
          isScrolled ? "w-[90%] max-w-[800px]" : "w-[95%] max-w-[1400px]",
        )}
      >
        <motion.div
          layout
          className={cn(
            "relative flex items-center justify-between px-6 py-2 transition-all duration-500",
            isScrolled
              ? "bg-background/40 backdrop-blur-2xl saturate-[1.8] border border-white/20 dark:border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              : "bg-background/20 backdrop-blur-md border border-white/10 rounded-3xl",
          )}
        >
          {/* Inner Glow Border (Premium Hardware Look) */}
          {isScrolled && (
            <div className="absolute inset-0 rounded-full border border-primary/20 pointer-events-none -z-10 animate-pulse" />
          )}

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              layout
              className="w-10 h-10 md:w-14 md:h-14 bg-transparent rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform p-0.5 relative"
            >
              <Image
                src="/logojansanklp.png"
                alt="JanSankalp AI Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Nav - Dynamic Dock Appearance */}
          <div className="hidden md:flex items-center bg-foreground/5 dark:bg-white/5 rounded-full px-2 py-1 gap-1 border border-white/5">
            <NavItem href="/" active={pathname === "/"}>
              Home
            </NavItem>
            <NavItem href="/about" active={pathname === "/about"}>
              About
            </NavItem>
            <NavItem href="/features" active={pathname === "/features"}>
              Features
            </NavItem>
            <NavItem href="/how-it-works" active={pathname === "/how-it-works"}>
              How It Works
            </NavItem>
            {session && (
              <NavItem href="/dashboard" active={pathname === "/dashboard"}>
                Dashboard
              </NavItem>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <ThemeToggle />
              <div className="h-4 w-[1px] bg-foreground/10 mx-1" />
            </div>

            {session?.user ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest leading-none mb-0.5">
                    Live
                  </span>
                  <span className="text-xs font-bold truncate max-w-[80px]">
                    {session.user.name?.split(" ")[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full font-bold text-xs h-9 px-4 hovr:bg-primary/5"
                  asChild
                >
                  <Link href="/auth/signin">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-full font-bold text-xs h-9 px-5 shadow-lg shadow-primary/20 bg-primary hover:scale-105 transition-transform"
                  asChild
                >
                  <Link href="/auth/signup">Join</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9 rounded-full hover:bg-primary/10"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Mobile Menu - Aero Glass Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="md:hidden mt-4 bg-background/60 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-6 shadow-2xl pointer-events-auto"
            >
              <div className="flex flex-col gap-3">
                <Link
                  href="/"
                  className={cn(
                    "text-xl font-black uppercase tracking-tight p-3 rounded-2xl transition-colors",
                    pathname === "/"
                      ? "bg-primary text-white"
                      : "hover:bg-primary/5",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    "text-xl font-black uppercase tracking-tight p-3 rounded-2xl transition-colors",
                    pathname === "/about"
                      ? "bg-primary text-white"
                      : "hover:bg-primary/5",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/features"
                  className={cn(
                    "text-xl font-black uppercase tracking-tight p-3 rounded-2xl transition-colors",
                    pathname === "/features"
                      ? "bg-primary text-white"
                      : "hover:bg-primary/5",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/how-it-works"
                  className={cn(
                    "text-xl font-black uppercase tracking-tight p-3 rounded-2xl transition-colors",
                    pathname === "/how-it-works"
                      ? "bg-primary text-white"
                      : "hover:bg-primary/5",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  How It Works
                </Link>
                {session && (
                  <Link
                    href="/dashboard"
                    className={cn(
                      "text-xl font-black uppercase tracking-tight p-3 rounded-2xl transition-colors",
                      pathname === "/dashboard"
                        ? "bg-primary text-white"
                        : "hover:bg-primary/5",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}

                <div className="h-[1px] bg-foreground/10 w-full my-2" />

                {session?.user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-2xl">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-primary tracking-widest">
                          Authorized
                        </span>
                        <span className="text-base font-bold">
                          {session.user.name}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full rounded-xl font-bold py-5 h-auto text-base"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="w-5 h-5 mr-2" /> Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl font-bold py-5 h-auto text-lg border-2"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/auth/signin">Login</Link>
                    </Button>
                    <Button
                      className="w-full rounded-xl font-bold py-5 h-auto text-lg shadow-lg shadow-primary/20"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/auth/signup">Create Account</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
};
