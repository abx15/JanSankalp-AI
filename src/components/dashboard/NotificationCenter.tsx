"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  BellDot,
  CheckCircle2,
  Info,
  AlertCircle,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  complaintId?: string;
  complaint?: {
    ticketId: string;
    title: string;
  };
}

export function NotificationCenter({ userId }: { userId?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(
        data.notifications?.filter((n: any) => !n.read).length || 0,
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (notificationId?: string, all = false) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ notificationId, all }),
      });
      if (all) {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      } else {
        setNotifications(
          notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const getIcon = (type: string) => {
    switch (type) {
      case "RESOLVED":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "COMPLAINT_REGISTERED":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-primary/10 transition-colors"
        >
          {unreadCount > 0 ? (
            <BellDot className="w-5 h-5 text-primary animate-pulse" />
          ) : (
            <Bell className="w-5 h-5 text-muted-foreground" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-background">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] p-0 border-l-0 shadow-2xl">
        <SheetHeader className="p-6 border-b bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-black flex items-center gap-2">
              Notification Hub
            </SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAsRead(undefined, true)}
                className="text-[10px] font-black uppercase tracking-wider text-primary hover:bg-primary/5"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-4">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Bell className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    All caught up!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    No new notifications at the moment.
                  </p>
                </div>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "p-4 rounded-2xl border transition-all relative group",
                    n.read
                      ? "bg-background border-border"
                      : "bg-primary/5 border-primary/20 shadow-sm",
                  )}
                >
                  {!n.read && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
                  )}
                  <div className="flex gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        n.type === "RESOLVED"
                          ? "bg-green-100"
                          : n.type === "COMPLAINT_REGISTERED"
                            ? "bg-blue-100"
                            : "bg-orange-100",
                      )}
                    >
                      {getIcon(n.type)}
                    </div>
                    <div className="space-y-1 pr-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-[10px] font-medium text-slate-400">
                          {format(new Date(n.createdAt), "MMM d, h:mm a")}
                        </span>
                        {n.complaintId && (
                          <Link
                            href={`/dashboard/${sessionStorage.getItem("role") === "ADMIN" ? "complaints" : "my-reports"}?id=${n.complaintId}`}
                            onClick={() => markAsRead(n.id)}
                          >
                            <span className="text-[10px] font-black text-primary hover:underline uppercase tracking-tighter">
                              View Details
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  {!n.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-4 right-4 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => markAsRead(n.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
