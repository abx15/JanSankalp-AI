import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { aiBudgetForecasting } from '@/lib/ai-budget-forecasting';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !['ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId') || undefined;
    const stateId = searchParams.get('stateId') || undefined;
    const districtId = searchParams.get('districtId') || undefined;

    // Generate cost optimization suggestions
    const suggestions = await aiBudgetForecasting.generateCostOptimizations(
      departmentId,
      stateId,
      districtId
    );

    // Save suggestions to database
    const savedSuggestions = [];
    for (const suggestion of suggestions) {
      const saved = await prisma.costOptimization.create({
        data: {
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
        },
      });
      savedSuggestions.push(saved);
    }

    return NextResponse.json({
      success: true,
      suggestions: savedSuggestions,
      rawSuggestions: suggestions,
    });
  } catch (error) {
    console.error('Cost optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cost optimization suggestions' },
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
      suggestionId, 
      action, // 'APPROVE', 'REJECT', 'IMPLEMENT'
      notes 
    } = body;

    if (action === 'APPROVE') {
      const updated = await prisma.costOptimization.update({
        where: { id: suggestionId },
        data: {
          status: 'APPROVED',
          approvedBy: session.user.id,
          approvedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        suggestion: updated,
      });
    } else if (action === 'REJECT') {
      const updated = await prisma.costOptimization.update({
        where: { id: suggestionId },
        data: {
          status: 'REJECTED',
        },
      });

      return NextResponse.json({
        success: true,
        suggestion: updated,
      });
    } else if (action === 'IMPLEMENT') {
      const updated = await prisma.costOptimization.update({
        where: { id: suggestionId },
        data: {
          status: 'IMPLEMENTED',
          implementedBy: session.user.id,
          implementedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        suggestion: updated,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Cost optimization action error:', error);
    return NextResponse.json(
      { error: 'Failed to process cost optimization action' },
      { status: 500 }
    );
  }
}

