import { budgetController } from "@/modules/budget/budget.controller";

export async function GET(req: Request) {
  return budgetController.getDemandSurges(req);
}

export async function POST(req: Request) {
  return budgetController.createCustomDemandSurge(req);
}
