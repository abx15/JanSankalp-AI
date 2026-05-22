import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { aiController } from "@/modules/ai/ai.controller";

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    return aiController.tts(req);
}
