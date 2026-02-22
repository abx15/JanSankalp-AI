import { budgetController } from "@/modules/budget/budget.controller";

export async function GET(req: Request) {
  return budgetController.getForecast(req);
}

export async function POST(req: Request) {
  return budgetController.createCustomForecast(req);
}
