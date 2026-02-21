import { auth } from "@/auth";
import { NextResponse } from "next/server";

const CATEGORIES = [
    "Road & Potholes", "Garbage & Sanitation", "Streetlight", "Water Supply",
    "Sewage & Drainage", "Electricity", "Traffic & Signals", "Noise Pollution",
    "Park & Recreation", "Corruption & Misconduct", "Building & Construction",
    "Public Safety", "Transport & Bus", "Healthcare", "Education",
];

async function classifyWithGrok(description: string) {
    const prompt = `You are an AI classifier for Indian civic complaints. Classify the following complaint into:
1. category (exactly one of: ${CATEGORIES.join(", ")})
2. severity (1-5, where 5 is most severe/urgent)
3. confidence (0.0-1.0)
4. reasoning (one sentence explanation)

Complaint: "${description}"

Respond ONLY with valid JSON:
{"category": "...", "severity": 3, "confidence": 0.90, "reasoning": "..."}`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        },
        body: JSON.stringify({
            model: "grok-2-latest",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
            temperature: 0.1,
        }),
    });

    if (!response.ok) throw new Error(`Grok error: ${response.status}`);

    const data = await response.json();
    const raw = data.choices[0].message.content.trim();
    // Strip markdown code fences if present
    const jsonStr = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(jsonStr);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const description = body?.description;

    if (!description || description.trim().length < 10) {
        return NextResponse.json({ suggestion: null });
    }

    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "https://jansankalp-ai.onrender.com";

    // Try external AI engine first (short timeout)
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(`${AI_SERVICE_URL}/classify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: description }),
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json({
                suggestion: {
                    title: `${data.category || "Issue"} Report`,
                    category: data.category || "General",
                    department: `${data.category || "General"} Department`,
                    priority: data.severity || "Medium",
                    confidence: data.confidence,
                    reasoning: data.reasoning,
                },
            });
        }
    } catch {
        // fall through to Grok
    }

    // Grok fallback
    try {
        const classified = await classifyWithGrok(description);
        return NextResponse.json({
            suggestion: {
                title: `${classified.category} Report`,
                category: classified.category,
                department: `${classified.category} Department`,
                priority: classified.severity >= 4 ? "High" : classified.severity >= 2 ? "Medium" : "Low",
                confidence: classified.confidence,
                reasoning: classified.reasoning,
            },
        });
    } catch {
        return NextResponse.json({ suggestion: null });
    }
}
