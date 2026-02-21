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

        if (grokApiKey) {
            try {
                const response = await fetch("https://api.x.ai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${grokApiKey}`,
                    },
                    body: JSON.stringify({
                        model: "grok-beta",
                        messages: [
                            {
                                role: "system",
                                content: "You are JanSankalp AI Assistant. Help citizens with civic complaints and governance in India. Professional, empathetic, and multi-lingual (Hindi/English).",
                            },
                            ...messages,
                        ],
                        stream: false,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    return NextResponse.json(data);
                }
                console.warn("Grok API failed, falling back to OpenAI...");
            } catch (grokError) {
                console.error("Grok Fetch Error:", grokError);
            }
        }

        // Fallback to OpenAI GPT-4o-mini
        const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are JanSankalp AI Assistant. Help citizens with civic complaints and governance in India.",
                    },
                    ...messages,
                ],
            }),
        });

        const data = await openAIResponse.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("CHAT_API_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
