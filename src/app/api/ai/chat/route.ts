import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { messages } = await req.json();
        const grokApiKey = process.env.GROK_API_KEY;

        if (!grokApiKey) {
            console.error("GROK_API_KEY_MISSING");
            // Fallback to OpenAI if Grok key is missing, or return error
            return NextResponse.json(
                { error: "Grok AI is not configured. Please add GROK_API_KEY to .env" },
                { status: 500 }
            );
        }

        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${grokApiKey}`,
            },
            body: JSON.stringify({
                model: "grok-beta", // Or the appropriate grok model
                messages: [
                    {
                        role: "system",
                        content: "You are JanSankalp AI Assistant. You help citizens with civic complaints, governance procedures, and system information in India. Be professional, empathetic, and multi-lingual (Hindi/English). Use reasoning to solve complex citizen problems.",
                    },
                    ...messages,
                ],
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("GROK_API_ERROR", errorData);
            return NextResponse.json({ error: "Grok API error" }, { status: 500 });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("CHAT_API_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
