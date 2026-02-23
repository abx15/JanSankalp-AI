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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            User Directory
          </h2>
          <p className="text-muted-foreground mt-1 font-medium">
            Manage citizen access and governance permissions across the
            platform.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-soft group hover:border-primary/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Total Citizens
          </p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            2,543
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-soft group hover:border-secondary/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/5 text-secondary flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Verified Rate
          </p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            98%
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-soft group hover:border-primary/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Active Officers
          </p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">42</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[1px] shadow-soft hover:shadow-lg transition-all">
          <div className="bg-white rounded-[calc(1rem-1px)] p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Daily Growth
            </p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              +12
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <UserListTable />
      </div>
    </div>
  );
}
