import { auth } from "@/auth";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { description } = body;

        if (!description || description.length < 5) {
            return NextResponse.json({ suggestion: null });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OPENAI_API_KEY is missing in .env" }, { status: 500 });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

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

        const suggestion = JSON.parse(response.choices[0].message.content || "{}");
        return NextResponse.json({ suggestion });

    } catch (error: any) {
        console.error("SUGGESTIONS_API_ERROR_DETAIL:", error);
        return NextResponse.json({
            error: "Internal Error",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
