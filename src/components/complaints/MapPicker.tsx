"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: [number, number];
}

function LocationMarker({
  onSelect,
  position,
}: {
  onSelect: (lat: number, lng: number) => void;
  position: [number, number] | null;
}) {
  const map = useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} icon={icon} />;
}

export default function MapPicker({
  onLocationSelect,
  initialLocation,
}: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation || null,
  );

  useEffect(() => {
    if ("geolocation" in navigator && !initialLocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        onLocationSelect(latitude, longitude);
      });
    }
  }, [initialLocation, onLocationSelect]);

  const handleSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden border-2 border-muted">
      <MapContainer
        center={position || [20.5937, 78.9629]} // Default to center of India
        zoom={position ? 15 : 5}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={handleSelect} position={position} />
      </MapContainer>
    </div>
  );
}
