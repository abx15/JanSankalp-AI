"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/lib/api";
import { toast } from "sonner";
import { Bell, WifiOff } from "lucide-react";

export const NotificationListener = () => {
  const { data: session } = useSession();

  const { socket, isConnected, isReconnecting } = useSocket({
    token: (session as any)?.accessToken,
    namespace: 'notifications',
  });

  // Reconnection toast alert — only show for authenticated users (backend may not be running locally)
  useEffect(() => {
    if (isReconnecting && session) {
      toast.warning("Reconnecting...", {
        description: "Attempting to reconnect to live server",
        id: "socket-reconnect",
        icon: <WifiOff className="w-4 h-4 text-orange-500 animate-pulse" />,
        duration: Infinity,
      });
    } else {
      toast.dismiss("socket-reconnect");
    }
  }, [isReconnecting, session]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNotification = (data: {
      title: string;
      message: string;
      type: string;
      status?: string;
    }) => {
      toast(data.title, {
        description: data.message,
        icon: <Bell className="w-4 h-4 text-blue-500" />,
      });
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, isConnected]);

  return null;
};
