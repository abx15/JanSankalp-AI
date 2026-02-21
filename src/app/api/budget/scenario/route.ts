import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { aiBudgetForecasting } from '@/lib/ai-budget-forecasting';

export interface ScenarioParameters {
  name: string;
  description: string;
  complaintVolumeChange: number; // percentage change
  emergencyEventsChange: number; // percentage change
  personnelCostChange: number; // percentage change
  infrastructureCostChange: number; // percentage change
  operationalCostChange: number; // percentage change
  efficiencyImprovement: number; // percentage improvement
  timeHorizon: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
}

export interface ScenarioResult {
  parameters: ScenarioParameters;
  baselineForecast: any;
  adjustedForecast: any;
  impact: {
    totalCostChange: number;
    personnelCostChange: number;
    infrastructureCostChange: number;
    operationalCostChange: number;
    efficiencyGain: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  recommendations: string[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !['ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      parameters, 
      periodType = 'MONTHLY',
      periods = 12,
      departmentId,
      stateId,
      districtId 
    }: { parameters: ScenarioParameters } & any = body;

    // Get baseline forecast
    const baselineForecasts = await aiBudgetForecasting.generateBudgetForecast(
      periodType,
      periods,
      departmentId,
      stateId,
      districtId
    );

    // Apply scenario adjustments
    const adjustedForecasts = baselineForecasts.map(forecast => {
      const adjusted = { ...forecast };
      
      // Apply percentage changes
      adjusted.predictedAmount *= (1 + parameters.complaintVolumeChange / 100);
      adjusted.breakdown.personnelCost *= (1 + parameters.personnelCostChange / 100);
      adjusted.breakdown.infrastructureCost *= (1 + parameters.infrastructureCostChange / 100);
      adjusted.breakdown.operationalCost *= (1 + parameters.operationalCostChange / 100);
      
      // Apply efficiency improvement
      const efficiencyMultiplier = 1 - (parameters.efficiencyImprovement / 100);
      adjusted.predictedAmount *= efficiencyMultiplier;
      adjusted.breakdown.personnelCost *= efficiencyMultiplier;
      adjusted.breakdown.operationalCost *= efficiencyMultiplier;
      
      // Adjust confidence based on scenario complexity
      const complexityFactor = Math.abs(parameters.complaintVolumeChange) + 
                              Math.abs(parameters.emergencyEventsChange) + 
                              Math.abs(parameters.personnelCostChange) +
                              Math.abs(parameters.infrastructureCostChange) +
                              Math.abs(parameters.operationalCostChange);
      
      adjusted.confidence = Math.max(0.1, adjusted.confidence * (1 - complexityFactor / 500));
      
      return adjusted;
    });

    // Calculate overall impact
    const baselineTotal = baselineForecasts.reduce((sum, f) => sum + f.predictedAmount, 0);
    const adjustedTotal = adjustedForecasts.reduce((sum, f) => sum + f.predictedAmount, 0);
    
    const baselinePersonnel = baselineForecasts.reduce((sum, f) => sum + f.breakdown.personnelCost, 0);
    const adjustedPersonnel = adjustedForecasts.reduce((sum, f) => sum + f.breakdown.personnelCost, 0);
    
    const baselineInfra = baselineForecasts.reduce((sum, f) => sum + f.breakdown.infrastructureCost, 0);
    const adjustedInfra = adjustedForecasts.reduce((sum, f) => sum + f.breakdown.infrastructureCost, 0);
    
    const baselineOperational = baselineForecasts.reduce((sum, f) => sum + f.breakdown.operationalCost, 0);
    const adjustedOperational = adjustedForecasts.reduce((sum, f) => sum + f.breakdown.operationalCost, 0);

    const impact = {
      totalCostChange: ((adjustedTotal - baselineTotal) / baselineTotal) * 100,
      personnelCostChange: ((adjustedPersonnel - baselinePersonnel) / baselinePersonnel) * 100,
      infrastructureCostChange: ((adjustedInfra - baselineInfra) / baselineInfra) * 100,
      operationalCostChange: ((adjustedOperational - baselineOperational) / baselineOperational) * 100,
      efficiencyGain: parameters.efficiencyImprovement,
      riskLevel: calculateRiskLevel(parameters),
    };

    // Generate scenario-specific recommendations
    const recommendations = generateScenarioRecommendations(parameters, impact);

    const result: ScenarioResult = {
      parameters,
      baselineForecast: baselineForecasts,
      adjustedForecast: adjustedForecasts,
      impact,
      recommendations,
    };

    return NextResponse.json({
      success: true,
      scenario: result,
    });
  } catch (error) {
    console.error('Scenario simulation error:', error);
    return NextResponse.json(
      { error: 'Failed to run scenario simulation' },
      { status: 500 }
    );
  }
}

function calculateRiskLevel(parameters: ScenarioParameters): 'LOW' | 'MEDIUM' | 'HIGH' {
  const volatility = Math.abs(parameters.complaintVolumeChange) + 
                     Math.abs(parameters.emergencyEventsChange);
  
  const costChanges = Math.abs(parameters.personnelCostChange) + 
                     Math.abs(parameters.infrastructureCostChange) + 
                     Math.abs(parameters.operationalCostChange);
  
  const totalRisk = volatility + costChanges - parameters.efficiencyImprovement;
  
  if (totalRisk < 20) return 'LOW';
  if (totalRisk < 50) return 'MEDIUM';
  return 'HIGH';
}

function generateScenarioRecommendations(parameters: ScenarioParameters, impact: any): string[] {
  const recommendations: string[] = [];
  
  if (parameters.complaintVolumeChange > 20) {
    recommendations.push('Consider increasing staff capacity to handle higher complaint volume');
    recommendations.push('Implement automated triage systems to manage increased workload');
  }
  
  if (parameters.emergencyEventsChange > 15) {
    recommendations.push('Increase emergency fund allocation to handle higher frequency of emergencies');
    recommendations.push('Strengthen preventive maintenance programs');
  }
  
  if (parameters.efficiencyImprovement > 20) {
    recommendations.push('Invest in technology and training to achieve efficiency gains');
    recommendations.push('Monitor implementation closely to ensure targets are met');
  }
  
  if (impact.totalCostChange > 10) {
    recommendations.push('Review budget allocation to accommodate increased costs');
    recommendations.push('Explore additional funding sources if needed');
  }
  
  if (impact.totalCostChange < -10) {
    recommendations.push('Consider reallocating savings to high-impact areas');
    recommendations.push('Evaluate opportunities for further optimization');
  }
  
  if (impact.riskLevel === 'HIGH') {
    recommendations.push('Implement robust monitoring and early warning systems');
    recommendations.push('Prepare contingency plans for potential adverse outcomes');
  }
  
  return recommendations;
}

