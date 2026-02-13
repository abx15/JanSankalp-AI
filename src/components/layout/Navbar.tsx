"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Landmark, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-background/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2rem] px-6 py-3 shadow-2xl shadow-black/5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase hidden sm:block">
              JanSankalp <span className="text-primary italic">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <NavItem href="/" active={pathname === "/"}>
              Home
            </NavItem>
            {session && (
              <NavItem href="/dashboard" active={pathname === "/dashboard"}>
                Dashboard
              </NavItem>
            )}
            <div className="h-6 w-[1px] bg-muted mx-2" />
            <ThemeToggle />
            {session ? (
              <div className="flex items-center gap-4 ml-2">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">
                    Citizen
                  </span>
                  <span className="text-sm font-bold truncate max-w-[100px] leading-none">
                    {session.user?.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 ml-2">
                <Button
                  variant="ghost"
                  className="rounded-full font-bold"
                  asChild
                >
                  <Link href="/auth/signin">Login</Link>
                </Button>
                <Button
                  className="rounded-full font-bold shadow-lg shadow-primary/20"
                  asChild
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="md:hidden mt-4 bg-background/80 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className={cn(
                    "text-2xl font-black uppercase tracking-tighter p-2 transition-colors",
                    pathname === "/" ? "text-primary" : "text-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                {session && (
                  <Link
                    href="/dashboard"
                    className={cn(
                      "text-2xl font-black uppercase tracking-tighter p-2 transition-colors",
                      pathname === "/dashboard"
                        ? "text-primary"
                        : "text-foreground",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <div className="h-[1px] bg-muted w-full my-2" />
                {session ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">
                          Logged in as
                        </span>
                        <span className="text-lg font-bold">
                          {session.user?.name}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full rounded-2xl font-bold py-6"
                      onClick={() => signOut()}
                    >
                      <LogOut className="w-5 h-5 mr-2" /> Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl font-bold py-6 text-lg"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/auth/signin">Login</Link>
                    </Button>
                    <Button
                      className="w-full rounded-2xl font-bold py-6 text-lg"
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
      </div>
    </nav>
  );
};
