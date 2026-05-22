import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Access | JanSankalp AI",
  description:
    "Secure login and registration for JanSankalp AI. Access your dashboard to file complaints, track status, or manage civic issues.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
