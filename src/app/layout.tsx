import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://jansanklpai.vercel.app"),
  title: {
    default:
      "Arun Kumar Bind | Full Stack MERN & PHP Laravel Developer | India",
    template: "%s | Arun Kumar Bind - JanSankalp AI",
  },
  description:
    "JanSankalp AI - A Smart Governance Platform developed by Arun Kumar Bind, a Full Stack Developer specializing in MERN (MongoDB, Express, React, Node.js), PHP, Laravel, MySQL, TypeScript, and Next.js. Based in India.",
  keywords: [
    "Arun Kumar Bind",
    "Arun Kumar Bind web Developer",
    "Arun Kumar Bind MERN Developer",
    "Arun Kumar Bind Laravel Developer",
    "Arun Kumar Bind Next.js Developer",
    "Full Stack Developer India",
    "MERN Stack Developer India",
    "PHP Laravel Developer India",
    "React.js Developer India",
    "Node.js Developer India",
    "Next.js Developer India",
    "Web Application Developer",
    "Software Engineer India",
    "Frontend Developer",
    "Backend Developer",
    "MySQL Expert",
    "MongoDB Expert",
    "TypeScript Developer",
    "JavaScript Developer",
    "Responsive Web Design",
    "Smart Governance Portfolio",
    "JanSankalp AI Developer",
    "Civic Tech Developer",
    "API Development",
    "REST API",
    "GraphQL",
    "Tailwind CSS Developer",
    "Vercel Deployment",
    "AWS",
    "Cloud Computing",
    "Freelance Web Developer India",
    "Remote Full Stack Developer",
  ],
  authors: [{ name: "Arun Kumar Bind", url: "https://github.com/abx15" }],
  creator: "Arun Kumar Bind",
  publisher: "Arun Kumar Bind",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://jansanklpai.vercel.app",
    siteName: "Arun Kumar Bind - JanSankalp AI",
    title: "Arun Kumar Bind | Full Stack MERN & PHP Laravel Developer",
    description:
      "Portfolio project of Arun Kumar Bind - Expert in MERN, PHP, Laravel, Next.js. Building Smart Governance with JanSankalp AI.",
    images: [
      {
        url: "/logojansanklp.png",
        width: 1200,
        height: 630,
        alt: "Arun Kumar Bind - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arun Kumar Bind | Full Stack Developer India",
    description:
      "Full Stack Web Developer (MERN, PHP, Laravel). Building JanSankalp AI.",
    images: ["/logojansanklp.png"],
  },
  icons: {
    icon: "/faviconjan.png",
    apple: "/faviconjan.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "sonner";
import { NotificationListener } from "@/components/providers/NotificationListener";

import ClientEntry from "@/components/layout/ClientEntry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ClientEntry>
              <Toaster position="top-right" richColors />
              <NotificationListener />
              <Navbar />
              {children}
            </ClientEntry>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
