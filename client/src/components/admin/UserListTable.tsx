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
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold">
            <ShieldAlert className="w-3 h-3" /> ADMIN
          </div>
        );
      case "OFFICER":
        return (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
            <Shield className="w-3 h-3" /> OFFICER
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">
            <UserIcon className="w-3 h-3" /> CITIZEN
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search users..."
            className="pl-11 h-11 rounded-xl border-slate-200 bg-white focus:bg-white focus:border-primary/30 focus:ring-primary/5 transition-all text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all cursor-pointer"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Every Role</option>
            <option value="ADMIN">Admins</option>
            <option value="OFFICER">Officers</option>
            <option value="CITIZEN">Citizens</option>
          </select>
          <Button
            variant="outline"
            className="rounded-xl h-11 px-5 border-slate-200 font-semibold gap-2 hover:bg-slate-50 transition-all active:scale-95 text-sm"
          >
            Export CSV
          </Button>
        </div>
      </div>

      <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-soft">
        <Table>
          <TableHeader className="bg-slate-50/80 border-b border-slate-100">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-semibold text-[10px] uppercase tracking-wider pl-6 h-12 text-slate-500">
                Identity Profile
              </TableHead>
              <TableHead className="font-semibold text-[10px] uppercase tracking-wider h-12 text-slate-500">
                Governance Role
              </TableHead>
              <TableHead className="font-semibold text-[10px] uppercase tracking-wider h-12 text-slate-500">
                Engagement
              </TableHead>
              <TableHead className="font-semibold text-[10px] uppercase tracking-wider h-12 text-slate-500">
                Registration
              </TableHead>
              <TableHead className="font-semibold text-[10px] uppercase tracking-wider h-12 text-slate-500">
                Status
              </TableHead>
              <TableHead className="font-semibold text-[10px] uppercase tracking-wider text-right pr-6 h-12 text-slate-500">
                Administrative
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
                  <TableCell className="pl-6 py-5">
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        {user.name?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[13px] text-slate-900 truncate mb-0.5">
                          {user.name || "Anonymous Citizen"}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-bold border border-slate-100">
                      {user._count.complaints} REPORTS
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-[12px] font-medium text-slate-500">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </p>
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <div className="inline-flex items-center gap-1.5 text-green-600 font-bold text-[10px] uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Verified
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-orange-500 font-bold text-[10px] uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        Pending
                      </div>
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
