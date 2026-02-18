"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/complaints/ImageUpload";
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User,
  Calendar,
  MapPin
} from "lucide-react";

interface Complaint {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  status: string;
  severity: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  author: {
    name: string;
    email: string;
  };
}

export default function OfficerComplaintsPage() {
  const { data: session } = useSession();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingComplaint, setUpdatingComplaint] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState({
    status: "",
    officerNote: "",
    verificationImageUrl: ""
  });

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const fetchAssignedComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      // Filter complaints assigned to current officer
      const assignedComplaints = data.complaints.filter(
        (c: Complaint) => c.assignedTo?.id === session?.user?.id
      );
      setComplaints(assignedComplaints);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComplaint = async (complaintId: string) => {
    if (!updateData.status || !updateData.officerNote) {
      alert("Please provide status and officer note before updating.");
      return;
    }

    setUpdatingComplaint(complaintId);
    try {
      const res = await fetch("/api/complaints/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaintId,
          status: updateData.status,
          officerNote: updateData.officerNote,
          verificationImageUrl: updateData.verificationImageUrl
        }),
      });

      if (res.ok) {
        // Update local state
        setComplaints(prev => 
          prev.map(c => 
            c.id === complaintId 
              ? { ...c, status: updateData.status }
              : c
          )
        );
        
        // Reset form
        setUpdateData({ status: "", officerNote: "", verificationImageUrl: "" });
        setUpdatingComplaint(null);
        
        alert("Complaint updated successfully!");
      } else {
        alert("Failed to update complaint");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating complaint");
    } finally {
      setUpdatingComplaint(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
      case "RESOLVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return "bg-red-100 text-red-800";
    if (severity >= 3) return "bg-orange-100 text-orange-800";
    return "bg-green-100 text-green-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Assigned Complaints</h1>
        <p className="text-muted-foreground">Manage and update complaints assigned to you</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.length}</div>
            <p className="text-xs text-muted-foreground">Active cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {complaints.filter(c => c.status === "IN_PROGRESS").length}
            </div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {complaints.filter(c => c.status === "RESOLVED").length}
            </div>
            <p className="text-xs text-muted-foreground">Completed cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {complaints.filter(c => c.severity >= 4).length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{complaint.title}</h3>
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Severity: {complaint.severity}/5
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {complaint.author.name}
                    </span>
                  </div>
                </div>
                <Badge className={getSeverityColor(complaint.severity)}>
                  Level {complaint.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{complaint.description}</p>
              
              {complaint.imageUrl && (
                <div className="w-full max-w-md">
                  <img 
                    src={complaint.imageUrl} 
                    alt="Complaint evidence" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Update Status</label>
                  <Select value={updateData.status} onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Verification Photo</label>
                  <ImageUpload
                    value={updateData.verificationImageUrl}
                    onUpload={(url) => setUpdateData(prev => ({ ...prev, verificationImageUrl: url }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Officer Note</label>
                <Textarea
                  placeholder="Add your notes about the resolution..."
                  value={updateData.officerNote}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, officerNote: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleUpdateComplaint(complaint.id)}
                  disabled={updatingComplaint === complaint.id || !updateData.status || !updateData.officerNote}
                  className="gap-2"
                >
                  {updatingComplaint === complaint.id ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <>
                      Update Complaint
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
