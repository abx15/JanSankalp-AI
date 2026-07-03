"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/lib/api";
import { toast } from "sonner";
import { BellRing } from "lucide-react";

export function RealTimeNotifications({
  userId,
  onNewComplaint,
}: {
  userId?: string;
  onNewComplaint?: () => void;
}) {
  const { data: session } = useSession();

  // Connect to the dashboard Socket.io namespace
  const { socket, isConnected } = useSocket({
    token: (session as any)?.accessToken,
    namespace: 'dashboard',
    room: 'dashboard-stats',
  });

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleComplaintUpdate = (data: any) => {
      if (data.event === 'new-complaint') {
        toast.info(`SYSTEM ALERT: New ${data.category}`, {
          description: `${data.ticketId} reported at ${data.location?.lat?.toFixed(2) || 0}, ${data.location?.lng?.toFixed(2) || 0}`,
          duration: 8000,
          icon: <BellRing className="w-4 h-4 text-blue-600" />,
        });
      }

      if (onNewComplaint) onNewComplaint();
    };

    socket.on('complaintUpdate', handleComplaintUpdate);

    return () => {
      socket.off('complaintUpdate', handleComplaintUpdate);
    };
  }, [socket, isConnected, onNewComplaint]);

  return null;
}
