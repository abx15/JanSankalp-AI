"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Users,
  CheckCircle,
  X,
  Loader2,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminComplaintsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    // @ts-ignore
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/complaints/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchComplaints();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          icon: Clock,
          color: "text-orange-500",
          bg: "bg-orange-500/10",
          border: "border-orange-500/20",
        };
      case "IN_PROGRESS":
        return {
          icon: Users,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
        };
      case "RESOLVED":
        return {
          icon: CheckCircle2,
          color: "text-green-500",
          bg: "bg-green-500/10",
          border: "border-green-500/20",
        };
      case "REJECTED":
        return {
          icon: XCircle,
          color: "text-red-500",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-slate-500",
          bg: "bg-slate-500/10",
          border: "border-slate-500/20",
        };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">
            Complaints Management
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Unified command center for reviewing and verifying city-wide
            reports.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-2xl border">
          <History className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Total: {complaints.length}
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20 mb-4" />
            <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-xs">
              Synchronizing Command Feed...
            </p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-32 bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-2xl mb-4 flex items-center justify-center">
              <BadgeCheck className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-muted-foreground">
              The city is quiet. No active reports.
            </p>
          </div>
        ) : (
          complaints.map((item) => {
            const statusInfo = getStatusInfo(item.status);
            return (
              <Card
                key={item.id}
                className="overflow-hidden group hover:shadow-2xl transition-all border-none bg-card shadow-sm rounded-[2rem] relative"
              >
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full ${item.severity > 3 ? "bg-red-500" : "bg-blue-500"}`}
                />
                <div className="flex flex-col lg:flex-row">
                  {item.imageUrl && (
                    <div className="w-full lg:w-80 h-64 lg:h-auto overflow-hidden relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full animate-pulse",
                              item.severity > 3 ? "bg-red-500" : "bg-blue-500",
                            )}
                          />
                          <span className="text-[10px] font-black text-white uppercase tracking-wider">
                            Severity: {item.severity}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-xl border border-primary/20">
                            {item.category}
                          </span>
                          <div
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black border",
                              statusInfo.bg,
                              statusInfo.color,
                              statusInfo.border,
                            )}
                          >
                            <statusInfo.icon className="w-3 h-3" />
                            {item.status}
                          </div>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {updatingId === item.id ? (
                          <div className="px-8 py-2 bg-muted rounded-xl flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          </div>
                        ) : (
                          <>
                            {item.status !== "IN_PROGRESS" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 rounded-xl gap-2 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
                                onClick={() =>
                                  handleUpdateStatus(item.id, "IN_PROGRESS")
                                }
                              >
                                <BadgeCheck className="w-4 h-4" /> Verify
                              </Button>
                            )}
                            {item.status !== "RESOLVED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 rounded-xl gap-2 text-xs font-bold hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition-colors"
                                onClick={() =>
                                  handleUpdateStatus(item.id, "RESOLVED")
                                }
                              >
                                <CheckCircle className="w-4 h-4" /> Resolve
                              </Button>
                            )}
                            {item.status !== "REJECTED" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 rounded-xl gap-2 text-xs font-bold text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                                onClick={() =>
                                  handleUpdateStatus(item.id, "REJECTED")
                                }
                              >
                                <X className="w-4 h-4" /> Reject
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 max-w-3xl">
                      {item.description}
                    </p>

                    <div className="pt-6 border-t border-muted flex flex-wrap items-center justify-between gap-6">
                      <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-xl border border-transparent hover:border-muted-foreground/10 transition-colors cursor-default">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.latitude.toFixed(4)},{" "}
                          {item.longitude.toFixed(4)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {format(
                            new Date(item.createdAt),
                            "MMM d, yyyy • h:mm a",
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-xl border">
                        <Users className="w-4 h-4 text-muted-foreground/40" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          ID: {item.id.slice(-8)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
