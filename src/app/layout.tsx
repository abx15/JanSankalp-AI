import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://jansanklpai.vercel.app"),
  title: {
    default: "JanSankalp AI - Smart Governance for a Smarter India",
    template: "%s | JanSankalp AI",
  },
  description:
    "JanSankalp AI is an AI-powered civic intelligence platform bridging the gap between citizens and administration for faster, transparent grievance resolution.",
  keywords: [
    "Smart Governance",
    "Civic Tech",
    "India",
    "AI",
    "Grievance Redressal",
    "JanSankalp",
  ],
  authors: [{ name: "JanSankalp Team" }],
  creator: "JanSankalp AI",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://jansanklpai.vercel.app", // Adjust if domain changes
    siteName: "JanSankalp AI",
    title: "JanSankalp AI - Smart Governance",
    description: "AI-powered civic intelligence platform for smart cities.",
    images: [
      {
        url: "/logojansanklp.png",
        width: 1200,
        height: 630,
        alt: "JanSankalp AI Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JanSankalp AI - Smart Governance",
    description: "AI-powered civic intelligence platform for smart cities.",
    images: ["/logojansanklp.png"],
  },
  icons: {
    icon: "/faviconjan.png",
    apple: "/faviconjan.png",
  },
  manifest: "/manifest.json",
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
