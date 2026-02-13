import { NextResponse } from "next/server";
import { transcribeVoice } from "@/lib/ai-service";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("Missing file", { status: 400 });
        }

        const text = await transcribeVoice(file);

        return NextResponse.json({ text });
    } catch (error) {
        console.error("TRANSCRIPTION_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
