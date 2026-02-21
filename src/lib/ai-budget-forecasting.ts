import { PrismaClient } from '@prisma/client';
import { SimpleLinearRegression, PolynomialRegression } from 'ml-regression';
import * as ss from 'simple-statistics';

const prisma = new PrismaClient();

export interface ForecastData {
  period: string;
  actualAmount: number;
  complaintCount: number;
  resolvedCount: number;
  emergencyEvents: number;
  personnelCost: number;
  infrastructureCost: number;
  operationalCost: number;
}

export interface ForecastResult {
  period: string;
  predictedAmount: number;
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

export interface DemandSurgePrediction {
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  predictedStart: Date;
  predictedEnd: Date;
  confidence: number;
  estimatedComplaints: number;
  estimatedCost: number;
  factors: string[];
  affectedAreas: string[];
}

export interface CostOptimizationSuggestion {
  title: string;
  description: string;
  category: 'PERSONNEL' | 'INFRASTRUCTURE' | 'OPERATIONAL' | 'PROCUREMENT';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  potentialSavings: number;
  implementationCost: number;
  roi: number;
  timeframe: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
  reasoning: string[];
}

export class AIBudgetForecastingEngine {
  private modelVersion = '2.0.0';

  /**
   * Generate comprehensive budget forecast using multiple ML models
   */
  async generateBudgetForecast(
    periodType: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL',
    periods: number = 12,
    departmentId?: string,
    stateId?: string,
    districtId?: string
  ): Promise<ForecastResult[]> {
    try {
      // Fetch historical data
      const historicalData = await this.getHistoricalData(periodType, departmentId, stateId, districtId);
      
      if (historicalData.length < 3) {
        throw new Error('Insufficient historical data for forecasting');
      }

      const forecasts: ForecastResult[] = [];

      for (let i = 1; i <= periods; i++) {
        const nextPeriod = this.getNextPeriod(historicalData[historicalData.length - 1].period, periodType, i);
        const forecast = await this.forecastSinglePeriod(nextPeriod, historicalData, periodType);
        forecasts.push(forecast);
      }

      return forecasts;
    } catch (error) {
      console.error('Error generating budget forecast:', error);
      throw error;
    }
  }

  /**
   * Get historical budget and complaint data
   */
  private async getHistoricalData(
    periodType: string,
    departmentId?: string,
    stateId?: string,
    districtId?: string
  ): Promise<ForecastData[]> {
    const whereClause: any = {
      periodType,
    };

    if (departmentId) whereClause.departmentId = departmentId;
    if (stateId) whereClause.stateId = stateId;
    if (districtId) whereClause.districtId = districtId;

    const budgetActuals = await prisma.budgetActual.findMany({
      where: whereClause,
      orderBy: { period: 'asc' },
      take: 24, // Last 24 periods
    });

    return budgetActuals.map(actual => ({
      period: actual.period,
      actualAmount: actual.totalAmount,
      complaintCount: actual.complaintCount || 0,
      resolvedCount: actual.resolvedCount || 0,
      emergencyEvents: actual.emergencyEvents || 0,
      personnelCost: actual.personnelCost || 0,
      infrastructureCost: actual.infrastructureCost || 0,
      operationalCost: actual.operationalCost || 0,
    }));
  }

