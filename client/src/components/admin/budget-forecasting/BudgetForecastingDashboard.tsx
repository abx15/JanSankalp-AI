"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Users,
  Building,
  Settings,
  Zap,
  Target,
  Shield,
  Activity,
  Sliders,
} from "lucide-react";

// ── What-If Simulator inner component ──────────────────────────────────────
function WhatIfSimulator({
  forecasts,
  formatCurrency,
}: {
  forecasts: ForecastData[];
  formatCurrency: (v: number) => string;
}) {
  const [complaintVolume, setComplaintVolume] = useState(100);
  const [emergencyEvents, setEmergencyEvents] = useState(3);
  const [seasonMultiplier, setSeasonMultiplier] = useState(1.0);

  const simulated = forecasts.map((f) => ({
    period: f.period,
    baseline: f.predictedAmount,
    simulated: Math.round(
      f.predictedAmount *
        (complaintVolume / 100) *
        (1 + emergencyEvents * 0.04) *
        seasonMultiplier,
    ),
  }));

  const simTotal = simulated.reduce((s, f) => s + f.simulated, 0);
  const baseTotal = simulated.reduce((s, f) => s + f.baseline, 0);
  const delta = simTotal - baseTotal;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" /> Scenario Controls
          </CardTitle>
          <CardDescription>
            Adjust parameters and see instant budget impact
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Complaint Volume */}
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="font-semibold">Complaint Volume</span>
              <Badge variant="secondary">{complaintVolume}%</Badge>
            </div>
            <input
              type="range"
              min={50}
              max={200}
              value={complaintVolume}
              onChange={(e) => setComplaintVolume(+e.target.value)}
              className="w-full accent-indigo-600 h-2 rounded-lg"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>50% (Low)</span>
              <span>100% (Normal)</span>
              <span>200% (Surge)</span>
            </div>
          </div>
          {/* Emergency Events */}
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="font-semibold">Emergency Events / Month</span>
              <Badge variant="secondary">{emergencyEvents}</Badge>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              value={emergencyEvents}
              onChange={(e) => setEmergencyEvents(+e.target.value)}
              className="w-full accent-orange-500 h-2 rounded-lg"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 (None)</span>
              <span>6 (Moderate)</span>
              <span>12 (High)</span>
            </div>
          </div>
          {/* Seasonal Multiplier */}
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="font-semibold">Seasonal Multiplier</span>
              <Badge variant="secondary">{seasonMultiplier.toFixed(1)}×</Badge>
            </div>
            <input
              type="range"
              min={0.8}
              max={1.6}
              step={0.1}
              value={seasonMultiplier}
              onChange={(e) => setSeasonMultiplier(+e.target.value)}
              className="w-full accent-emerald-600 h-2 rounded-lg"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0.8× (Off-peak)</span>
              <span>1.0× (Normal)</span>
              <span>1.6× (Monsoon)</span>
            </div>
          </div>
          {/* Result Panel */}
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Simulated Total ({forecasts.length} periods)
            </p>
            <p className="text-3xl font-black text-indigo-700 dark:text-indigo-300">
              {formatCurrency(simTotal)}
            </p>
            <p
              className={`text-sm mt-1 font-semibold ${delta >= 0 ? "text-orange-600" : "text-green-600"}`}
            >
              {delta >= 0 ? "▲" : "▼"} {formatCurrency(Math.abs(delta))} vs
              baseline
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Scenario Projection</CardTitle>
          <CardDescription>
            Baseline vs simulated budget trajectory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart
              data={simulated}
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} />
              <YAxis
                tickFormatter={(v) => `₹${(v / 1000000).toFixed(1)}M`}
                tick={{ fontSize: 11 }}
                width={70}
              />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Legend />
              <Area
                type="monotone"
                dataKey="baseline"
                name="Baseline"
                stroke="#8884d8"
                strokeWidth={2}
                fill="none"
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="simulated"
                name="Simulated"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#simGrad)"
                dot={{ r: 4, fill: "#f59e0b" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
// ──────────────────────────────────────────────────────────────────────────

interface ForecastData {
  period: string;
  predictedAmount: number;
  actualAmount?: number;
  confidence: number;
  breakdown: {
    personnelCost: number;
    infrastructureCost: number;
    operationalCost: number;
    emergencyFund: number;
  };
  insights: string[];
  riskFactors: string[];
  recommendations: string[];
}

interface DemandSurgeData {
  id: string;
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  predictedStart: string;
  predictedEnd: string;
  confidence: number;
  estimatedComplaints: number;
  estimatedCost: number;
  factors: string[];
}

interface CostOptimizationData {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  potentialSavings: number;
  implementationCost: number;
  roi: number;
  timeframe: string;
  status: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function BudgetForecastingDashboard() {
  const [forecasts, setForecasts] = useState<ForecastData[]>([]);
  const [demandSurges, setDemandSurges] = useState<DemandSurgeData[]>([]);
  const [optimizations, setOptimizations] = useState<CostOptimizationData[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("MONTHLY");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchForecastData();
    fetchDemandSurgeData();
    fetchOptimizationData();
  }, [selectedPeriod, selectedDepartment]);

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/budget/forecast?periodType=${selectedPeriod}&periods=12`,
      );
      const data = await response.json();

      if (data.success) {
        setForecasts(data.rawForecasts || []);
      }
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDemandSurgeData = async () => {
    try {
      const response = await fetch(
        `/api/budget/demand-surge?periodType=${selectedPeriod}&periods=6`,
      );
      const data = await response.json();

      if (data.success) {
        setDemandSurges(data.rawPredictions || []);
      }
    } catch (error) {
      console.error("Error fetching demand surge data:", error);
    }
  };

  const fetchOptimizationData = async () => {
    try {
      const response = await fetch("/api/budget/optimization");
      const data = await response.json();

      if (data.success) {
        setOptimizations(data.rawSuggestions || []);
      }
    } catch (error) {
      console.error("Error fetching optimization data:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPredictedBudget = forecasts.reduce(
    (sum, f) => sum + f.predictedAmount,
    0,
  );
  const avgConfidence =
    forecasts.length > 0
      ? forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length
      : 0;

  const costBreakdownData =
    forecasts.length > 0
      ? [
          {
            name: "Personnel",
            value: forecasts.reduce(
              (sum, f) => sum + f.breakdown.personnelCost,
              0,
            ),
          },
          {
            name: "Infrastructure",
            value: forecasts.reduce(
              (sum, f) => sum + f.breakdown.infrastructureCost,
              0,
            ),
          },
          {
            name: "Operational",
            value: forecasts.reduce(
              (sum, f) => sum + f.breakdown.operationalCost,
              0,
            ),
          },
          {
            name: "Emergency Fund",
            value: forecasts.reduce(
              (sum, f) => sum + f.breakdown.emergencyFund,
              0,
            ),
          },
        ]
      : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Budget Forecasting</h1>
          <p className="text-gray-600">
            Predictive analytics for infrastructure spending optimization
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="ANNUAL">Annual</option>
          </select>
          <Button onClick={fetchForecastData}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Predicted Budget
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalPredictedBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              Next {selectedPeriod.toLowerCase()} period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Model Confidence
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(avgConfidence * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average prediction accuracy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Surges</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demandSurges.length}</div>
            <p className="text-xs text-muted-foreground">
              Predicted in next 6 months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Optimization Opportunities
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimizations.length}</div>
            <p className="text-xs text-muted-foreground">
              Cost reduction suggestions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forecast" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forecast">Budget Forecast</TabsTrigger>
          <TabsTrigger value="demand">Demand Surges</TabsTrigger>
          <TabsTrigger value="optimization">Cost Optimization</TabsTrigger>
          <TabsTrigger value="scenarios">What-If Scenarios</TabsTrigger>
        </TabsList>

        {/* Budget Forecast Tab */}
        <TabsContent value="forecast" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Forecast Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Forecast Trend</CardTitle>
                <CardDescription>
                  Predicted vs Actual spending over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={forecasts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis
                      tickFormatter={(value) =>
                        `₹${(value / 1000000).toFixed(1)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="predictedAmount"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Predicted"
                    />
                    <Line
                      type="monotone"
                      dataKey="actualAmount"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Actual"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>
                  Distribution of predicted expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costBreakdownData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {forecasts.slice(0, 3).map((forecast, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold">{forecast.period}</h4>
                    <div className="space-y-1">
                      {forecast.insights.slice(0, 2).map((insight, i) => (
                        <p key={i} className="text-sm text-gray-600">
                          • {insight}
                        </p>
                      ))}
                    </div>
                    {forecast.riskFactors.length > 0 && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-orange-600">
                          {forecast.riskFactors.length} Risk Factors
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demand Surges Tab */}
        <TabsContent value="demand" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {demandSurges.map((surge) => (
              <Card key={surge.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{surge.title}</CardTitle>
                    <Badge className={getSeverityColor(surge.severity)}>
                      {surge.severity}
                    </Badge>
                  </div>
                  <CardDescription>{surge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <span className="text-sm font-medium">
                        {(surge.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Estimated Complaints:
                      </span>
                      <span className="text-sm font-medium">
                        {surge.estimatedComplaints}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Estimated Cost:
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(surge.estimatedCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Period:</span>
                      <span className="text-sm font-medium">
                        {new Date(surge.predictedStart).toLocaleDateString()} -{" "}
                        {new Date(surge.predictedEnd).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Contributing Factors:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {surge.factors.map((factor, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cost Optimization Tab */}
        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {optimizations.map((opt) => (
              <Card key={opt.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{opt.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(opt.priority)}>
                        {opt.priority}
                      </Badge>
                      <Badge variant="outline">{opt.category}</Badge>
                    </div>
                  </div>
                  <CardDescription>{opt.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Potential Savings:
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(opt.potentialSavings)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Implementation Cost:
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(opt.implementationCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ROI:</span>
                      <span className="text-sm font-medium">
                        {opt.roi.toFixed(2)}x
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Timeframe:</span>
                      <span className="text-sm font-medium">
                        {opt.timeframe.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge
                        variant={
                          opt.status === "PROPOSED" ? "secondary" : "default"
                        }
                      >
                        {opt.status}
                      </Badge>
                    </div>
                    <div className="pt-2">
                      <Button size="sm" className="w-full">
                        Review Implementation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* What-If Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-4">
          <WhatIfSimulator
            forecasts={forecasts}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
