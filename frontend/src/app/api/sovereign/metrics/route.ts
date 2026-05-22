import { sovereignController } from "@/modules/sovereign/sovereign.controller";

export async function GET(req: Request) {
    return sovereignController.getMetrics(req);
}
