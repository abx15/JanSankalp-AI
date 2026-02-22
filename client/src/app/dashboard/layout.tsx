import type { Metadata } from "next";
import DashboardWrapper from "./DashboardWrapper";

export const metadata: Metadata = {
  title: "Dashboard | JanSankalp AI",
  description:
    "Manage your civic complaints, track status, and view analytics on the JanSankalp AI dashboard. Empowering citizens and officials with data-driven governance.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
