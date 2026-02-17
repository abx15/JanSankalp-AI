"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users, Shield, UserCheck, Mail, Phone, MapPin, Calendar, Ban, CheckCircle, XCircle, Edit, Trash2, RefreshCw, UserPlus, Filter } from "lucide-react";
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

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    officers: 0,
    citizens: 0,
    verified: 0,
    unverified: 0,
    activeToday: 0,
    blocked: 0
  });

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      return;
    }
    fetchUsers();
  }, [session]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        const userList = data.users || data;
        setUsers(userList);
        calculateStats(userList);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userList: User[]) => {
    const today = new Date().toDateString();
    setStats({
      total: userList.length,
      admins: userList.filter(u => u.role === "ADMIN").length,
      officers: userList.filter(u => u.role === "OFFICER").length,
      citizens: userList.filter(u => u.role === "CITIZEN").length,
      verified: userList.filter(u => u.emailVerified).length,
      unverified: userList.filter(u => !u.emailVerified).length,
      activeToday: userList.filter(u => new Date(u.createdAt).toDateString() === today).length,
      blocked: userList.filter(u => u.email.startsWith("blocked_")).length
    });
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "verified") {
        filtered = filtered.filter(user => user.emailVerified);
      } else if (statusFilter === "unverified") {
        filtered = filtered.filter(user => !user.emailVerified);
      } else if (statusFilter === "blocked") {
        filtered = filtered.filter(user => user.email.startsWith("blocked_"));
      }
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId: string, action: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, action }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`${action} action completed:`, data);
        
        if (action === "delete") {
          setUsers(users.filter(u => u.id !== userId));
        } else {
          // Refresh users list for other actions
          await fetchUsers();
        }
      } else {
        const error = await response.json();
        console.error("Action failed:", error.error);
        alert(`Action failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Action error:", error);
      alert("Action failed. Please try again.");
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

  const getStatusBadge = (user: User) => {
    if (user.email.startsWith("blocked_")) {
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
        <Ban className="w-3 h-3 mr-1" /> Blocked
      </span>;
    }
    if (user.emailVerified) {
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" /> Active
      </span>;
    }
    return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800">
      <XCircle className="w-3 h-3 mr-1" /> Pending
    </span>;
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
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage and monitor all registered users</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => window.location.href = '/auth/signup'} size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{stats.activeToday} joined today</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">{stats.admins}</p>
                <p className="text-xs text-muted-foreground">System admins</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Officers</p>
                <p className="text-2xl font-bold">{stats.officers}</p>
                <p className="text-xs text-muted-foreground">Department heads</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Citizens</p>
                <p className="text-2xl font-bold">{stats.citizens}</p>
                <p className="text-xs text-muted-foreground">Regular users</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Status Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
                <p className="text-xs text-muted-foreground">Email verified</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.unverified}</p>
                <p className="text-xs text-muted-foreground">Email not verified</p>
              </div>
              <XCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
                <p className="text-xs text-muted-foreground">Access blocked</p>
              </div>
              <Ban className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="OFFICER">Officer</option>
              <option value="CITIZEN">Citizen</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table with CRUD Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
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
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Complaints</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
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
                        <div className="space-y-1">
                          {user.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {user.emailVerified ? "Verified" : "Not Verified"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.address ? (
                          <div className="flex items-center gap-1 text-sm max-w-48 truncate">
                            <MapPin className="w-3 h-3" />
                            {user.address}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No address</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{user.points}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{user._count.complaints}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {/* Verify/Unverify Email */}
                          {user.emailVerified ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, "unverify_email")}
                              disabled={actionLoading === user.id || user.role === "ADMIN"}
                              title="Unverify Email"
                            >
                              <XCircle className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, "verify_email")}
                              disabled={actionLoading === user.id}
                              title="Verify Email"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          )}

                          {/* Change Role */}
                          <select
                            value={user.role}
                            onChange={(e) => handleUserAction(user.id, `make_${e.target.value}`)}
                            disabled={actionLoading === user.id || user.id === session?.user?.id}
                            className="text-xs px-2 py-1 border rounded"
                            title="Change Role"
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="OFFICER">Officer</option>
                            <option value="CITIZEN">Citizen</option>
                          </select>

                          {/* Block/Unblock */}
                          <Button
                            size="sm"
                            variant={user.email.startsWith("blocked_") ? "outline" : "destructive"}
                            onClick={() => handleUserAction(user.id, user.email.startsWith("blocked_") ? "unblock" : "block")}
                            disabled={actionLoading === user.id || user.role === "ADMIN"}
                            title={user.email.startsWith("blocked_") ? "Unblock User" : "Block User"}
                          >
                            <Ban className="w-3 h-3" />
                          </Button>

                          {/* Delete */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${user.name || user.email}?`)) {
                                handleUserAction(user.id, "delete");
                              }
                            }}
                            disabled={actionLoading === user.id || user.role === "ADMIN"}
                            title="Delete User"
                          >
                            <Trash2 className="w-3 h-3" />
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
                    {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                      ? "Try adjusting your filters"
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
