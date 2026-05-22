import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | JanSankalp AI",
  description:
    "Explore the powerful features of JanSankalp AI: Multilingual Voice AI, Smart Classification, Auto-Routing, and Real-time Tracking for smart governance.",
  openGraph: {
    title: "Features | JanSankalp AI",
    description:
      "Automated complaint resolution, geo-spatial analytics, and more.",
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
