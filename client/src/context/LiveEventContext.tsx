"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type ComplaintStatus =
  | "Registered"
  | "Assigned"
  | "In Progress"
  | "Resolved";

export interface LiveComplaint {
  id: string;
  category: "Road" | "Garbage" | "Water" | "Electricity";
  location: string;
  lat: number;
  lng: number;
  timestamp: Date;
  status: ComplaintStatus;
}

interface LiveEventContextType {
  complaints: LiveComplaint[];
  stats: {
    totalToday: number;
    resolvedToday: number;
    activeDepartments: number;
  };
  latestEvent: LiveComplaint | null;
}

const LiveEventContext = createContext<LiveEventContextType | undefined>(
  undefined,
);

const CATEGORIES: LiveComplaint["category"][] = [
  "Road",
  "Garbage",
  "Water",
  "Electricity",
];
const LOCATIONS = [
  { name: "Mumbai, MH", lat: 19.076, lng: 72.8777 },
  { name: "Bengaluru, KA", lat: 12.9716, lng: 77.5946 },
  { name: "Delhi, NCR", lat: 28.6139, lng: 77.209 },
  { name: "Kolkata, WB", lat: 22.5726, lng: 88.3639 },
  { name: "Hyderabad, TS", lat: 17.385, lng: 78.4867 },
  { name: "Ahmedabad, GJ", lat: 23.0225, lng: 72.5714 },
  { name: "Pune, MH", lat: 18.5204, lng: 73.8567 },
  { name: "Jaipur, RJ", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow, UP", lat: 26.8467, lng: 80.9462 },
  { name: "Chennai, TN", lat: 13.0827, lng: 80.2707 },
  { name: "Guwahati, AS", lat: 26.1445, lng: 91.7362 },
  { name: "Patna, BR", lat: 25.5941, lng: 85.1376 },
];

import { pusherClient } from "@/lib/pusher-client";

export const LiveEventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [complaints, setComplaints] = useState<LiveComplaint[]>([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    resolvedToday: 0,
    activeDepartments: 0,
  });
  const [latestEvent, setLatestEvent] = useState<LiveComplaint | null>(null);

  const fetchRealData = useCallback(async () => {
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      const raw = data.complaints || [];
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const formatted: LiveComplaint[] = raw
        .filter((c: any) => {
          if (c.status === "RESOLVED") {
            return new Date(c.updatedAt) > twentyFourHoursAgo;
          }
          return true;
        })
        .map((c: any) => ({
          id: c.ticketId || c.id,
          category: c.category as any,
          location: `${c.latitude.toFixed(2)}, ${c.longitude.toFixed(2)}`,
          lat: c.latitude,
          lng: c.longitude,
          timestamp: new Date(c.createdAt),
          status: (c.status === "PENDING"
            ? "Registered"
            : c.status === "IN_PROGRESS"
              ? "In Progress"
              : c.status === "RESOLVED"
                ? "Resolved"
                : "Assigned") as ComplaintStatus,
        }));

      setComplaints(formatted.slice(0, 15));

      // Update basic stats from real data
      const resolved = raw.filter((c: any) => c.status === "RESOLVED").length;
      setStats({
        totalToday: raw.length,
        resolvedToday: resolved,
        activeDepartments:
          new Set(raw.map((c: any) => c.departmentId).filter(Boolean)).size ||
          5,
      });
    } catch (error) {
      console.error("Error fetching live events:", error);
    }
  }, []);

  // Real-time Pusher Integration
  useEffect(() => {
    fetchRealData();

    const channel = pusherClient.subscribe("governance-channel");

    channel.bind("new-complaint", (data: any) => {
      const newEvent: LiveComplaint = {
        id: data.ticketId || data.id,
        category: data.category,
        location: data.location?.lat
          ? `${data.location.lat.toFixed(2)}, ${data.location.lng.toFixed(2)}`
          : "City Center",
        lat: data.location?.lat || 20.5937,
        lng: data.location?.lng || 78.9629,
        timestamp: new Date(),
        status: "Registered",
      };

      setComplaints((prev) => [newEvent, ...prev].slice(0, 15));
      setLatestEvent(newEvent);
      setStats((prev) => ({ ...prev, totalToday: prev.totalToday + 1 }));
    });

    channel.bind("complaint-updated", () => {
      fetchRealData(); // Refetch all on update to keep status in sync
    });

    return () => {
      pusherClient.unsubscribe("governance-channel");
    };
  }, [fetchRealData]);

  return (
    <LiveEventContext.Provider value={{ complaints, stats, latestEvent }}>
      {children}
    </LiveEventContext.Provider>
  );
};

export const useLiveEvents = () => {
  const context = useContext(LiveEventContext);
  if (context === undefined) {
    throw new Error("useLiveEvents must be used within a LiveEventProvider");
  }
  return context;
};
