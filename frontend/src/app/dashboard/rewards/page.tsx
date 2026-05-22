"use client";

import { useSession } from "next-auth/react";
import {
  Trophy,
  Gift,
  Zap,
  ArrowUpRight,
  ChevronRight,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RewardsPage() {
  const { data: session } = useSession();
  // @ts-ignore
  const points = session?.user?.points || 0;

  const rewards = [
    {
      title: "Property Tax Rebate",
      description: "Get 5% off your annual property tax.",
      cost: 5000,
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      category: "Municipal",
    },
    {
      title: "Public Transport Pass",
      description: "Unlimited metro rides for 24 hours.",
      cost: 1000,
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      category: "Transport",
    },
    {
      title: "Community Center Voucher",
      description: "Free access to community gym for a month.",
      cost: 2000,
      icon: <Gift className="w-6 h-6 text-purple-500" />,
      category: "Leisure",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Citizen Rewards
          </h1>
          <p className="text-muted-foreground">
            Convert your civic contributions into local benefits.
          </p>
        </div>
        <div className="bg-primary text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-primary/20">
          <Trophy className="w-5 h-5" />
          <span className="text-xl font-black">{points} Points</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward, i) => (
          <Card
            key={i}
            className="border-none shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
              {reward.icon}
            </div>
            <CardHeader>
              <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {reward.category}
              </div>
              <CardTitle className="text-xl font-black tracking-tight">
                {reward.title}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {reward.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Requirement
                  </span>
                  <span className="text-lg font-black text-primary">
                    {reward.cost} Pts
                  </span>
                </div>
                <Button
                  disabled={points < reward.cost}
                  className="rounded-full font-bold group"
                >
                  Redeem{" "}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
        <CardHeader>
          <CardTitle className="text-2xl font-black">How it works?</CardTitle>
          <CardDescription className="text-muted-foreground/60">
            Your points are a reflection of your commitment to the city.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-8 py-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-primary">
              1
            </div>
            <h4 className="font-bold">Report Issues</h4>
            <p className="text-xs text-slate-400">
              File city reports with photos and accurate locations.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-primary">
              2
            </div>
            <h4 className="font-bold">Admin Verification</h4>
            <p className="text-xs text-slate-400">
              Earn points once your report is verified by city officials.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-primary">
              3
            </div>
            <h4 className="font-bold">Redeem Benefits</h4>
            <p className="text-xs text-muted-foreground/60">
              Spend points on municipal discounts and travel passes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
