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
    const periodType = (searchParams.get('periodType') as 'MONTHLY' | 'QUARTERLY') || 'MONTHLY';
    const periods = parseInt(searchParams.get('periods') || '6');
    const departmentId = searchParams.get('departmentId') || undefined;
    const stateId = searchParams.get('stateId') || undefined;
    const districtId = searchParams.get('districtId') || undefined;

    // Generate demand surge predictions
    const predictions = await aiBudgetForecasting.predictDemandSurges(
      periodType,
      periods,
      departmentId,
      stateId,
      districtId
    );

    // Save predictions to database
    const savedPredictions = [];
    for (const prediction of predictions) {
      const saved = await prisma.demandSurge.create({
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
      });
      savedPredictions.push(saved);
    }

    return NextResponse.json({
      success: true,
      predictions: savedPredictions,
      rawPredictions: predictions,
    });
  } catch (error) {
    console.error('Demand surge prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to predict demand surges' },
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
    const { 
      title, 
      description, 
      severity, 
      predictedStart, 
      predictedEnd, 
      departmentId, 
      stateId, 
      districtId,
      estimatedComplaints,
      estimatedCost,
      factors,
      affectedAreas 
    } = body;

    // Create custom demand surge prediction
    const saved = await prisma.demandSurge.create({
      data: {
        title,
        description,
        severity,
        predictedStart: new Date(predictedStart),
        predictedEnd: new Date(predictedEnd),
        confidence: 0.8, // Default confidence for manual predictions
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

    return NextResponse.json({
      success: true,
      prediction: saved,
    });
  } catch (error) {
    console.error('Custom demand surge prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to create demand surge prediction' },
      { status: 500 }
    );
  }
}
