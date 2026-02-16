"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { toast } from "sonner"; // Assuming sonner for toasts
import { BellRing } from "lucide-react";

export function RealTimeNotifications({
  onNewComplaint,
}: {
  onNewComplaint?: () => void;
}) {
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("governance-channel");

    channel.bind("new-complaint", (data: any) => {
      // Show as toast notification (not alert for better DX)
      toast.success(`New ${data.category} report: ${data.ticketId}`, {
        description: `Severity ${data.severity} - ${data.authorName}`,
        duration: 5000,
      });

      // Trigger refresh if callback provided
      if (onNewComplaint) {
        onNewComplaint();
      }
    });

    return () => {
      pusher.unsubscribe("governance-channel");
    };
  }, [onNewComplaint]);

  return null;
}
