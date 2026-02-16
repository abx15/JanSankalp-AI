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
    totalToday: 1248,
    resolvedToday: 892,
    activeDepartments: 14,
  });
  const [latestEvent, setLatestEvent] = useState<LiveComplaint | null>(null);

  // Status progression logic
  useEffect(() => {
    const interval = setInterval(() => {
      setComplaints((prev) =>
        prev.map((c) => {
          const age = (new Date().getTime() - c.timestamp.getTime()) / 1000;

          if (c.status === "Registered" && age > 8)
            return { ...c, status: "Assigned" };
          if (c.status === "Assigned" && age > 20)
            return { ...c, status: "In Progress" }; // 8 + 12
          if (c.status === "In Progress" && age > 40)
            return { ...c, status: "Resolved" }; // 20 + 20

          return c;
        }),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Update stats logic
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalToday: prev.totalToday + 1,
        resolvedToday: prev.resolvedToday + (Math.random() > 0.4 ? 1 : 0),
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const addSimulatedComplaint = useCallback((data?: Partial<LiveComplaint>) => {
    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const newComplaint: LiveComplaint = {
      id: data?.id || `JAN-${Math.floor(Math.random() * 1000000)}`,
      category:
        (data?.category as any) ||
        CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      location: data?.location || loc.name,
      lat: data?.lat || loc.lat + (Math.random() - 0.5) * 0.01,
      lng: data?.lng || loc.lng + (Math.random() - 0.5) * 0.01,
      timestamp: new Date(),
      status: "Registered",
    };

    setComplaints((prev) => [newComplaint, ...prev].slice(0, 10));
    setLatestEvent(newComplaint);
  }, []);

  // Real-time Pusher Integration
  useEffect(() => {
    const channel = pusherClient.subscribe("governance-channel");

    channel.bind("new-complaint", (data: any) => {
      addSimulatedComplaint({
        id: data.id,
        category: data.category,
        location: "Verified Location", // Simulating location lookup
        lat: data.location?.lat,
        lng: data.location?.lng,
      });
    });

    return () => {
      pusherClient.unsubscribe("governance-channel");
    };
  }, [addSimulatedComplaint]);

  // Event generation loop
  useEffect(() => {
    // Initial complaints only on client
    addSimulatedComplaint();

    const interval = setInterval(() => {
      addSimulatedComplaint();
    }, 10000); // New issue every 10 seconds

    return () => clearInterval(interval);
  }, [addSimulatedComplaint]);

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
