import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeVoice(audioFile: File) {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-1",
        });
        return transcription.text;
    } catch (error) {
        console.error("Whisper Error:", error);
        return "Transcription failed. Please use text input.";
    }
}

export async function detectAndTranslate(text: string) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a language expert. Detect the language of the provided text and translate it to English. Return JSON: { \"originalLanguage\": \"...\", \"translatedText\": \"...\" }",
                },
                { role: "user", content: text },
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(response.choices[0].message.content || "{}");
        return {
            originalLanguage: result.originalLanguage || "Unknown",
            translatedText: result.translatedText || text,
        };
    } catch (error) {
        console.error("Translation Error:", error);
        return { originalLanguage: "Unknown", translatedText: text };
    }
}

export async function analyzeComplaint(text: string, imageUrl?: string) {
    try {
        const messages: any[] = [
            {
                role: "system",
                content: `Analyze the following civic complaint. 
        1. Classify it into one of: Pothole, Garbage, Water leakage, Streetlight issue, Road damage, Drain blockage.
        2. Assign a severity score from 1-5 (1: Minor, 5: Emergency).
        3. Analyze sentiment (0-1, where 1 is highly urgent/angry).
        Return JSON: { "category": "...", "severity": number, "sentiment": number, "confidence": number }`,
            },
            { role: "user", content: text },
        ];

        if (imageUrl) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: "Analyze the attached image as well." },
                    { type: "image_url", image_url: { url: imageUrl } },
                ],
            });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages,
            response_format: { type: "json_object" },
        });

        return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
        console.error("Analysis Error:", error);
        return {
            category: "Uncategorized",
            severity: 3,
            sentiment: 0.5,
            confidence: 0.5,
        };
    }
}
