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

        const anthropicKey = process.env.ANTHROPIC_API_KEY;

        if (anthropicKey) {
            console.log("Using Anthropic Claude for Suggestions...");
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "x-api-key": anthropicKey,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    model: "claude-3-5-haiku-20241022",
                    max_tokens: 1024,
                    messages: [
                        {
                            role: "user",
                            content: `Analyze the user's civic complaint description and suggest a title, category, department, and priority.
              Description: ${description}
              
              Return ONLY a JSON object:
              {
                "title": "Concise Title",
                "category": "Detected Category",
                "department": "Detected Department",
                "priority": "Detected Priority (Low, Medium, High, Emergency)"
              }`
                        }
                    ]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const content = data.content[0].text;
                const suggestion = JSON.parse(content);
                return NextResponse.json({ suggestion });
            }
            console.warn("Anthropic API failed, falling back to OpenAI...");
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an AI assistant for a civic complaint platform called JanSankalp AI. 
          Analyze the user's complaint description and suggest:
          1. A concise, professional title.
          2. The most appropriate category from this list: Pothole, Garbage, Water Leakage, Streetlight, Road Damage, Drain Blockage, Corruption.
          3. The responsible government department.
          4. A severity level (Low, Medium, High, Emergency).

          Return the result in JSON format:
          {
            "title": "Concise Title",
            "category": "Detected Category",
            "department": "Detected Department",
            "priority": "Detected Priority"
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
