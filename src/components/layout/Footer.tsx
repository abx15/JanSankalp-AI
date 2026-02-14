import Link from "next/link";
import { Landmark, Heart, Github, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-card/50 backdrop-blur-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand Section */}
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-lg sm:text-xl font-black">
                JanSankalp <span className="text-primary italic">AI</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto sm:mx-0">
              AI-powered civic intelligence platform for smart cities across
              India.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-sm sm:text-base mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-sm sm:text-base mb-3 sm:mb-4">
              Connect
            </h3>
            <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 justify-center sm:justify-start">
              <a
                href="https://github.com/abx15/JanSankalp-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors shrink-0"
                aria-label="GitHub"
              >
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="https://linkedin.com/in/arunkumar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors shrink-0"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="mailto:arun@jansankalp.ai"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors shrink-0"
                aria-label="Email"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Have questions? Reach out to us!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="whitespace-nowrap">© 2026 JanSankalp AI</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                Made for India{" "}
                <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span>Built by</span>
              <a
                href="https://github.com/abx15"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline whitespace-nowrap"
              >
                Arun Kumar
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
