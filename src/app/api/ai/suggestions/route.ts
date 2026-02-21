import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let description;
        try {
            const body = await req.json();
            description = body.description;
        } catch (e) {
            console.error("DEBUG: Failed to parse request JSON:", e);
            return new NextResponse("Invalid JSON body", { status: 400 });
        }

        if (!description) {
            return NextResponse.json({ suggestion: null });
        }

        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "https://jansankalp-ai.onrender.com";

        try {
            const response = await fetch(`${AI_SERVICE_URL}/classify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: description }),
            });

            if (!response.ok) {
                console.error("AI Engine responded with error:", response.status, response.statusText);
                throw new Error(`AI Engine error: ${response.statusText}`);
            }

            const data = await response.json();

            // Map the FastAPI response to the expected frontend format
            const suggestion = {
                title: `${data.category || "Issue"} Report`,
                category: data.category || "General",
                department: `${data.category || "General"} Department`,
                priority: data.severity || "Medium",
                confidence: data.confidence,
                reasoning: data.reasoning
            };

            return NextResponse.json({ suggestion });
        } catch (aiError: any) {
            console.error("DEBUG: AI Engine Call Failed:", aiError.message);
            // Fallback to local OpenAI if AI Engine is down (to ensure no downtime)
            if (process.env.OPENAI_API_KEY) {
                console.log("DEBUG: Falling back to local OpenAI...");
                // We'll keep the direct logic here as a fallback
                return new NextResponse(`AI Error: ${aiError.message}. AI Engine at ${AI_SERVICE_URL} might be sleeping.`, { status: 500 });
            }
            return new NextResponse(`AI Error: ${aiError.message}`, { status: 500 });
        }
    } catch (error: any) {
        console.error("DEBUG: Suggestions API Top-Level Error:", error);
        return new NextResponse(`Internal Error: ${error.message || "Unknown"}`, { status: 500 });
    }
}
