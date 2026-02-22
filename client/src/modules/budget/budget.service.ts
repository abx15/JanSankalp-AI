import { aiBudgetForecasting } from "@/lib/ai-budget-forecasting";
import { budgetRepository } from "./budget.repository";
import prisma from "@/lib/prisma";
import { AppError } from "@/core/error-handler";

export class BudgetService {
    async generateForecast(params: any, userId: string) {
        const { periodType, periods, departmentId, stateId, districtId } = params;

        const forecasts = await aiBudgetForecasting.generateBudgetForecast(
            periodType,
            periods,
            departmentId,
            stateId,
            districtId
        );

        const dataToSave = forecasts.map((forecast) => ({
            period: forecast.period,
            periodType,
            departmentId,
            stateId,
            districtId,
            predictedAmount: forecast.predictedAmount,
            confidence: forecast.confidence,
            modelVersion: '2.0.0',
            personnelCost: forecast.breakdown.personnelCost,
            infrastructureCost: forecast.breakdown.infrastructureCost,
            operationalCost: forecast.breakdown.operationalCost,
            emergencyFund: forecast.breakdown.emergencyFund,
            createdBy: userId,
            insights: forecast.insights,
            riskFactors: forecast.riskFactors,
            recommendations: forecast.recommendations,
        }));

        const savedForecasts = await budgetRepository.createForecasts(dataToSave);
        return {
            forecasts: savedForecasts,
            rawForecasts: forecasts,
        };
    }

    async createCustomForecast(body: any, userId: string) {
        const { period, periodType, departmentId, stateId, districtId, customData } = body;

        const forecasts = await aiBudgetForecasting.generateBudgetForecast(
            periodType,
            1,
            departmentId,
            stateId,
            districtId
        );

        const forecast = forecasts[0];

        const data = {
            period: period || forecast.period,
            periodType,
            departmentId,
            stateId,
            districtId,
            predictedAmount: customData?.amount || forecast.predictedAmount,
            confidence: customData?.confidence || forecast.confidence,
            modelVersion: '2.0.0',
            personnelCost: customData?.personnelCost || forecast.breakdown.personnelCost,
            infrastructureCost: customData?.infrastructureCost || forecast.breakdown.infrastructureCost,
            operationalCost: customData?.operationalCost || forecast.breakdown.operationalCost,
            emergencyFund: customData?.emergencyFund || forecast.breakdown.emergencyFund,
            createdBy: userId,
            insights: forecast.insights,
            riskFactors: forecast.riskFactors,
            recommendations: forecast.recommendations,
        };

        const saved = await budgetRepository.createForecasts([data]);
        return saved[0];
    }

    async generateOptimizations(params: any) {
        const { departmentId, stateId, districtId } = params;

        const suggestions = await aiBudgetForecasting.generateCostOptimizations(
            departmentId,
            stateId,
            districtId
        );

        const dataToSave = suggestions.map((suggestion) => ({
            title: suggestion.title,
            description: suggestion.description,
            category: suggestion.category,
            priority: suggestion.priority,
            potentialSavings: suggestion.potentialSavings,
            implementationCost: suggestion.implementationCost,
            roi: suggestion.roi,
            timeframe: suggestion.timeframe,
            departmentId,
            stateId,
            districtId,
            aiConfidence: 0.85,
            aiReasoning: {
                analysis: suggestion.reasoning,
                methodology: 'AI-powered cost-benefit analysis',
                dataPoints: ['historical_spending', 'industry_benchmarks', 'efficiency_metrics']
            },
        }));

        const savedSuggestions = await budgetRepository.createCostOptimizations(dataToSave);
        return {
            suggestions: savedSuggestions,
            rawSuggestions: suggestions,
        };
    }

    async processOptimizationAction(body: any, userId: string) {
        const { suggestionId, action, notes } = body;

        let updateData: any = {};
        if (action === 'APPROVE') {
            updateData = {
                status: 'APPROVED',
                approvedBy: userId,
                approvedAt: new Date(),
            };
        } else if (action === 'REJECT') {
            updateData = {
                status: 'REJECTED',
            };
        } else if (action === 'IMPLEMENT') {
            updateData = {
                status: 'IMPLEMENTED',
                implementedBy: userId,
                implementedAt: new Date(),
            };
        } else {
            throw new AppError("Invalid action", 400);
        }

        return budgetRepository.updateCostOptimization(suggestionId, updateData);
    }

