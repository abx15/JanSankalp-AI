import { NextResponse } from "next/server";
import { budgetService } from "./budget.service";
import { handleError, AppError } from "@/core/error-handler";
import { auth } from "@/auth";

const ADMIN_ROLES = ['ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN'];

export class BudgetController {
    async getForecast(req: Request) {
        try {
            const session = await auth();
            if (!session || !ADMIN_ROLES.includes(session.user?.role as string)) {
                throw new AppError("Unauthorized", 401);
            }

            const { searchParams } = new URL(req.url);
            const params = {
                periodType: (searchParams.get('periodType') as 'MONTHLY' | 'QUARTERLY' | 'ANNUAL') || 'MONTHLY',
                periods: parseInt(searchParams.get('periods') || '12'),
                departmentId: searchParams.get('departmentId') || undefined,
                stateId: searchParams.get('stateId') || undefined,
                districtId: searchParams.get('districtId') || undefined,
            };

            const result = await budgetService.generateForecast(params, session.user.id!);
            return NextResponse.json({ success: true, ...result });
        } catch (error) {
            return handleError(error);
        }
    }

    async createCustomForecast(req: Request) {
        try {
            const session = await auth();
            if (!session || !ADMIN_ROLES.includes(session.user?.role as string)) {
                throw new AppError("Unauthorized", 401);
            }

            const body = await req.json();
            const forecast = await budgetService.createCustomForecast(body, session.user.id!);
            return NextResponse.json({ success: true, forecast });
        } catch (error) {
            return handleError(error);
        }
    }

    async getOptimizations(req: Request) {
        try {
            const session = await auth();
            if (!session || !ADMIN_ROLES.includes(session.user?.role as string)) {
                throw new AppError("Unauthorized", 401);
            }

            const { searchParams } = new URL(req.url);
            const params = {
                departmentId: searchParams.get('departmentId') || undefined,
                stateId: searchParams.get('stateId') || undefined,
                districtId: searchParams.get('districtId') || undefined,
            };

            const result = await budgetService.generateOptimizations(params);
            return NextResponse.json({ success: true, ...result });
        } catch (error) {
            return handleError(error);
        }
    }

    async processOptimizationAction(req: Request) {
        try {
            const session = await auth();
            if (!session || !ADMIN_ROLES.includes(session.user?.role as string)) {
                throw new AppError("Unauthorized", 401);
            }

            const body = await req.json();
            const suggestion = await budgetService.processOptimizationAction(body, session.user.id!);
            return NextResponse.json({ success: true, suggestion });
        } catch (error) {
            return handleError(error);
        }
    }

    async runScenario(req: Request) {
        try {
            const session = await auth();
            if (!session || !ADMIN_ROLES.includes(session.user?.role as string)) {
                throw new AppError("Unauthorized", 401);
            }

            const body = await req.json();
            const scenario = await budgetService.runScenario(body);
            return NextResponse.json({ success: true, scenario });
        } catch (error) {
            return handleError(error);
        }
    }

    async getDemandSurges(req: Request) {
        try {
            const session = await auth();
            if (!session || !ADMIN_ROLES.includes(session.user?.role as string)) {
                throw new AppError("Unauthorized", 401);
            }

            const { searchParams } = new URL(req.url);
            const params = {
                periodType: (searchParams.get('periodType') as 'MONTHLY' | 'QUARTERLY') || 'MONTHLY',
                periods: parseInt(searchParams.get('periods') || '6'),
                departmentId: searchParams.get('departmentId') || undefined,
                stateId: searchParams.get('stateId') || undefined,
                districtId: searchParams.get('districtId') || undefined,
            };

            const result = await budgetService.getDemandSurges(params);
            return NextResponse.json({ success: true, ...result });
        } catch (error) {
            return handleError(error);
        }
    }

    async createCustomDemandSurge(req: Request) {
        try {
            const session = await auth();
            if (!session || !ADMIN_ROLES.includes(session.user?.role as string)) {
                throw new AppError("Unauthorized", 401);
            }

            const body = await req.json();
            const prediction = await budgetService.createCustomDemandSurge(body);
            return NextResponse.json({ success: true, prediction });
        } catch (error) {
            return handleError(error);
        }
    }
}

export const budgetController = new BudgetController();
