import Link from "next/link";
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
    <footer className="w-full bg-civic-primary text-white pt-24 pb-12 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4 group w-fit">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo.png"
                  alt="JanSankalp AI Logo"
                  fill
                  sizes="48px"
                  className="object-contain transition-transform group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white leading-tight">
                  JanSankalp{" "}
                  <span className="text-civic-accent italic">AI</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-civic-accent/90">
                  Smart Governance
                </span>
              </div>
            </Link>
            <p className="text-white/70 text-base leading-relaxed">
              Empowering India through AI-driven civic intelligence. We bridge
              the gap between citizens and administration for a more responsive
              and transparent tomorrow.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Globe, href: "#", label: "Website" },
                { icon: Mail, href: "#", label: "Email" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-civic-accent hover:bg-white/10 hover:border-civic-accent/30 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-bold mb-8 text-white uppercase tracking-widest">
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
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group text-base font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-civic-accent scale-0 group-hover:scale-100 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-8 text-white uppercase tracking-widest">
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
                  <button className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group text-base font-medium">
                    <item.icon className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support CTA */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-civic-accent/10 blur-[40px] -z-10" />
            <h3 className="text-xl font-bold mb-4 text-white">Need Support?</h3>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Our dedicated staff is here to help 24/7 with any administrative
              or technical queries.
            </p>
            <Link
              href="mailto:support@jansankalpai.gov"
              className="w-full py-4 bg-white text-civic-primary rounded-xl font-bold text-center block hover:bg-civic-accent hover:text-white transition-all shadow-xl shadow-black/10 active:scale-95"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-white/50">
              © 2026 JanSankalp AI. All rights reserved.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-widest text-civic-accent/70">
              <span className="bg-civic-accent/10 px-2 py-0.5 rounded">
                Digital India
              </span>
              <span className="bg-civic-accent/10 px-2 py-0.5 rounded">
                Smart Governance
              </span>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>for</span>
              <span className="font-bold text-white">
                The Citizens of India
              </span>
            </div>
            <p className="text-xs text-white/40">
              Architected by{" "}
              <a href="#" className="underline hover:text-white">
                Arun Kumar Bind
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
