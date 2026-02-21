import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1]?.content || "";
        const history = messages.slice(0, -1);

        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "https://jansankalp-ai.onrender.com";

        try {
            const response = await fetch(`${AI_SERVICE_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: lastMessage,
                    history: history.map((m: any) => ({
                        role: m.role,
                        content: m.content
                    }))
                }),
            });

            if (!response.ok) {
                throw new Error(`AI Engine error: ${response.statusText}`);
            }

            const data = await response.json();

            // Format to match expected chat response
            return NextResponse.json({
                choices: [{
                    message: {
                        role: "assistant",
                        content: data.response
                    }
                }]
            });
        } catch (aiError: any) {
            console.error("AI Engine Chat Error:", aiError.message);
            return new NextResponse(`AI Error: ${aiError.message}`, { status: 500 });
        }
    } catch (error: any) {
        console.error("CHAT_API_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