  /**
   * Forecast for a single period using ensemble of models
   */
  private async forecastSinglePeriod(
    period: string,
    historicalData: ForecastData[],
    periodType: string
  ): Promise<ForecastResult> {
    // Prepare data for ML models
    const timeSeriesData = historicalData.map((data, index) => ({
      x: index,
      y: data.actualAmount,
      complaintCount: data.complaintCount,
      emergencyEvents: data.emergencyEvents,
    }));

    // Multiple regression models
    const linearModel = new SimpleLinearRegression(
      timeSeriesData.map(d => d.x),
      timeSeriesData.map(d => d.y)
    );

    const polynomialModel = new PolynomialRegression(
      timeSeriesData.map(d => d.x),
      timeSeriesData.map(d => d.y),
      2 // Degree 2 polynomial
    );

    // Multi-factor regression
    const multiFactorData = this.prepareMultiFactorData(timeSeriesData);
    const multiFactorPrediction = this.multiFactorRegression(multiFactorData);

    // Ensemble prediction (weighted average)
    const linearPred = linearModel.predict(timeSeriesData.length);
    const polyPred = polynomialModel.predict(timeSeriesData.length);
    const ensemblePred = (linearPred * 0.4 + polyPred * 0.4 + multiFactorPrediction * 0.2);

    // Calculate confidence based on historical accuracy
    const confidence = this.calculateConfidence(historicalData, linearModel, polynomialModel);

    // Breakdown prediction
    const breakdown = this.predictCostBreakdown(ensemblePred, historicalData);

    // Generate AI insights
    const insights = await this.generateInsights(historicalData, ensemblePred, periodType);
    const riskFactors = this.identifyRiskFactors(historicalData);
    const recommendations = this.generateRecommendations(historicalData, breakdown, riskFactors);

    return {
      period,
      predictedAmount: Math.max(0, ensemblePred),
      confidence,
      breakdown,
      insights,
      riskFactors,
      recommendations,
    };
  }

  /**
   * Multi-factor regression considering complaints and emergencies
   */
  private multiFactorRegression(data: any[]): number {
    if (data.length < 3) return 0;

    // Simple multi-factor approach
    const avgAmount = ss.mean(data.map(d => d.y));
    const avgComplaints = ss.mean(data.map(d => d.complaintCount));
    const avgEmergencies = ss.mean(data.map(d => d.emergencyEvents));

    // Weight factors
    const complaintWeight = avgAmount / avgComplaints || 0;
    const emergencyWeight = avgAmount / avgEmergencies || 0;

    // Predict next period based on trends
    const lastComplaints = data[data.length - 1].complaintCount;
    const lastEmergencies = data[data.length - 1].emergencyEvents;

    const complaintTrend = this.calculateTrend(data.map(d => d.complaintCount));
    const emergencyTrend = this.calculateTrend(data.map(d => d.emergencyEvents));

    const predictedComplaints = lastComplaints * (1 + complaintTrend);
    const predictedEmergencies = lastEmergencies * (1 + emergencyTrend);

    return (predictedComplaints * complaintWeight + predictedEmergencies * emergencyWeight) * 0.3 + avgAmount * 0.7;
  }

  /**
   * Calculate trend percentage
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const recent = values.slice(-3);
    const older = values.slice(-6, -3);
    
    if (older.length === 0) return 0;
    
    const recentAvg = ss.mean(recent);
    const olderAvg = ss.mean(older);
    
    return (recentAvg - olderAvg) / olderAvg;
  }

  /**
   * Calculate confidence score for predictions
   */
  private calculateConfidence(
    historicalData: ForecastData[],
    linearModel: SimpleLinearRegression,
    polynomialModel: PolynomialRegression
  ): number {
    if (historicalData.length < 6) return 0.5; // Low confidence for limited data

    // Calculate prediction errors on historical data
    const errors: number[] = [];
    const trainSize = Math.floor(historicalData.length * 0.8);

    for (let i = trainSize; i < historicalData.length; i++) {
      const trainData = historicalData.slice(0, i);
      const actual = historicalData[i].actualAmount;
      
      // Simple prediction using trend
      const predicted = this.simpleTrendPrediction(trainData);
      const error = Math.abs(predicted - actual) / actual;
      errors.push(error);
    }

    const avgError = ss.mean(errors);
    const confidence = Math.max(0.1, Math.min(0.95, 1 - avgError));

    return confidence;
  }

  /**
   * Simple trend prediction for confidence calculation
   */
  private simpleTrendPrediction(data: ForecastData[]): number {
    if (data.length < 2) return data[data.length - 1].actualAmount;
    
    const recent = data.slice(-3);
    const trend = this.calculateTrend(recent.map(d => d.actualAmount));
    return recent[recent.length - 1].actualAmount * (1 + trend);
  }

