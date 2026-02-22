"use client";

import DashboardMapViewWrapper from "@/components/dashboard/DashboardMapViewWrapper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminMapViewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // @ts-ignore
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          Geospatial Intelligence
        </h1>
        <p className="text-muted-foreground">
          Real-time visualization of civic issues across the city.
        </p>
      </div>
      <DashboardMapViewWrapper />
    </div>
  );
}
