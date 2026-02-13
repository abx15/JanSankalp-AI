"use client";

import { useEffect, useState } from "react";
import { Building2, Users, ArrowUpRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-balance">
            Departments & Triage
          </h1>
          <p className="text-muted-foreground">
            Manage administrative structures and assignment logic.
          </p>
        </div>
        <Button className="gap-2 rounded-full shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Add Department
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Filter departments..."
          className="pl-10 rounded-xl"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card
            key={dept.id}
            className="hover:border-primary/30 transition-all group overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">{dept.name}</CardTitle>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Building2 className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" /> Head:
                  </span>
                  <span className="font-bold text-foreground">
                    {dept.head?.name || "Unassigned"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Issues:</span>
                  <span className="font-black text-primary">
                    {dept._count?.complaints || 0}
                  </span>
                </div>
                <div className="pt-4 border-t flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:text-primary transition-colors gap-1"
                  >
                    Manage <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {departments.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed">
            No departments indexed. Run seed script to initialize.
          </div>
        )}
      </div>
    </div>
  );
}
