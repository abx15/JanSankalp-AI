"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm"
          >
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-32 bg-muted/60 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Skeleton */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden">
          <CardHeader>
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-xl" />
          </CardContent>
        </Card>

        {/* Right Panel Skeleton */}
        <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden">
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-20 bg-muted/60 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden">
          <CardContent className="p-6">
            <div className="h-6 w-40 bg-muted animate-pulse rounded mb-6" />
            <div className="h-[200px] w-full bg-muted/20 animate-pulse rounded-xl" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden">
          <CardContent className="p-6">
            <div className="h-6 w-40 bg-muted animate-pulse rounded mb-6" />
            <div className="h-[200px] w-full bg-muted/20 animate-pulse rounded-xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
