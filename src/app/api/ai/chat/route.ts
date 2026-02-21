import { auth } from "@/auth";
import { NextResponse } from "next/server";

const GROK_SYSTEM_PROMPT = `You are JanSankalp AI — an intelligent governance assistant for Indian citizens. 
You help people understand how to file civic complaints, track grievances, explain government schemes, and guide citizens through the JanSankalp platform. 
You speak in a helpful, clear, professional tone. You can respond in both English and Hindi. 
Keep responses concise (under 200 words) and action-oriented. Always encourage using official channels for reporting issues.`;

async function callGrokFallback(messages: { role: string; content: string }[], userMessage: string) {
    const grokMessages = [
        { role: "system", content: GROK_SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage },
    ];

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        },
        body: JSON.stringify({
            model: "grok-2-latest",
            messages: grokMessages,
            max_tokens: 512,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";
    const history = messages.slice(0, -1);

    // Try external AI engine first (short timeout to avoid hanging)
    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "https://jansankalp-ai.onrender.com";
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${AI_SERVICE_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: lastMessage,
                history: history.map((m: any) => ({ role: m.role, content: m.content })),
            }),
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json({
                choices: [{ message: { role: "assistant", content: data.response } }],
            });
        }
    } catch {
        // AI engine unavailable — fall through to Grok
    }

    // Grok fallback
    try {
        const content = await callGrokFallback(history, lastMessage);
        return NextResponse.json({
            choices: [{ message: { role: "assistant", content } }],
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: "AI service unavailable. Please try again later." },
            { status: 503 }
        );
    }
}
