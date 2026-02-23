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
      "px-4 py-2 rounded-xl text-sm font-semibold transition-all transition-colors duration-200",
      active
        ? "text-primary bg-primary/10 shadow-sm"
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b backdrop-blur-md",
        isScrolled
          ? "bg-white/90 py-3 border-border shadow-soft"
          : "bg-background/80 py-5 border-transparent",
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-9 h-9 md:w-10 md:h-10 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="JanSankalp AI Logo"
              fill
              sizes="(max-width: 768px) 36px, 40px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold text-foreground leading-tight tracking-tight">
              JanSankalp <span className="text-primary italic">AI</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
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
                <span className="text-[10px] font-bold uppercase text-primary tracking-widest leading-none mb-0.5">
                  Authorized
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {session.user.name?.split(" ")[0]}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground border border-border"
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
                className="rounded-xl font-semibold text-xs h-9 px-4 text-muted-foreground hover:text-primary hover:bg-primary/5"
                asChild
              >
                <Link href="/auth/signin">Login</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-xl font-semibold text-xs h-9 px-6 bg-primary hover:bg-primary/90 text-white shadow-soft transition-all active:scale-95"
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
            className="md:hidden w-9 h-9 rounded-xl bg-muted/50 text-muted-foreground border border-border"
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
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-4">
              <Link
                href="/"
                className={cn(
                  "text-base font-semibold tracking-tight p-3 rounded-xl transition-colors",
                  pathname === "/"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/5",
                )}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={cn(
                  "text-base font-semibold tracking-tight p-3 rounded-xl transition-colors",
                  pathname === "/about"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/5",
                )}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/features"
                className={cn(
                  "text-base font-semibold tracking-tight p-3 rounded-xl transition-colors",
                  pathname === "/features"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/5",
                )}
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/how-it-works"
                className={cn(
                  "text-base font-semibold tracking-tight p-3 rounded-xl transition-colors",
                  pathname === "/how-it-works"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/5",
                )}
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-base font-semibold tracking-tight p-3 rounded-xl transition-colors",
                    pathname === "/dashboard"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/5",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              <div className="h-[1px] bg-border my-2" />

              {session?.user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-2xl border border-border">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase text-primary tracking-widest leading-none mb-0.5">
                        Resident Account
                      </span>
                      <span className="text-base font-semibold text-foreground">
                        {session.user.name}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full rounded-xl font-semibold py-4 h-auto text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl font-semibold py-4 h-auto text-base border-border bg-background hover:bg-muted text-foreground transition-colors"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/auth/signin">Login</Link>
                  </Button>
                  <Button
                    className="w-full rounded-2xl font-semibold py-4 h-auto text-base bg-primary hover:bg-primary/90 text-white shadow-soft transition-all"
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
