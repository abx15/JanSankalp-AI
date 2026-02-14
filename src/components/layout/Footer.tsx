import Link from "next/link";
import { Landmark, Heart, Github, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-xl font-black">
                JanSankalp <span className="text-primary italic">AI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered civic intelligence platform for smart cities across
              India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <div className="flex gap-3 mb-4">
              <a
                href="https://github.com/abx15/JanSankalp-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/arun-kumar-a3b047353/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:developerarunwork@gmail.com"
                className="w-9 h-9 rounded-lg bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Have questions? Reach out to us!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© 2026 JanSankalp AI</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made for India{" "}
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Built by</span>
            <a
              href="https://github.com/abx15"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              Arun Kumar Bind
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
