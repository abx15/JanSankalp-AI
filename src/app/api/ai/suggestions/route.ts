import { auth } from "@/auth";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { description } = await req.json();

        if (!description || description.length < 5) {
            return NextResponse.json({ suggestion: null });
        }

        // Using GPT-4o-mini for ultra-fast and cost-effective suggestions
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
    } catch (error) {
        console.error("SUGGESTIONS_API_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
