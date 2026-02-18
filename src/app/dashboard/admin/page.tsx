"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Settings, BarChart3, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { RealTimeNotifications } from "@/components/dashboard/RealTimeNotifications";

interface ComplaintUpdate {
  complaintId: string;
  ticketId: string;
  status: string;
  updatedBy: string;
  userRole: string;
  officerNote?: string;
  verificationImageUrl?: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recentUpdates, setRecentUpdates] = useState<ComplaintUpdate[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    
    if (session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  // Listen for real-time complaint updates (disabled for now to fix errors)
  // useEffect(() => {
  //   if (status !== "authenticated") return;

  //   const eventSource = new EventSource("/api/notifications/stream");
    
  //   eventSource.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data);
  //       if (data.type === "complaint-updated") {
  //         setRecentUpdates(prev => [data, ...prev.slice(0, 9)]);
  //       }
  //     } catch (error) {
  //       console.error("Error parsing notification:", error);
  //     }
  //   };

  //   eventSource.onerror = (error) => {
  //     console.error("EventSource error:", error);
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || session?.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, departments, and system settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">33</div>
            <p className="text-xs text-muted-foreground">2 Admins, 8 Officers, 21 Citizens</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25+</div>
            <p className="text-xs text-muted-foreground">Sample complaints</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors">
                Manage Users
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors">
                Manage Departments
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors">
                System Settings
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors">
                View Reports
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUpdates.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No recent updates
                </div>
              ) : (
                recentUpdates.map((update, index) => (
                  <div key={`${update.complaintId}-${index}`} className="flex items-center gap-3 text-sm p-3 rounded-lg border">
                    <div className={`w-2 h-2 rounded-full ${
                      update.status === "RESOLVED" ? "bg-green-500" :
                      update.status === "IN_PROGRESS" ? "bg-blue-500" :
                      "bg-orange-500"
                    }`}></div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Complaint {update.ticketId} updated to {update.status}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        by {update.updatedBy} ({update.userRole}) • {new Date(update.timestamp).toLocaleString()}
                      </div>
                      {update.officerNote && (
                        <div className="text-xs bg-muted p-2 rounded mt-1">
                          Note: {update.officerNote}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
