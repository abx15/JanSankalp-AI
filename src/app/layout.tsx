import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://jansanklpai.vercel.app"),
  title: {
    default: "JanSankalp AI | Smart Governance & Public Grievance Redressal",
    template: "%s | JanSankalp AI",
  },
  description:
    "JanSankalp AI is a next-generation smart governance platform designed to streamline public grievance redressal. Leveraging AI for automated complaint analysis, routing, and resolution tracking, we ensure transparency and efficiency in civic administration.",
  keywords: [
    "JanSankalp AI",
    "Smart Governance",
    "Public Grievance Redressal",
    "AI in Governance",
    "Civic Tech",
    "E-Governance",
    "Complaint Management System",
    "Citizen Empowerment",
    "Automated Complaint Resolution",
    "Government Transparency",
    "Digital India",
    "Smart City Solutions",
    "AI for Social Good",
    "Civic Administration Platform",
    "Public Service Delivery",
    "Arun Kumar Bind Web Developer",
    "abx15",
  ],
  authors: [{ name: "Arun Kumar Bind", url: "https://github.com/abx15" }],
  creator: "Arun Kumar Bind",
  publisher: "JanSankalp AI",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://jansanklpai.vercel.app",
    siteName: "JanSankalp AI",
    title: "JanSankalp AI | Smart Governance & Public Grievance Redressal",
    description:
      "Empowering citizens and administration with AI-driven public grievance redressal. Experience transparent, efficient, and responsive governance with JanSankalp AI.",
    images: [
      {
        url: "/logojansanklp.png",
        width: 1200,
        height: 630,
        alt: "JanSankalp AI - Smart Governance Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JanSankalp AI | Smart Governance Platform",
    description:
      "Revolutionizing public grievance redressal with AI. Transparent, efficient, and accountable governance for everyone.",
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
