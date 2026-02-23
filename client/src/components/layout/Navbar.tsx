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
      "px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-widest",
      active
        ? "text-white bg-civic-primary/20"
        : "text-white/80 hover:text-white hover:bg-white/10",
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b",
        isScrolled
          ? "bg-civic-primary/95 backdrop-blur-md py-3 border-white/10 shadow-lg"
          : "bg-civic-primary py-5 border-transparent",
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="JanSankalp AI Logo"
              fill
              sizes="(max-width: 768px) 40px, 48px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-black text-white leading-none tracking-tight">
              JanSankalp <span className="text-civic-accent italic">AI</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-civic-accent/80">
              Civic Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
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
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <div className="h-6 w-[1px] bg-white/20 mx-1" />
          </div>

          {session?.user ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-civic-accent tracking-widest leading-none mb-0.5">
                  Authorized
                </span>
                <span className="text-xs font-bold text-white">
                  {session.user.name?.split(" ")[0]}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg font-bold text-xs h-10 px-4 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/auth/signin">Login</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-lg font-bold text-xs h-10 px-6 bg-civic-accent hover:bg-civic-accent/90 text-white shadow-lg shadow-civic-accent/20 transition-all active:scale-95"
                asChild
              >
                <Link href="/auth/signup">Join Now</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-10 h-10 rounded-xl bg-white/5 text-white border border-white/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-civic-primary border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-4">
              <Link
                href="/"
                className={cn(
                  "text-lg font-bold uppercase tracking-tight p-3 rounded-lg",
                  pathname === "/" ? "bg-white/10 text-white" : "text-white/70",
                )}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={cn(
                  "text-lg font-bold uppercase tracking-tight p-3 rounded-lg",
                  pathname === "/about"
                    ? "bg-white/10 text-white"
                    : "text-white/70",
                )}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/features"
                className={cn(
                  "text-lg font-bold uppercase tracking-tight p-3 rounded-lg",
                  pathname === "/features"
                    ? "bg-white/10 text-white"
                    : "text-white/70",
                )}
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/how-it-works"
                className={cn(
                  "text-lg font-bold uppercase tracking-tight p-3 rounded-lg",
                  pathname === "/how-it-works"
                    ? "bg-white/10 text-white"
                    : "text-white/70",
                )}
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-lg font-bold uppercase tracking-tight p-3 rounded-lg",
                    pathname === "/dashboard"
                      ? "bg-white/10 text-white"
                      : "text-white/70",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              <div className="h-[1px] bg-white/10 my-2" />

              {session?.user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-10 h-10 bg-civic-accent rounded-lg flex items-center justify-center text-white">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-civic-accent tracking-widest">
                        Resident Account
                      </span>
                      <span className="text-base font-bold text-white">
                        {session.user.name}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full rounded-xl font-bold py-4 h-auto text-sm bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl font-bold py-4 h-auto text-base border-white/20 text-white bg-white/5 hover:bg-white/10"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/auth/signin">Login</Link>
                  </Button>
                  <Button
                    className="w-full rounded-xl font-bold py-4 h-auto text-base bg-civic-accent hover:bg-civic-accent/90 text-white shadow-xl shadow-civic-accent/20"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/auth/signup">Join JanSankalp</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
