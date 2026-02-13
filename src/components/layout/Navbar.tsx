"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Landmark, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <>
      <Link
        href="/"
        className="text-foreground/70 hover:text-primary transition-colors font-medium"
      >
        Home
      </Link>
      {session && (
        <Link
          href="/dashboard"
          className="text-foreground/70 hover:text-primary transition-colors font-medium"
        >
          Dashboard
        </Link>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Landmark className="w-8 h-8 text-primary" />
            <span className="text-xl font-black hidden sm:block">
              JanSankalp <span className="text-primary italic">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavItems />
            <div className="flex items-center gap-4 ml-4">
              <ThemeToggle />
              {session ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4" />
                    <span>{session.user?.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => signOut()}
                  >
                    Logout <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth/signin">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground/70"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden absolute top-16 w-full bg-background border-b transition-all duration-300",
          isOpen ? "block" : "hidden",
        )}
      >
        <div className="px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col gap-4">
            <NavItems />
          </div>
          <div className="pt-4 border-t flex flex-col gap-4">
            {session ? (
              <>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4" />
                  <span>{session.user?.name}</span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => signOut()}
                >
                  Logout <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/auth/signin">Login</Link>
                </Button>
                <Button className="w-full justify-start" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
