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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "IN_PROGRESS":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "RESOLVED":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Complaints Management
          </h1>
          <p className="text-muted-foreground">
            Review and verify civic reports from across the city.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-muted-foreground font-bold">
              Scanning city reports...
            </p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
            No complaints found.
          </div>
        ) : (
          complaints.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group hover:shadow-lg transition-all border-l-4"
              style={{
                borderLeftColor: item.severity > 3 ? "#ef4444" : "#3b82f6",
              }}
            >
              <div className="flex flex-col md:flex-row">
                {item.imageUrl && (
                  <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-[10px] font-bold">
                        {getStatusIcon(item.status)}
                        {item.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {updatingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-full gap-1 text-[10px] font-bold"
                            onClick={() =>
                              handleUpdateStatus(item.id, "IN_PROGRESS")
                            }
                            disabled={item.status === "IN_PROGRESS"}
                          >
                            <BadgeCheck className="w-3 h-3 text-blue-500" />{" "}
                            Verify
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-full gap-1 text-[10px] font-bold"
                            onClick={() =>
                              handleUpdateStatus(item.id, "RESOLVED")
                            }
                            disabled={item.status === "RESOLVED"}
                          >
                            <CheckCircle className="w-3 h-3 text-green-500" />{" "}
                            Resolve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-full gap-1 text-[10px] font-bold text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              handleUpdateStatus(item.id, "REJECTED")
                            }
                            disabled={item.status === "REJECTED"}
                          >
                            <X className="w-3 h-3" /> Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded">
                      <MapPin className="w-3 h-3" />
                      {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {format(new Date(item.createdAt), "PPp")}
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{
                          backgroundColor:
                            item.severity > 3 ? "#ef4444" : "#3b82f6",
                        }}
                      />
                      Severity: {item.severity}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
