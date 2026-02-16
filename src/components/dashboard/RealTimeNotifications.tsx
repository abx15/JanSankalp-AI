"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { toast } from "sonner"; // Assuming sonner for toasts
import { BellRing } from "lucide-react";

export function RealTimeNotifications({
  userId,
  onNewComplaint,
}: {
  userId?: string;
  onNewComplaint?: () => void;
}) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // 1. Listen for system-wide events (for admins/officers)
    const governanceChannel = pusher.subscribe("governance-channel");
    governanceChannel.bind("new-complaint", (data: any) => {
      toast.info(`SYSTEM ALERT: New ${data.category}`, {
        description: `${data.ticketId} reported at ${data.location.lat.toFixed(2)}, ${data.location.lng.toFixed(2)}`,
        duration: 8000,
        icon: <BellRing className="w-4 h-4 text-primary" />,
      });

      if (onNewComplaint) onNewComplaint();
    });

    // 2. Listen for personal events (for citizens)
    if (userId) {
      const userChannel = pusher.subscribe(`user-${userId}`);
      userChannel.bind("notification", (data: any) => {
        toast.success(data.title || "Status Updated", {
          description: data.message,
          duration: 10000,
          action: {
            label: "View Report",
            onClick: () => (window.location.href = "/dashboard/my-reports"),
          },
        });

        if (onNewComplaint) onNewComplaint();
      });
    }

    return () => {
      pusher.unsubscribe("governance-channel");
      if (userId) pusher.unsubscribe(`user-${userId}`);
      pusher.disconnect();
    };
  }, [onNewComplaint, userId]);

  return null;
}