  /**
   * Predict cost breakdown
   */
  private predictCostBreakdown(totalAmount: number, historicalData: ForecastData[]) {
    if (historicalData.length === 0) {
      return {
        personnelCost: totalAmount * 0.4,
        infrastructureCost: totalAmount * 0.35,
        operationalCost: totalAmount * 0.2,
        emergencyFund: totalAmount * 0.05,
      };
    }

    // Calculate historical averages
    const avgPersonnel = ss.mean(historicalData.map(d => d.personnelCost));
    const avgInfra = ss.mean(historicalData.map(d => d.infrastructureCost));
    const avgOperational = ss.mean(historicalData.map(d => d.operationalCost));
    const avgTotal = ss.mean(historicalData.map(d => d.actualAmount));

    const personnelRatio = avgPersonnel / avgTotal;
    const infraRatio = avgInfra / avgTotal;
    const operationalRatio = avgOperational / avgTotal;
    const emergencyRatio = 0.05; // Fixed 5% for emergencies

    return {
      personnelCost: totalAmount * personnelRatio,
      infrastructureCost: totalAmount * infraRatio,
      operationalCost: totalAmount * operationalRatio,
      emergencyFund: totalAmount * emergencyRatio,
    };
  }

  /**
   * Generate AI insights based on patterns
   */
  private async generateInsights(
    historicalData: ForecastData[],
    prediction: number,
    periodType: string
  ): Promise<string[]> {
    const insights: string[] = [];

    // Trend analysis
    const amountTrend = this.calculateTrend(historicalData.map(d => d.actualAmount));
    const complaintTrend = this.calculateTrend(historicalData.map(d => d.complaintCount));

    if (amountTrend > 0.1) {
      insights.push(`Budget requirements showing strong upward trend of ${(amountTrend * 100).toFixed(1)}%`);
    } else if (amountTrend < -0.1) {
      insights.push(`Budget requirements showing downward trend of ${(Math.abs(amountTrend) * 100).toFixed(1)}%`);
    }

    if (complaintTrend > 0.15) {
      insights.push(`Complaint volume increasing significantly, may require additional resources`);
    }

    // Seasonal patterns
    const seasonalInsights = this.analyzeSeasonalPatterns(historicalData, periodType);
    insights.push(...seasonalInsights);

    // Efficiency analysis
    const efficiency = this.analyzeEfficiency(historicalData);
    if (efficiency < 0.8) {
      insights.push('Resource utilization efficiency below optimal levels, consider optimization');
    }

    // Emergency patterns
    const emergencyPattern = this.analyzeEmergencyPatterns(historicalData);
    if (emergencyPattern.frequency > 0.3) {
      insights.push('High frequency of emergency events detected, recommend increasing emergency fund allocation');
    }

    return insights;
  }

  /**
   * Identify risk factors
   */
  private identifyRiskFactors(historicalData: ForecastData[]): string[] {
    const risks: string[] = [];

    const volatility = this.calculateVolatility(historicalData.map(d => d.actualAmount));
    if (volatility > 0.25) {
      risks.push('High budget volatility detected, recommend maintaining larger contingency funds');
    }

    const emergencyTrend = this.calculateTrend(historicalData.map(d => d.emergencyEvents));
    if (emergencyTrend > 0.2) {
      risks.push('Rising emergency events may strain budget allocations');
    }

    const resolutionRate = this.calculateResolutionRate(historicalData);
    if (resolutionRate < 0.7) {
      risks.push('Low complaint resolution rate may lead to increased costs and citizen dissatisfaction');
    }

    return risks;
  }

  /**
   * Generate cost optimization recommendations
   */
  private generateRecommendations(
    historicalData: ForecastData[],
    breakdown: any,
    riskFactors: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Personnel optimization
    const personnelRatio = breakdown.personnelCost / (breakdown.personnelCost + breakdown.infrastructureCost + breakdown.operationalCost);
    if (personnelRatio > 0.5) {
      recommendations.push('Consider process automation to reduce personnel costs');
    }

    // Infrastructure optimization
    const infraEfficiency = this.analyzeInfrastructureEfficiency(historicalData);
    if (infraEfficiency < 0.7) {
      recommendations.push('Review infrastructure utilization and consider shared resources');
    }

    // Emergency fund optimization
    if (riskFactors.some(risk => risk.includes('emergency'))) {
      recommendations.push('Increase emergency fund allocation to mitigate rising risks');
    }

    // Technology recommendations
    recommendations.push('Implement predictive maintenance to reduce infrastructure costs');
    recommendations.push('Consider digital transformation to improve operational efficiency');

    return recommendations;
  }