    async runScenario(body: any) {
        const { parameters, periodType = 'MONTHLY', periods = 12, departmentId, stateId, districtId } = body;

        const baselineForecasts = await aiBudgetForecasting.generateBudgetForecast(
            periodType,
            periods,
            departmentId,
            stateId,
            districtId
        );

        const adjustedForecasts = baselineForecasts.map(forecast => {
            const adjusted = JSON.parse(JSON.stringify(forecast));

            adjusted.predictedAmount *= (1 + parameters.complaintVolumeChange / 100);
            adjusted.breakdown.personnelCost *= (1 + parameters.personnelCostChange / 100);
            adjusted.breakdown.infrastructureCost *= (1 + parameters.infrastructureCostChange / 100);
            adjusted.breakdown.operationalCost *= (1 + parameters.operationalCostChange / 100);

            const efficiencyMultiplier = 1 - (parameters.efficiencyImprovement / 100);
            adjusted.predictedAmount *= efficiencyMultiplier;
            adjusted.breakdown.personnelCost *= efficiencyMultiplier;
            adjusted.breakdown.operationalCost *= efficiencyMultiplier;

            const complexityFactor = Math.abs(parameters.complaintVolumeChange) +
                Math.abs(parameters.emergencyEventsChange) +
                Math.abs(parameters.personnelCostChange) +
                Math.abs(parameters.infrastructureCostChange) +
                Math.abs(parameters.operationalCostChange);

            adjusted.confidence = Math.max(0.1, adjusted.confidence * (1 - complexityFactor / 500));

            return adjusted;
        });

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
            riskLevel: this.calculateRiskLevel(parameters),
        };

        const recommendations = this.generateScenarioRecommendations(parameters, impact);

        return {
            parameters,
            baselineForecast: baselineForecasts,
            adjustedForecast: adjustedForecasts,
            impact,
            recommendations,
        };
    }

    async getDemandSurges(params: any) {
        const { periodType, periods, departmentId, stateId, districtId } = params;

        const predictions = await aiBudgetForecasting.predictDemandSurges(
            periodType,
            periods,
            departmentId,
            stateId,
            districtId
        );

        const savedPredictions = await Promise.all(
            predictions.map((prediction) =>
                prisma.demandSurge.create({
                    data: {
                        title: prediction.title,
                        description: prediction.description,
                        severity: prediction.severity,
                        predictedStart: prediction.predictedStart,
                        predictedEnd: prediction.predictedEnd,
                        confidence: prediction.confidence,
                        departmentId,
                        stateId,
                        districtId,
                        estimatedComplaints: prediction.estimatedComplaints,
                        estimatedCost: prediction.estimatedCost,
                        factors: prediction.factors,
                        affectedAreas: prediction.affectedAreas,
                        modelVersion: '2.0.0',
                        aiInsights: {
                            reasoning: 'AI-generated based on historical patterns and trends',
                            confidenceFactors: ['historical_accuracy', 'seasonal_patterns', 'trend_analysis']
                        },
                    },
                })
            )
        );

        return { predictions: savedPredictions, rawPredictions: predictions };
    }

    async createCustomDemandSurge(body: any) {
        const { title, description, severity, predictedStart, predictedEnd, departmentId, stateId, districtId, estimatedComplaints, estimatedCost, factors, affectedAreas } = body;

        return prisma.demandSurge.create({
            data: {
                title,
                description,
                severity,
                predictedStart: new Date(predictedStart),
                predictedEnd: new Date(predictedEnd),
                confidence: 0.8,
                departmentId,
                stateId,
                districtId,
                estimatedComplaints,
                estimatedCost,
                factors,
                affectedAreas,
                modelVersion: '2.0.0',
                aiInsights: {
                    reasoning: 'Manual prediction by administrator',
                    confidenceFactors: ['expert_judgment']
                },
            },
        });
    }

    private calculateRiskLevel(parameters: any): 'LOW' | 'MEDIUM' | 'HIGH' {
        const volatility = Math.abs(parameters.complaintVolumeChange) + Math.abs(parameters.emergencyEventsChange);
        const costChanges = Math.abs(parameters.personnelCostChange) + Math.abs(parameters.infrastructureCostChange) + Math.abs(parameters.operationalCostChange);
        const totalRisk = volatility + costChanges - parameters.efficiencyImprovement;

        if (totalRisk < 20) return 'LOW';
        if (totalRisk < 50) return 'MEDIUM';
        return 'HIGH';
    }

    private generateScenarioRecommendations(parameters: any, impact: any): string[] {
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
}

export const budgetService = new BudgetService();
