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

        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

        try {
            const response = await fetch(`${AI_SERVICE_URL}/classify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: description }),
            });

            if (!response.ok) {
                throw new Error(`AI Engine error: ${response.statusText}`);
            }

            const data = await response.json();

            // Map the FastAPI response to the expected frontend format
            const suggestion = {
                title: `${data.category} Issue`, // AI Engine doesn't return title, we can synthesize or add chat call
                category: data.category,
                department: `${data.category} Dept`, // Simple mapping for now
                priority: data.severity, // Low, Medium, High, Critical
                confidence: data.confidence,
                reasoning: data.reasoning
            };

            return NextResponse.json({ suggestion });
        } catch (aiError: any) {
            console.error("DEBUG: AI Engine Call Failed:", aiError.message);
            return new NextResponse(`AI Error: ${aiError.message || "Unknown"}`, { status: 500 });
        }
    } catch (error: any) {
        console.error("DEBUG: Suggestions API Top-Level Error:", error);
        return new NextResponse(`Internal Error: ${error.message || "Unknown"}`, { status: 500 });
    }
}