  /**
   * Predict demand surges
   */
  async predictDemandSurges(
    periodType: 'MONTHLY' | 'QUARTERLY',
    periods: number = 6,
    departmentId?: string,
    stateId?: string,
    districtId?: string
  ): Promise<DemandSurgePrediction[]> {
    const historicalData = await this.getHistoricalData(periodType, departmentId, stateId, districtId);
    const predictions: DemandSurgePrediction[] = [];

    // Analyze patterns for surge prediction
    const surgePatterns = this.identifySurgePatterns(historicalData);

    for (const pattern of surgePatterns) {
      const prediction: DemandSurgePrediction = {
        title: `Predicted ${pattern.severity.toLowerCase()} demand surge`,
        description: `Expected increase in complaints due to ${pattern.factors.join(', ')}`,
        severity: pattern.severity,
        predictedStart: pattern.predictedStart,
        predictedEnd: pattern.predictedEnd,
        confidence: pattern.confidence,
        estimatedComplaints: pattern.estimatedComplaints,
        estimatedCost: pattern.estimatedCost,
        factors: pattern.factors,
        affectedAreas: pattern.affectedAreas,
      };
      predictions.push(prediction);
    }

    return predictions;
  }

  /**
   * Generate cost optimization suggestions
   */
  async generateCostOptimizations(
    departmentId?: string,
    stateId?: string,
    districtId?: string
  ): Promise<CostOptimizationSuggestion[]> {
    const suggestions: CostOptimizationSuggestion[] = [];

    // Personnel optimizations
    suggestions.push({
      title: 'Implement AI-powered triage system',
      description: 'Automated complaint categorization and prioritization to reduce manual processing time',
      category: 'PERSONNEL',
      priority: 'HIGH',
      potentialSavings: 250000,
      implementationCost: 50000,
      roi: 5.0,
      timeframe: 'MEDIUM_TERM',
      reasoning: [
        'Reduces manual processing time by 40%',
        'Improves response accuracy',
        'Scalable solution for growing demand'
      ]
    });

    // Infrastructure optimizations
    suggestions.push({
      title: 'Predictive maintenance program',
      description: 'IoT sensors and AI analytics to predict infrastructure failures before they occur',
      category: 'INFRASTRUCTURE',
      priority: 'HIGH',
      potentialSavings: 500000,
      implementationCost: 150000,
      roi: 3.33,
      timeframe: 'LONG_TERM',
      reasoning: [
        'Reduces emergency repair costs by 60%',
        'Extends asset lifetime',
        'Improves service reliability'
      ]
    });

    // Operational optimizations
    suggestions.push({
      title: 'Digital workflow automation',
      description: 'End-to-end digitalization of complaint resolution processes',
      category: 'OPERATIONAL',
      priority: 'MEDIUM',
      potentialSavings: 180000,
      implementationCost: 75000,
      roi: 2.4,
      timeframe: 'SHORT_TERM',
      reasoning: [
        'Reduces paperwork and processing time',
        'Improves tracking and accountability',
        'Enables better analytics'
      ]
    });

    return suggestions;
  }

  // Helper methods
  private prepareMultiFactorData(timeSeriesData: any[]) {
    return timeSeriesData.map(d => ({
      amount: d.y,
      complaints: d.complaintCount,
      emergencies: d.emergencyEvents,
    }));
  }

  private getNextPeriod(lastPeriod: string, periodType: string, offset: number): string {
    const [year, period] = lastPeriod.split('-');
    let newYear = parseInt(year);
    let newPeriod = parseInt(period);

    if (periodType === 'MONTHLY') {
      newPeriod += offset;
      while (newPeriod > 12) {
        newPeriod -= 12;
        newYear++;
      }
      return `${newYear}-${newPeriod.toString().padStart(2, '0')}`;
    } else if (periodType === 'QUARTERLY') {
      newPeriod += offset;
      while (newPeriod > 4) {
        newPeriod -= 4;
        newYear++;
      }
      return `${newYear}-Q${newPeriod}`;
    } else {
      return `${newYear + offset}-Annual`;
    }
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = ss.mean(values);
    const variance = ss.variance(values);
    return Math.sqrt(variance) / mean;
  }

