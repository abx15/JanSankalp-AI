"use client";

import { useState, useEffect, useCallback } from "react";
import { pusherClient } from "@/lib/pusher-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Search,
  UserPlus,
  Shield,
  ShieldAlert,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  ArrowUpDown,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
  emailVerified: string | null;
  _count: {
    complaints: number;
  };
}

export function UserListTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        role: roleFilter,
        limit: "100",
      });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  // Real-time updates via Pusher
  useEffect(() => {
    const channel = pusherClient.subscribe("governance-channel");

    const handleUpdate = () => {
      fetchUsers();
    };

    channel.bind("user-registered", handleUpdate);
    channel.bind("user-updated", handleUpdate);
    channel.bind("user-deleted", handleUpdate);

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("governance-channel");
    };
  }, [fetchUsers]);

  const handleAction = async (userId: string, action: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({ userId, action }),
      });

      if (res.ok) {
        toast.success(`User updated successfully`);
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none font-bold gap-1">
            <ShieldAlert className="w-3 h-3" /> ADMIN
          </Badge>
        );
      case "OFFICER":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none font-bold gap-1">
            <Shield className="w-3 h-3" /> OFFICER
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-bold gap-1">
            <UserIcon className="w-3 h-3" /> CITIZEN
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="bg-background border rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admins</option>
            <option value="OFFICER">Officers</option>
            <option value="CITIZEN">Citizens</option>
          </select>
          <Button variant="outline" className="rounded-xl font-bold gap-2">
            Export CSV
          </Button>
        </div>
      </div>

      <div className="border rounded-2xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-black text-[10px] uppercase tracking-wider pl-6 text-muted-foreground/70">
                User Profile
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Role
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Reports
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Joined Date
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Status
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-right pr-6 text-muted-foreground/70">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell
                    colSpan={6}
                    className="h-16 animate-pulse bg-muted/5"
                  />
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground font-bold"
                >
                  No users found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shadow-sm">
                        {user.name?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">
                          {user.name || "Anonymous User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="rounded-md font-black text-[10px]"
                      >
                        {user._count.complaints} FILED
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-medium text-muted-foreground">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </p>
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <Badge className="bg-green-500/10 text-green-600 border-none font-bold text-[10px]">
                        VERIFIED
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-500/10 text-orange-600 border-none font-bold text-[10px]">
                        PENDING
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-[200px] rounded-xl shadow-xl border-muted"
                      >
                        <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground/60">
                          Manage User
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleAction(user.id, "verify_email")}
                          className="font-bold text-xs gap-2 py-2.5"
                        >
                          <Mail className="w-3.5 h-3.5" /> Mark Verified
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-muted-foreground/60">
                          Change Role
                        </DropdownMenuLabel>
                        {user.role !== "ADMIN" && (
                          <DropdownMenuItem
                            onClick={() => handleAction(user.id, "make_admin")}
                            className="font-bold text-xs gap-2 py-2.5 text-red-600"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" /> Promote to
                            Admin
                          </DropdownMenuItem>
                        )}
                        {user.role !== "OFFICER" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction(user.id, "make_officer")
                            }
                            className="font-bold text-xs gap-2 py-2.5 text-blue-600"
                          >
                            <Shield className="w-3.5 h-3.5" /> Make Officer
                          </DropdownMenuItem>
                        )}
                        {user.role !== "CITIZEN" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction(user.id, "make_citizen")
                            }
                            className="font-bold text-xs gap-2 py-2.5"
                          >
                            <UserIcon className="w-3.5 h-3.5" /> Demote to
                            Citizen
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleAction(user.id, "delete")}
                          className="font-bold text-xs gap-2 py-2.5 text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
