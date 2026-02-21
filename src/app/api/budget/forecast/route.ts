import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { aiBudgetForecasting } from '@/lib/ai-budget-forecasting';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !['ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const periodType = (searchParams.get('periodType') as 'MONTHLY' | 'QUARTERLY' | 'ANNUAL') || 'MONTHLY';
    const periods = parseInt(searchParams.get('periods') || '12');
    const departmentId = searchParams.get('departmentId') || undefined;
    const stateId = searchParams.get('stateId') || undefined;
    const districtId = searchParams.get('districtId') || undefined;

    // Generate forecasts
    const forecasts = await aiBudgetForecasting.generateBudgetForecast(
      periodType,
      periods,
      departmentId,
      stateId,
      districtId
    );

    // Save forecasts to database
    const savedForecasts = [];
    for (const forecast of forecasts) {
      const saved = await prisma.budgetForecast.create({
        data: {
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
          createdBy: session.user.id,
          insights: forecast.insights,
          riskFactors: forecast.riskFactors,
          recommendations: forecast.recommendations,
        },
      });
      savedForecasts.push(saved);
    }

    return NextResponse.json({
      success: true,
      forecasts: savedForecasts,
      rawForecasts: forecasts,
    });
  } catch (error) {
    console.error('Budget forecast error:', error);
    return NextResponse.json(
      { error: 'Failed to generate budget forecast' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !['ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { period, periodType, departmentId, stateId, districtId, customData } = body;

    // Generate custom forecast with provided data
    const forecasts = await aiBudgetForecasting.generateBudgetForecast(
      periodType,
      1,
      departmentId,
      stateId,
      districtId
    );

    const forecast = forecasts[0];

    // Save custom forecast
    const saved = await prisma.budgetForecast.create({
      data: {
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
        createdBy: session.user.id,
        insights: forecast.insights,
        riskFactors: forecast.riskFactors,
        recommendations: forecast.recommendations,
      },
    });

    return NextResponse.json({
      success: true,
      forecast: saved,
    });
  } catch (error) {
    console.error('Custom budget forecast error:', error);
    return NextResponse.json(
      { error: 'Failed to create custom budget forecast' },
      { status: 500 }
    );
  }
}
