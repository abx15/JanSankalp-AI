"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function DashboardMapView() {
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/complaints")
      .then((res) => res.json())
      .then((data) => setComplaints(data.complaints || []));
  }, []);

  return (
    <div className="h-[calc(100vh-12rem)] w-full rounded-3xl overflow-hidden border shadow-2xl relative">
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
        <h3 className="font-black text-xs uppercase tracking-widest mb-2 text-slate-500">
          Legend
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm" />
            <span className="text-[10px] font-bold">High Severity (&gt;3)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
            <span className="text-[10px] font-bold">Standard Incident</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="h-full w-full bg-slate-100"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {complaints.map((item) => {
          const isHighSeverity = item.severity > 3;
          const customIcon = L.divIcon({
            className: `bg-transparent`,
            html: `<div class="w-4 h-4 rounded-full ${isHighSeverity ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-blue-500"} border-2 border-white shadow-md"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          return (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={customIcon}
            >
              <Popup className="rounded-xl overflow-hidden p-0 border-none shadow-xl">
                <div className="w-64">
                  {item.imageUrl && (
                    <div className="relative h-32">
                      <Image
                        src={item.imageUrl}
                        width={256}
                        height={128}
                        className="w-full h-full object-cover"
                        alt="Complaint image"
                      />
                      <div
                        className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-[10px] font-black text-white ${isHighSeverity ? "bg-red-500" : "bg-blue-500"}`}
                      >
                        Severity: {item.severity}
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-white">
                    <h4 className="font-black text-sm mb-1">{item.title}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                      {item.category}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
