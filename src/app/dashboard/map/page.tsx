"use client";

import DashboardMapViewWrapper from "@/components/dashboard/DashboardMapViewWrapper";

export default function AdminMapViewPage() {
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
