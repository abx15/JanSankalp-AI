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
  Loader2,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function MyReportsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
            My Civic Reports
          </h1>
          <p className="text-muted-foreground">
            Tracking your personal contributions to city development.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-muted-foreground font-bold">
              Retrieving your reports...
            </p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
            <History className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
            <p className="font-bold text-muted-foreground">
              You haven't filed any reports yet.
            </p>
            <Button className="mt-4 rounded-full px-6">Report an Issue</Button>
          </div>
        ) : (
          complaints.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group hover:shadow-lg transition-all border-l-4"
              style={{
                borderLeftColor:
                  item.status === "RESOLVED" ? "#22c55e" : "#3b82f6",
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
                    {item.department && (
                      <div className="flex items-center gap-2 py-1 px-2 bg-primary/5 text-primary rounded">
                        <Users className="w-3 h-3" />
                        Dept: {item.department.name}
                      </div>
                    )}
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
