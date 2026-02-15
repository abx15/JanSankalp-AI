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
    <footer className="w-full border-t border-slate-200 bg-slate-50 text-slate-600 pt-16 pb-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
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
                <span className="text-xl font-black tracking-tight text-slate-900 leading-tight">
                  JanSankalp <span className="text-primary italic">AI</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                  Smart Governance
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Empowering India through AI-driven civic intelligence. Bridging
              the gap between citizens and administration for a smarter
              tomorrow.
            </p>
            <div className="flex gap-4">
              {[
                {
                  icon: Github,
                  href: "https://github.com/abx15/JanSankalp-AI",
                  label: "GitHub",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/arun-kumar-a3b047353/",
                  label: "LinkedIn",
                },
                {
                  icon: Globe,
                  href: "https://arun15dev.netlify.app/",
                  label: "Portfolio",
                },
                {
                  icon: Mail,
                  href: "mailto:developerarunwork@gmail.com",
                  label: "Email",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 hover:shadow-md transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-4 font-medium">
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
                    className="text-slate-500 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6 text-lg">Platform</h3>
            <ul className="space-y-4 font-medium">
              {[
                { name: "Help Center", icon: Globe },
                { name: "Privacy Policy", icon: Shield },
                { name: "Terms of Service", icon: ExternalLink },
                { name: "API Docs", icon: Zap },
              ].map((item) => (
                <li key={item.name}>
                  <button className="flex items-center gap-3 text-slate-500 hover:text-primary transition-colors group">
                    <item.icon className="w-4 h-4 text-slate-300 group-hover:text-primary/70 transition-colors" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Support */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-900 font-bold mb-4 text-lg">Support</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Facing an issue? Our team is available 24/7 for administrative
              support.
            </p>
            <Link
              href="mailto:developerarunwork@gmail.com"
              className="w-full py-3 bg-primary text-white rounded-xl font-bold text-center block hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span>© 2026 JanSankalp AI</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1">
              Building for a Smarter Bharat{" "}
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-slate-400">crafted by</span>
              <a
                href="https://github.com/abx15"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-slate-700 hover:text-primary transition-colors"
              >
                Arun Kumar Bind
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
