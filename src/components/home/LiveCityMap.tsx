"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { useLiveEvents } from "@/context/LiveEventContext";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";

// Use dynamic import for Leaflet to avoid SSR errors
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export const LiveCityMap = () => {
  const { complaints, latestEvent } = useLiveEvents();
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    20.5937, 78.9629,
  ]); // Central India
  const [mapZoom, setMapZoom] = useState(5);
  const [mounted, setMounted] = useState(false);
  const lastEventId = useRef<string | null>(null);
  const LRef = useRef<any>(null);

  // Constants for status colors
  const STATUS_COLORS = {
    Registered: "#6366f1", // primary
    Assigned: "#3b82f6", // blue
    "In Progress": "#f97316", // orange
    Resolved: "#22c55e", // green
  };

  // Map Controller for smoothing panning
  const MapController = ({
    center,
    zoom,
  }: {
    center: [number, number];
    zoom: number;
  }) => {
    const { useMap } = require("react-leaflet");
    const map = useMap();

    useEffect(() => {
      if (map) {
        map.flyTo(center, zoom, {
          duration: 3,
          easeLinearity: 0.25,
        });
      }
    }, [center, zoom, map]);

    return null;
  };

  useEffect(() => {
    setMounted(true);
    LRef.current = require("leaflet");
  }, []);

  // Effect to react to new events
  useEffect(() => {
    if (latestEvent && latestEvent.id !== lastEventId.current) {
      lastEventId.current = latestEvent.id;
      setMapCenter([latestEvent.lat, latestEvent.lng]);
      setMapZoom(11);
    }
  }, [latestEvent]);

  // Fallback / Idle simulation: Pan to random cities if no new events
  useEffect(() => {
    const interval = setInterval(() => {
      if (complaints.length > 0) {
        const randomComplaint =
          complaints[Math.floor(Math.random() * complaints.length)];
        setMapCenter([randomComplaint.lat, randomComplaint.lng]);
        setMapZoom(10 + Math.random() * 2);
      }
    }, 12000); // Slightly longer than new event interval to avoid conflicts

    return () => clearInterval(interval);
  }, [complaints]);

  // Standard Leaflet Icon fix (markers don't show by default in some Next.js setups)
  const defaultIcon = useMemo(() => {
    if (typeof window === "undefined") return null;
    const L = require("leaflet");
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div class="marker-pin animate-bounce"></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });
  }, []);

  if (!mounted)
    return (
      <div className="w-full h-[500px] bg-slate-50 animate-pulse rounded-[3rem] border border-slate-100 flex items-center justify-center">
        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Initializing Satellite Link...
        </span>
      </div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto py-24 px-6 relative overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">
          Dynamic Civic Activity
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto font-medium">
          Watching the "Civic Operating System" respond to citizens across India
          in real-time.
        </p>
      </div>

      <div className="relative h-[500px] md:h-[600px] bg-slate-100 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden group mb-6 z-10">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="h-full w-full"
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          <MapController center={mapCenter} zoom={mapZoom} />

          {complaints.map((c) => (
            <Marker
              key={c.id}
              position={[c.lat, c.lng]}
              icon={
                LRef.current
                  ? LRef.current.divIcon({
                      className: "custom-marker",
                      html: `
                  <div class="relative flex flex-col items-center">
                    <div class="pin-status w-4 h-4 rounded-full border-2 border-white shadow-lg transition-colors duration-500" 
                         style="background-color: ${STATUS_COLORS[c.status as keyof typeof STATUS_COLORS]}; 
                                box-shadow: 0 0 10px ${STATUS_COLORS[c.status as keyof typeof STATUS_COLORS]}80">
                    </div>
                    <div class="pin-tail w-0.5 h-3" style="background-color: ${STATUS_COLORS[c.status as keyof typeof STATUS_COLORS]}"></div>
                  </div>
                `,
                      iconSize: [20, 30],
                      iconAnchor: [10, 30],
                    })
                  : undefined
              }
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[150px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-primary px-1.5 py-0.5 bg-primary/5 rounded border border-primary/10">
                      {c.id}
                    </span>
                    <span
                      className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        c.status === "Resolved"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-primary/10 text-primary border-primary/20"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-800 mb-1">
                    {c.category} Issue
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {c.location}
                  </div>
                  {c.status === "Registered" && (
                    <div className="mt-2 text-[8px] font-black text-primary uppercase animate-pulse">
                      Processing...
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Global UI Overlays */}
        <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
          <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                Control Center India
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 z-[1000] pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-1">
            <div className="text-[8px] font-black text-white/50 uppercase tracking-widest">
              Active Downlink
            </div>
            <div className="text-xs font-bold text-white uppercase truncate max-w-[200px]">
              {latestEvent?.location || "Scanning Provinces..."}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              {status}
            </span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .leaflet-container {
          background: #f8fafc !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 1rem;
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
        .pin-status {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};
