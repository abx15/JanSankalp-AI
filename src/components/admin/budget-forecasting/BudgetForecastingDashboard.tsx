'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ResponsiveContainer 
} from 'recharts';
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
  Activity
} from 'lucide-react';

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
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
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
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  potentialSavings: number;
  implementationCost: number;
  roi: number;
  timeframe: string;
  status: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function BudgetForecastingDashboard() {
  const [forecasts, setForecasts] = useState<ForecastData[]>([]);
  const [demandSurges, setDemandSurges] = useState<DemandSurgeData[]>([]);
  const [optimizations, setOptimizations] = useState<CostOptimizationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('MONTHLY');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    fetchForecastData();
    fetchDemandSurgeData();
    fetchOptimizationData();
  }, [selectedPeriod, selectedDepartment]);

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/budget/forecast?periodType=${selectedPeriod}&periods=12`);
      const data = await response.json();
      
      if (data.success) {
        setForecasts(data.rawForecasts || []);
      }
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDemandSurgeData = async () => {
    try {
      const response = await fetch(`/api/budget/demand-surge?periodType=${selectedPeriod}&periods=6`);
      const data = await response.json();
      
      if (data.success) {
        setDemandSurges(data.rawPredictions || []);
      }
    } catch (error) {
      console.error('Error fetching demand surge data:', error);
    }
  };

  const fetchOptimizationData = async () => {
    try {
      const response = await fetch('/api/budget/optimization');
      const data = await response.json();
      
      if (data.success) {
        setOptimizations(data.rawSuggestions || []);
      }
    } catch (error) {
      console.error('Error fetching optimization data:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPredictedBudget = forecasts.reduce((sum, f) => sum + f.predictedAmount, 0);
  const avgConfidence = forecasts.length > 0 
    ? forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length 
    : 0;

  const costBreakdownData = forecasts.length > 0 ? [
    {
      name: 'Personnel',
      value: forecasts.reduce((sum, f) => sum + f.breakdown.personnelCost, 0),
    },
    {
      name: 'Infrastructure',
      value: forecasts.reduce((sum, f) => sum + f.breakdown.infrastructureCost, 0),
    },
    {
      name: 'Operational',
      value: forecasts.reduce((sum, f) => sum + f.breakdown.operationalCost, 0),
    },
    {
      name: 'Emergency Fund',
      value: forecasts.reduce((sum, f) => sum + f.breakdown.emergencyFund, 0),
    },
  ] : [];

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
          <p className="text-gray-600">Predictive analytics for infrastructure spending optimization</p>
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
            <CardTitle className="text-sm font-medium">Total Predicted Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPredictedBudget)}</div>
            <p className="text-xs text-muted-foreground">
              Next {selectedPeriod.toLowerCase()} period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgConfidence * 100).toFixed(1)}%</div>
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
            <CardTitle className="text-sm font-medium">Optimization Opportunities</CardTitle>
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
                <CardDescription>Predicted vs Actual spending over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={forecasts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
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
                <CardDescription>Distribution of predicted expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
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
                        <p key={i} className="text-sm text-gray-600">• {insight}</p>
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
                      <span className="text-sm font-medium">{(surge.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Estimated Complaints:</span>
                      <span className="text-sm font-medium">{surge.estimatedComplaints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Estimated Cost:</span>
                      <span className="text-sm font-medium">{formatCurrency(surge.estimatedCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Period:</span>
                      <span className="text-sm font-medium">
                        {new Date(surge.predictedStart).toLocaleDateString()} - {new Date(surge.predictedEnd).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Contributing Factors:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {surge.factors.map((factor, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
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
                      <span className="text-sm text-gray-600">Potential Savings:</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(opt.potentialSavings)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Implementation Cost:</span>
                      <span className="text-sm font-medium">{formatCurrency(opt.implementationCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ROI:</span>
                      <span className="text-sm font-medium">{opt.roi.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Timeframe:</span>
                      <span className="text-sm font-medium">{opt.timeframe.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge variant={opt.status === 'PROPOSED' ? 'secondary' : 'default'}>
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
          <Card>
            <CardHeader>
              <CardTitle>What-If Scenario Simulator</CardTitle>
              <CardDescription>Model different budget scenarios and their impacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Scenario Simulator</h3>
                <p className="text-gray-600 mb-4">
                  Create and test different budget scenarios to understand potential impacts
                </p>
                <Button>Create New Scenario</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
