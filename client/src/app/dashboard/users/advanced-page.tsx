"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, Users, Shield, UserCheck, Mail, Phone, MapPin, Calendar, 
  Ban, Eye, EyeOff, Edit, Trash2, CheckCircle, XCircle,
  BarChart3, TrendingUp, UserPlus, Activity, AlertCircle
} from "lucide-react";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "OFFICER" | "CITIZEN";
  emailVerified: Date | null;
  phone: string | null;
  address: string | null;
  points: number;
  createdAt: string;
  _count: {
    complaints: number;
  };
}

interface Stats {
  overview: {
    totalUsers: number;
    totalAdmins: number;
    totalOfficers: number;
    totalCitizens: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    totalComplaints: number;
    pendingComplaints: number;
    inProgressComplaints: number;
    resolvedComplaints: number;
    rejectedComplaints: number;
    recentLogins: number;
    newUsersThisMonth: number;
    activeUsersLast7Days: number;
  };
  departments: Array<{
    id: string;
    name: string;
    complaintsCount: number;
    head: string | null;
  }>;
}

export default function AdvancedUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      return;
    }
    fetchUsers();
    fetchStats();
  }, [session]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const performUserAction = async (userId: string, action: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        await fetchUsers();
        await fetchStats();
        setSelectedUser(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Action failed');
      }
    } catch (error) {
      console.error('Action failed:', error);
      alert('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      ADMIN: "bg-red-100 text-red-800",
      OFFICER: "bg-blue-100 text-blue-800", 
      CITIZEN: "bg-gray-100 text-gray-800"
    };
    return variants[role as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN": return <Shield className="w-4 h-4" />;
      case "OFFICER": return <UserCheck className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You need admin privileges to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SuperAdmin Dashboard</h1>
          <p className="text-muted-foreground">Advanced user management and system statistics</p>
        </div>
      </div>

      {/* Statistics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.overview.totalUsers}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{stats.overview.newUsersThisMonth} this month
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verified Users</p>
                  <p className="text-2xl font-bold">{stats.overview.verifiedUsers}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.overview.unverifiedUsers} unverified
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Today</p>
                  <p className="text-2xl font-bold">{stats.overview.recentLogins}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.overview.activeUsersLast7Days} last 7 days
                  </p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                  <p className="text-2xl font-bold">{stats.overview.totalComplaints}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.overview.pendingComplaints} pending
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {users.length} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Complaints</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <div className="font-medium">{user.name || "Unknown"}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.emailVerified ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm">Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm">Not Verified</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {user.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{user.points}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{user._count.complaints}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* Verify/Unverify Email */}
                          {user.emailVerified ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => performUserAction(user.id, 'unverify_email')}
                              disabled={actionLoading === user.id || user.role === 'ADMIN'}
                              title="Unverify Email"
                            >
                              <EyeOff className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => performUserAction(user.id, 'verify_email')}
                              disabled={actionLoading === user.id}
                              title="Verify Email"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}

                          {/* Block/Unblock */}
                          {user.emailVerified ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => performUserAction(user.id, 'block')}
                              disabled={actionLoading === user.id || user.role === 'ADMIN'}
                              title="Block User"
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => performUserAction(user.id, 'unblock')}
                              disabled={actionLoading === user.id}
                              title="Unblock User"
                            >
                              <UserPlus className="w-4 h-4" />
                            </Button>
                          )}

                          {/* Change Role */}
                          <select
                            className="text-xs border rounded px-2 py-1"
                            value={user.role}
                            onChange={(e) => {
                              const action = e.target.value === 'ADMIN' ? 'make_admin' :
                                           e.target.value === 'OFFICER' ? 'make_officer' : 'make_citizen';
                              performUserAction(user.id, action);
                            }}
                            disabled={actionLoading === user.id || user.id === session?.user?.id}
                          >
                            <option value="CITIZEN">Citizen</option>
                            <option value="OFFICER">Officer</option>
                            <option value="ADMIN">Admin</option>
                          </select>

                          {/* Delete User */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${user.name || user.email}?`)) {
                                performUserAction(user.id, 'delete');
                              }
                            }}
                            disabled={actionLoading === user.id || user.role === 'ADMIN'}
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "No users have registered yet"}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
