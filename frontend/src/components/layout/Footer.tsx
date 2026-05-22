import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Mail,
  Heart,
  Globe,
  ExternalLink,
  Shield,
  Zap,
} from "lucide-react";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-border pt-24 pb-12 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4 group w-fit">
              <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
                <Image
                  src="/logo.png"
                  alt="JanSankalp AI Logo"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-foreground leading-tight">
                  JanSankalp <span className="text-primary italic">AI</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  Civic Intelligence
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Empowering citizens and administration through AI-driven civic
              intelligence. Building a more responsive and transparent tomorrow
              for India.
            </p>
            <div className="flex gap-4">
              {[
                {
                  icon: Github,
                  href: "https://github.com/abx15",
                  label: "GitHub",
                },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Globe, href: "#", label: "Website" },
                {
                  icon: Mail,
                  href: "mailto:support@jansankalpai.gov",
                  label: "Email",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all active:scale-95"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-bold mb-8 text-foreground uppercase tracking-[0.2em]">
              Platform
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Features", href: "/features" },
                { name: "How It Works", href: "/how-it-works" },
                { name: "Dashboard", href: "/dashboard" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group text-base font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-bold mb-8 text-foreground uppercase tracking-[0.2em]">
              Legal & Resources
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Privacy Policy", icon: Shield },
                { name: "Terms of Service", icon: ExternalLink },
                { name: "Documentation", icon: Zap },
                { name: "Help Center", icon: Globe },
              ].map((item) => (
                <li key={item.name}>
                  <button className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group text-base font-medium">
                    <item.icon className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support CTA */}
          <div className="p-8 rounded-[2rem] bg-muted/30 border border-border backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] -z-10" />
            <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">
              Need Support?
            </h3>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Our dedicated staff is here to help 24/7 with any administrative
              or technical queries.
            </p>
            <Button
              className="w-full h-12 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg active:scale-95"
              asChild
            >
              <Link href="mailto:support@jansankalpai.gov">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              © 2026{" "}
              <span className="text-foreground font-bold">JanSankalp AI</span>.
              All rights reserved.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span className="bg-muted px-2 py-0.5 rounded border border-border">
                Digital India
              </span>
              <span className="bg-muted px-2 py-0.5 rounded border border-border">
                Smart Governance
              </span>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>for</span>
              <span className="font-bold text-foreground">
                The Citizens of India
              </span>
            </div>
            <p className="text-xs text-muted-foreground/60">
              Architected & Developed by{" "}
              <a
                href="https://github.com/abx15"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                Arun Kumar Bind
              </a>{" "}
              &{" "}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                TriFusion Dynamics Team
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
