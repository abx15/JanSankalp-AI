import { NextResponse } from "next/server";
import { sovereignService } from "./sovereign.service";
import { handleError } from "@/core/error-handler";

export class SovereignController {
    async getMetrics(req: Request) {
        try {
            const metrics = await sovereignService.getMetrics();
            return NextResponse.json(metrics);
        } catch (error) {
            return handleError(error);
        }
    }
}

export const sovereignController = new SovereignController();
