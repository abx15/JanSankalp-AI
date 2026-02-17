"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users, Shield, UserCheck, Mail, Phone, MapPin, Calendar } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      return;
    }
    fetchUsers();
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

  const filteredUsers = users.filter(user => {
    const ma=anesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(se=rchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
    cae "trrl
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">Manage and monitor all registered users</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{users.length} total users</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cosls-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="fitems-center lex i  ex<-smvtx-mutd-foegd
           Us < ssName="text-sm fonium text-muted-foreground">Total Users</p>
           spaivNusers t0ngtota oCaspa
        
        <Card>
          <CardContent className="pt-6">
         lassName="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === "ADMIN").length}</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>ulgh}

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Officers</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === "OFFICER").length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>uerftr(u >.rl === "ADMIN).lgth}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Citizens</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === "CITIZEN").length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>uerlt(u =u.ro == OFFICER).lg}
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>uerft(Cie.t=CITIZENb).s2e".h
          ) : (
            <diUrl e    <TableHep  n"{
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
          S/aTchbleCell>
                      <TableCell>
                        <div classNa
                          assName="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div> or
                        )}
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {user.emailVerified ? "Verified" : "Not Verified"}
            m  
                   <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                      .createdAt).toLocaleDateString()}
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
<pn{`inline-fpx-2.5py-0.5ttxsot-sbod$bg-ge-100tx-gn-800:"-gay-100xt-gy800}`}{r.eVerfid?":"P"/pnTbCl><Tb><vfls-ceg-1x-x-m-fgd><CwDcA.caSig()}sach