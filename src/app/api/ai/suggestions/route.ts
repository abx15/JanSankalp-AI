import { auth } from "@/auth";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI lazily to avoid crashes if API key is missing during module load
const getOpenAI = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not defined in environment variables");
    }
    return new OpenAI({ apiKey });
};

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

        console.log("DEBUG: Processing suggestions for description length:", description.length);

        try {
            let openai: OpenAI;
            try {
                openai = getOpenAI();
            } catch (e: any) {
                console.error("DEBUG: Suggestions API Init Failed:", e.message);
                return new NextResponse(`AI Init Error: ${e.message}`, { status: 500 });
            }

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are an AI assistant for JanSankalp AI. Analyze the user's civic complaint.
          Suggest:
          1. A concise, professional title.
          2. Category from: Pothole, Garbage, Water Leakage, Streetlight, Road Damage, Drain Blockage, Corruption.
          3. Responsible department (e.g., PWD, Municipal, Electricity Dept, Vigilance).
          4. Priority (Low, Medium, High, Emergency).

          Return ONLY valid JSON:
          {
            "title": "Title",
            "category": "Category",
            "department": "Department",
            "priority": "Priority"
          }`
                    },
                    { role: "user", content: description }
                ],
                response_format: { type: "json_object" }
            });

            const content = response.choices[0].message.content;
            if (!content) {
                console.error("DEBUG: OpenAI returned empty content");
                return new NextResponse("AI returned empty content", { status: 500 });
            }

            const suggestion = JSON.parse(content);
            return NextResponse.json({ suggestion });
        } catch (openaiError: any) {
            console.error("DEBUG: OpenAI Call Failed:", {
                status: openaiError.status,
                message: openaiError.message,
                stack: openaiError.stack
            });
            return new NextResponse(`AI Error: ${openaiError.message || "Unknown"}`, { status: 500 });
        }
    } catch (error: any) {
        console.error("DEBUG: Suggestions API Top-Level Error:", error);
        return new NextResponse(`Internal Error: ${error.message || "Unknown"}`, { status: 500 });
    }
}
