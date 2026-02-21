'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BudgetForecastingDashboard from "@/components/admin/budget-forecasting/BudgetForecastingDashboard";

export default function BudgetForecastingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      router.push("/login");
      return;
    }

    // Check if user has admin privileges
    if (!["ADMIN", "STATE_ADMIN", "DISTRICT_ADMIN"].includes(session.user?.role || "")) {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || !["ADMIN", "STATE_ADMIN", "DISTRICT_ADMIN"].includes(session.user?.role || "")) {
    return null;
  }

  return <BudgetForecastingDashboard />;
}
