"use client";

import { useEffect, useState } from "react";
import { Building2, Users, ArrowUpRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DepartmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    // @ts-ignore
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data || []));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">
            Departments & Triage
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Administrative structures and algorithmic assignment logic.
          </p>
        </div>
        <Button className="rounded-xl font-bold gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" /> Initialize Department
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search active sectors..."
          className="pl-10 rounded-xl bg-card border-border/50 focus:border-primary/50 transition-all font-medium"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card
            key={dept.id}
            className="hover:shadow-2xl hover:border-primary/20 transition-all group overflow-hidden border-t-4 border-t-primary/50 relative bg-card"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Building2 className="w-24 h-24" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-4 w-fit">
                  <Building2 className="w-6 h-6" />
                </div>
                {dept._count?.complaints > 5 && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 px-2 py-1 rounded border border-red-500/10 animate-pulse">
                    High Load
                  </span>
                )}
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">
                {dept.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-transparent group-hover:border-primary/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border text-muted-foreground">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Head of Dept.
                    </p>
                    <p className="font-bold text-sm text-foreground">
                      {dept.head?.name || "Unassigned"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">
                      Active
                    </p>
                    <p className="text-2xl font-black text-blue-700">
                      {dept._count?.complaints || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1">
                      Efficiency
                    </p>
                    <p className="text-2xl font-black text-green-700">92%</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between group/btn hover:bg-primary hover:text-primary-foreground transition-all rounded-xl font-bold"
                  >
                    Manage Sector{" "}
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {departments.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/20 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4">
            <Building2 className="w-16 h-16 opacity-10" />
            <p className="font-bold">
              No departments indexed. Run seed script to initialize.
            </p>
            <Button variant="outline" className="font-bold">
              Generate Default Sectors
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
