import prisma from "@/data/prisma";

export class BudgetRepository {
    async createForecasts(data: any[]) {
        // Note: Prisma doesn't support createMany for this specific schema in all versions or configurations
        // but we can use a loop or transaction if needed.
        return Promise.all(
            data.map((item) =>
                prisma.budgetForecast.create({
                    data: item,
                })
            )
        );
    }

    async createCostOptimizations(data: any[]) {
        return Promise.all(
            data.map((item) =>
                prisma.costOptimization.create({
                    data: item,
                })
            )
        );
    }

    async updateCostOptimization(id: string, data: any) {
        return prisma.costOptimization.update({
            where: { id },
            data,
        });
    }

    async findCostOptimizationById(id: string) {
        return prisma.costOptimization.findUnique({
            where: { id },
        });
    }
}

export const budgetRepository = new BudgetRepository();
