const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedBudgetData() {
  console.log('🌱 Seeding budget forecasting data...');

  try {
    // Get existing departments
    const departments = await prisma.department.findMany();
    if (departments.length === 0) {
      console.log('❌ No departments found. Please run the main seed script first.');
      return;
    }

    // Get existing states and districts
    const states = await prisma.state.findMany();
    const districts = await prisma.district.findMany();

    // Create sample budget actuals for the last 24 months
    const budgetActuals = [];
    const currentDate = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const periodDate = new Date(currentDate);
      periodDate.setMonth(periodDate.getMonth() - i);
      const period = `${periodDate.getFullYear()}-${(periodDate.getMonth() + 1).toString().padStart(2, '0')}`;
      
      departments.forEach((dept, index) => {
        const baseAmount = 1000000 + (index * 200000) + Math.random() * 500000;
        const seasonalFactor = 1 + 0.2 * Math.sin((periodDate.getMonth() / 12) * 2 * Math.PI);
        const trendFactor = 1 + (i * 0.01); // 1% growth per month
        
        const totalAmount = baseAmount * seasonalFactor * trendFactor;
        const complaintCount = Math.floor(50 + Math.random() * 100 + (i * 2));
        const resolvedCount = Math.floor(complaintCount * (0.7 + Math.random() * 0.2));
        const emergencyEvents = Math.floor(Math.random() * 5);
        
        budgetActuals.push({
          period,
          periodType: 'MONTHLY',
          departmentId: dept.id,
          stateId: states[0]?.id,
          districtId: districts[0]?.id,
          totalAmount: Math.round(totalAmount),
          personnelCost: Math.round(totalAmount * 0.4),
          infrastructureCost: Math.round(totalAmount * 0.35),
          operationalCost: Math.round(totalAmount * 0.2),
          emergencySpent: Math.round(totalAmount * 0.05),
          complaintCount,
          resolvedCount,
          emergencyEvents,
          recordedAt: periodDate,
          verifiedBy: 'admin',
          notes: `Actual spending data for ${period}`,
        });
      });
    }

    console.log(`📊 Creating ${budgetActuals.length} budget actual records...`);
    await prisma.budgetActual.createMany({
      data: budgetActuals,
      skipDuplicates: true,
    });

    // Create sample budget forecasts
    const forecasts = [];
    for (let i = 1; i <= 12; i++) {
      const periodDate = new Date(currentDate);
      periodDate.setMonth(periodDate.getMonth() + i);
      const period = `${periodDate.getFullYear()}-${(periodDate.getMonth() + 1).toString().padStart(2, '0')}`;
      
      departments.forEach((dept, index) => {
        const baseAmount = 1200000 + (index * 250000) + Math.random() * 600000;
        const seasonalFactor = 1 + 0.2 * Math.sin((periodDate.getMonth() / 12) * 2 * Math.PI);
        const trendFactor = 1 + (i * 0.015); // 1.5% growth per month
        
        const predictedAmount = baseAmount * seasonalFactor * trendFactor;
        const confidence = 0.75 + Math.random() * 0.2; // 75-95% confidence
        
        forecasts.push({
          period,
          periodType: 'MONTHLY',
          departmentId: dept.id,
          stateId: states[0]?.id,
          districtId: districts[0]?.id,
          predictedAmount: Math.round(predictedAmount),
          actualAmount: null,
          confidence,
          modelVersion: '2.0.0',
          personnelCost: Math.round(predictedAmount * 0.4),
          infrastructureCost: Math.round(predictedAmount * 0.35),
          operationalCost: Math.round(predictedAmount * 0.2),
          emergencyFund: Math.round(predictedAmount * 0.05),
          createdBy: 'admin',
          status: 'ACTIVE',
          insights: [
            `Seasonal trend detected for ${period}`,
            `Budget allocation aligned with department priorities`,
            `Efficiency improvements expected from digital transformation`
          ],
          riskFactors: [
            'Potential increase in emergency events',
            'Infrastructure aging may require additional funding'
          ],
          recommendations: [
            'Consider preventive maintenance programs',
            'Implement digital workflow automation',
            'Review staffing levels based on complaint volume'
          ],
        });
      });
    }

    console.log(`🔮 Creating ${forecasts.length} budget forecast records...`);
    await prisma.budgetForecast.createMany({
      data: forecasts,
      skipDuplicates: true,
    });

    // Create sample cost optimization suggestions
    const optimizations = [
      {
        title: 'AI-Powered Complaint Triage System',
        description: 'Implement machine learning algorithms to automatically categorize and prioritize incoming complaints based on severity and urgency.',
        category: 'PERSONNEL',
        priority: 'HIGH',
        potentialSavings: 350000,
        implementationCost: 75000,
        roi: 4.67,
        timeframe: 'MEDIUM_TERM',
        status: 'PROPOSED',
        departmentId: departments[0]?.id,
        stateId: states[0]?.id,
        districtId: districts[0]?.id,
        aiConfidence: 0.92,
        aiReasoning: {
          analysis: [
            'Current manual triage process consumes 40% of staff time',
            'AI automation can reduce processing time by 75%',
            'Historical data shows clear patterns for ML training'
          ],
          methodology: 'Cost-benefit analysis based on current staffing levels and complaint volume',
          dataPoints: ['staff_hours_saved', 'processing_speed_improvement', 'accuracy_metrics']
        },
      },
      {
        title: 'Predictive Infrastructure Maintenance',
        description: 'Deploy IoT sensors and AI analytics to predict equipment failures before they occur, reducing emergency repair costs.',
        category: 'INFRASTRUCTURE',
        priority: 'HIGH',
        potentialSavings: 750000,
        implementationCost: 200000,
        roi: 3.75,
        timeframe: 'LONG_TERM',
        status: 'PROPOSED',
        departmentId: departments[1]?.id,
        stateId: states[0]?.id,
        districtId: districts[0]?.id,
        aiConfidence: 0.88,
        aiReasoning: {
          analysis: [
            'Emergency repairs cost 3x more than scheduled maintenance',
            'IoT sensors can detect 80% of failures before they occur',
            'Equipment lifespan can be extended by 25%'
          ],
          methodology: 'ROI calculation based on historical maintenance data',
          dataPoints: ['emergency_repair_costs', 'sensor_accuracy', 'equipment_lifespan']
        },
      },
      {
        title: 'Digital Workflow Automation',
        description: 'End-to-end digitalization of complaint resolution processes to reduce paperwork and improve tracking.',
        category: 'OPERATIONAL',
        priority: 'MEDIUM',
        potentialSavings: 225000,
        implementationCost: 90000,
        roi: 2.5,
        timeframe: 'SHORT_TERM',
        status: 'PROPOSED',
        departmentId: departments[2]?.id,
        stateId: states[0]?.id,
        districtId: districts[0]?.id,
        aiConfidence: 0.85,
        aiReasoning: {
          analysis: [
            'Paper-based processes cause 30% delays',
            'Digital tracking improves accountability',
            'Automation reduces manual data entry errors'
          ],
          methodology: 'Process efficiency analysis',
          dataPoints: ['processing_time_reduction', 'error_rate_decrease', 'accountability_improvement']
        },
      },
    ];

    console.log(`💡 Creating ${optimizations.length} cost optimization suggestions...`);
    for (const opt of optimizations) {
      await prisma.costOptimization.create({
        data: opt,
      });
    }

    // Create sample demand surge predictions
    const demandSurges = [
      {
        title: 'Monsoon Season Infrastructure Stress',
        description: 'Expected increase in infrastructure-related complaints due to monsoon rains and flooding.',
        severity: 'HIGH',
        predictedStart: new Date(currentDate.getFullYear(), 5, 1), // June 1st
        predictedEnd: new Date(currentDate.getFullYear(), 8, 30), // September 30th
        confidence: 0.85,
        departmentId: departments[1]?.id,
        stateId: states[0]?.id,
        districtId: districts[0]?.id,
        estimatedComplaints: 250,
        estimatedCost: 2500000,
        factors: ['Monsoon rains', 'Aging infrastructure', 'Urban flooding'],
        affectedAreas: ['All urban districts', 'Low-lying areas', 'Coastal regions'],
        modelVersion: '2.0.0',
        aiInsights: {
          reasoning: 'Historical pattern analysis shows 40% increase in infrastructure complaints during monsoon',
          confidenceFactors: ['historical_accuracy', 'weather_forecasts', 'infrastructure_age']
        },
        status: 'PREDICTED',
      },
      {
        title: 'Festival Season Public Services Demand',
        description: 'Anticipated surge in public service complaints during major festival periods.',
        severity: 'MEDIUM',
        predictedStart: new Date(currentDate.getFullYear(), 9, 15), // October 15th
        predictedEnd: new Date(currentDate.getFullYear(), 11, 15), // December 15th
        confidence: 0.75,
        departmentId: departments[0]?.id,
        stateId: states[0]?.id,
        districtId: districts[0]?.id,
        estimatedComplaints: 180,
        estimatedCost: 1200000,
        factors: ['Festival crowds', 'Increased public gatherings', 'Service overload'],
        affectedAreas: ['City centers', 'Religious sites', 'Commercial districts'],
        modelVersion: '2.0.0',
        aiInsights: {
          reasoning: 'Festival seasons historically show 25% increase in service-related complaints',
          confidenceFactors: ['seasonal_patterns', 'event_calendars', 'crowd_density_data']
        },
        status: 'PREDICTED',
      },
    ];

    console.log(`⚠️ Creating ${demandSurges.length} demand surge predictions...`);
    for (const surge of demandSurges) {
      await prisma.demandSurge.create({
        data: surge,
      });
    }

    console.log('✅ Budget forecasting data seeded successfully!');
    console.log(`📈 Created ${budgetActuals.length} budget actuals`);
    console.log(`🔮 Created ${forecasts.length} forecasts`);
    console.log(`💡 Created ${optimizations.length} optimization suggestions`);
    console.log(`⚠️ Created ${demandSurges.length} demand surge predictions`);

  } catch (error) {
    console.error('❌ Error seeding budget data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedBudgetData();
