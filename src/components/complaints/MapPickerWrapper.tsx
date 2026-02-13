"use client";

import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with Leaflet
const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-lg bg-muted animate-pulse flex items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Loading interactive map...
      </p>
    </div>
  ),
});

export default MapPicker;
