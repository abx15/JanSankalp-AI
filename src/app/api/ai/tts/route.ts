import { auth } from "@/auth";
import { generateSpeech } from "@/lib/ai-service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { text } = await req.json();

        if (!text) {
            return new NextResponse("Text required", { status: 400 });
        }

        const audioBuffer = await generateSpeech(text);

        if (!audioBuffer) {
            return new NextResponse("Failed to generate speech", { status: 500 });
        }

        return new NextResponse(audioBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
            },
        });

    } catch (error) {
        console.error("TTS_API_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
