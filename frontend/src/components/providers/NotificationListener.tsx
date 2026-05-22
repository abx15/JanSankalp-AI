"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher-client";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export const NotificationListener = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = pusherClient.subscribe(`user-${session.user.id}`);

    channel.bind(
      "notification",
      (data: {
        title: string;
        message: string;
        type: string;
        status?: string;
      }) => {
        toast(data.title, {
          description: data.message,
          icon: <Bell className="w-4 h-4 text-primary" />,
        });
      },
    );

    return () => {
      pusherClient.unsubscribe(`user-${session.user.id}`);
    };
  }, [session?.user?.id]);

  return null;
};
