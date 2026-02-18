import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Account | JanSankalp AI",
  description:
    "Verify your email address to access JanSankalp AI features and participate in smart governance.",
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
