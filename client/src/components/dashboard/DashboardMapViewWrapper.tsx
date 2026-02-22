"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./DashboardMapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-muted animate-pulse rounded-2xl flex items-center justify-center">
      <span className="text-muted-foreground font-bold">
        Initializing Map Intelligence...
      </span>
    </div>
  ),
});

export default function DashboardMapViewWrapper() {
  return <Map />;
}
