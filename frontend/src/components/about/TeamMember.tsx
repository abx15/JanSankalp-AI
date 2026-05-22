"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Globe } from "lucide-react";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  links?: {
    github?: string;
    linkedin?: string;
    email?: string;
    website?: string;
  };
  index?: number;
}

export const TeamMember = ({
  name,
  role,
  bio,
  links,
  index = 0,
}: TeamMemberProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group p-8 rounded-[2rem] bg-card border hover:border-primary/30 transition-all shadow-xl shadow-primary/5"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-black mb-6 shadow-lg shadow-primary/30">
        {name.charAt(0)}
      </div>

      <h3 className="text-2xl font-bold mb-1">{name}</h3>
      <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">
        {role}
      </p>

      <p className="text-muted-foreground leading-relaxed mb-6">{bio}</p>

      {links && (
        <div className="flex gap-3">
          {links.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {links.linkedin && (
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {links.email && (
            <a
              href={`mailto:${links.email}`}
              className="w-10 h-10 rounded-xl bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          )}
          {links.website && (
            <a
              href={links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-foreground/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
            >
              <Globe className="w-5 h-5" />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
};
