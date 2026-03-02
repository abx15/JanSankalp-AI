"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
      "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
      active
        ? "text-primary bg-primary/10 shadow-sm"
        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
    )}
  >
    {children}
  </Link>
);

export const Navbar = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b",
        isScrolled
          ? "bg-white dark:bg-neutral-900 py-3 shadow-lg border-border"
          : "bg-white/95 dark:bg-neutral-900/95 py-4 border-transparent"
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="JanSankalp AI Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground tracking-tight">
              JanSankalp <span className="text-primary italic">AI</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Civic Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <NavItem href="/" active={pathname === "/"}>Home</NavItem>
          <NavItem href="/about" active={pathname === "/about"}>About</NavItem>
          <NavItem href="/features" active={pathname === "/features"}>Features</NavItem>
          <NavItem href="/how-it-works" active={pathname === "/how-it-works"}>How It Works</NavItem>
          {session && (
            <NavItem href="/dashboard" active={pathname === "/dashboard"}>
              Dashboard
            </NavItem>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <div className="h-6 w-[1px] bg-border" />
          </div>

          {session?.user ? (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">
                {session.user.name?.split(" ")[0]}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl bg-muted hover:bg-muted/80"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Login</Link>
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-white" asChild>
                <Link href="/auth/signup">Join Now</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-xl bg-muted border"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="p-0 w-[85%] max-w-sm bg-white dark:bg-neutral-900 border-l shadow-2xl"
            >
              <SheetHeader className="p-6 border-b">
                <SheetTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">JanSankalp</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Civic Intelligence
                      </span>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="px-6 py-6 flex flex-col gap-2 h-full">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About" },
                  { href: "/features", label: "Features" },
                  { href: "/how-it-works", label: "How It Works" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-semibold p-3 rounded-xl transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-primary/5"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                {session && (
                  <Link
                    href="/dashboard"
                    className="text-sm font-semibold p-3 rounded-xl text-muted-foreground hover:bg-primary/5"
                  >
                    Dashboard
                  </Link>
                )}

                <div className="h-[1px] bg-border my-4" />

                {session?.user ? (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                      <User className="w-5 h-5 text-primary" />
                      <span className="font-semibold">
                        {session.user.name}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full text-red-500 hover:bg-red-50 mt-4"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-4">
                    <Button variant="outline" asChild>
                      <Link href="/auth/signin">Login</Link>
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-white" asChild>
                      <Link href="/auth/signup">Join JanSankalp</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};