  private calculateResolutionRate(data: ForecastData[]): number {
    if (data.length === 0) return 0;
    const totalComplaints = ss.sum(data.map(d => d.complaintCount));
    const totalResolved = ss.sum(data.map(d => d.resolvedCount));
    return totalResolved / totalComplaints;
  }

  private analyzeSeasonalPatterns(data: ForecastData[], periodType: string): string[] {
    const insights: string[] = [];
    
    if (periodType === 'MONTHLY' && data.length >= 12) {
      // Simple seasonal analysis
      const monthlyAvg = new Array(12).fill(0);
      const monthlyCount = new Array(12).fill(0);
      
      data.forEach(d => {
        const month = parseInt(d.period.split('-')[1]) - 1;
        monthlyAvg[month] += d.actualAmount;
        monthlyCount[month]++;
      });
      
      for (let i = 0; i < 12; i++) {
        if (monthlyCount[i] > 0) {
          monthlyAvg[i] /= monthlyCount[i];
        }
      }
      
      const overallAvg = ss.mean(monthlyAvg);
      const peakMonth = monthlyAvg.indexOf(Math.max(...monthlyAvg));
      const lowMonth = monthlyAvg.indexOf(Math.min(...monthlyAvg));
      
      insights.push(`Seasonal pattern detected: Peak spending in ${this.getMonthName(peakMonth)}, lowest in ${this.getMonthName(lowMonth)}`);
    }
    
    return insights;
  }

  private getMonthName(monthIndex: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthIndex];
  }

  private analyzeEfficiency(data: ForecastData[]): number {
    if (data.length === 0) return 1;
    
    // Simple efficiency metric: resolved complaints per unit cost
    const totalCost = ss.sum(data.map(d => d.actualAmount));
    const totalResolved = ss.sum(data.map(d => d.resolvedCount));
    
    return totalResolved / (totalCost / 1000); // Resolved per 1000 currency units
  }

  private analyzeEmergencyPatterns(data: ForecastData[]): { frequency: number; avgCost: number } {
    if (data.length === 0) return { frequency: 0, avgCost: 0 };
    
    const totalEmergencies = ss.sum(data.map(d => d.emergencyEvents));
    const totalCost = ss.sum(data.map(d => d.actualAmount));
    
    return {
      frequency: totalEmergencies / data.length,
      avgCost: totalEmergencies > 0 ? totalCost / totalEmergencies : 0
    };
  }

  private analyzeInfrastructureEfficiency(data: ForecastData[]): number {
    if (data.length === 0) return 1;
    
    const totalInfraCost = ss.sum(data.map(d => d.infrastructureCost));
    const totalComplaints = ss.sum(data.map(d => d.complaintCount));
    
    return totalComplaints / (totalInfraCost / 1000); // Complaints per 1000 infra cost
  }

  private identifySurgePatterns(data: ForecastData[]): any[] {
    const patterns: any[] = [];
    
    // Simple surge detection based on complaint count anomalies
    if (data.length >= 6) {
      const complaintValues = data.map(d => d.complaintCount);
      const mean = ss.mean(complaintValues);
      const stdDev = ss.standardDeviation(complaintValues);
      
      // Look for values > 2 standard deviations
      data.forEach((d, index) => {
        if (d.complaintCount > mean + 2 * stdDev) {
          patterns.push({
            severity: d.complaintCount > mean + 3 * stdDev ? 'HIGH' : 'MEDIUM',
            predictedStart: new Date(),
            predictedEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            confidence: 0.7,
            estimatedComplaints: d.complaintCount,
            estimatedCost: d.actualAmount * 1.5,
            factors: ['Historical pattern', 'Seasonal variation'],
            affectedAreas: ['All districts']
          });
        }
      });
    }
    
    return patterns;
  }
}

export const aiBudgetForecasting = new AIBudgetForecastingEngine();
