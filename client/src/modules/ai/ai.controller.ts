import { NextResponse } from "next/server";
import { aiService } from "./ai.service";
import { suggestionSchema, chatSchema } from "./ai.schema";
import { AppError, handleError } from "@/core/error-handler";

export class AIController {
    async getSuggestions(req: Request) {
        try {
            const body = await req.json().catch(() => null);

            const validation = suggestionSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({ suggestion: null });
            }

            const suggestion = await aiService.getSuggestions(validation.data);

            return NextResponse.json({ suggestion });
        } catch (error) {
            return handleError(error);
        }
    }

    async chat(req: Request) {
        try {
            const body = await req.json();
            const validation = chatSchema.safeParse(body);

            if (!validation.success) {
                throw new AppError("Invalid chat request", 400);
            }

            const response = await aiService.chat(validation.data);
            return NextResponse.json(response);
        } catch (error) {
            return handleError(error);
        }
    }

    async transcribe(req: Request) {
        try {
            const formData = await req.formData();
            const file = formData.get("file") as File;

            if (!file) {
                throw new AppError("Missing audio file", 400);
            }

            const text = await aiService.transcribe(file);
            return NextResponse.json({ text });
        } catch (error) {
            return handleError(error);
        }
    }

    async tts(req: Request) {
        try {
            let text: string | null = null;

            if (req.method === "POST") {
                const body = await req.json().catch(() => null);
                text = body?.text;
            } else {
                const { searchParams } = new URL(req.url);
                text = searchParams.get("text");
            }

            if (!text) {
                throw new AppError("Missing text parameter", 400);
            }

            const buffer = await aiService.generateSpeech(text);
            if (!buffer) {
                throw new AppError("Failed to generate speech", 500);
            }

            return new NextResponse(buffer, {
                headers: { "Content-Type": "audio/mpeg" },
            });
        } catch (error) {
            return handleError(error);
        }
    }
}

export const aiController = new AIController();
