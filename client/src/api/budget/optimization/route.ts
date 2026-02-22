import { budgetController } from "@/modules/budget/budget.controller";

export async function GET(req: Request) {
  return budgetController.getOptimizations(req);
}

export async function POST(req: Request) {
  return budgetController.processOptimizationAction(req);
}
