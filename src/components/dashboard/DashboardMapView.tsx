"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
    <div className="h-[600px] w-full rounded-2xl overflow-hidden border shadow-2xl">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {complaints.map((item) => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={icon}
          >
            <Popup className="rounded-xl overflow-hidden p-0">
              <div className="w-48">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    className="w-full h-24 object-cover"
                    alt=""
                  />
                )}
                <div className="p-3">
                  <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
