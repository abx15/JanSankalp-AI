import { budgetController } from "@/modules/budget/budget.controller";

export async function POST(req: Request) {
  return budgetController.runScenario(req);
}
