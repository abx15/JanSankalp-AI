"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { UserListTable } from "@/components/admin/UserListTable";
import { Users, UserCheck, ShieldCheck, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-muted-foreground">
            Authenticating Governance Access...
          </p>
        </div>
      </div>
    );

  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-primary">
            Identity & Access Management
          </h2>
          <p className="text-muted-foreground mt-1 font-medium">
            Monitor user registrations and manage governance permissions in
            real-time.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-primary/5 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Total Citizens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black">2,543</div>
              <Users className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-green-500/5 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Verified Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-green-600">98%</div>
              <UserCheck className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-blue-500/5 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Active Officers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-blue-600">42</div>
              <ShieldCheck className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-orange-500/5 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Daily Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-orange-600">+12</div>
              <TrendingUp className="w-8 h-8 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <UserListTable />
    </div>
  );
}
