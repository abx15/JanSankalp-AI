import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AssemblyAI Speech-to-Text Integration
 */
export async function transcribeVoice(audioFile: File) {
    try {
        const apiKey = process.env.ASSEMBLY_AI_API_KEY;
        if (!apiKey) {
            console.warn("AssemblyAI API Key missing, falling back to Whisper...");
            const transcription = await openai.audio.transcriptions.create({
                file: audioFile,
                model: "whisper-1",
            });
            return transcription.text;
        }

        // 1. Upload to AssemblyAI
        const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
            method: "POST",
            headers: { "authorization": apiKey },
            body: audioFile,
        });
        const uploadData = await uploadResponse.json();
        const uploadUrl = uploadData.upload_url;

        // 2. Start Transcription
        const transcriptResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
            method: "POST",
            headers: {
                "authorization": apiKey,
                "content-type": "application/json",
            },
            body: JSON.stringify({ audio_url: uploadUrl, language_code: "hi" }), // Default to Hindi/Multi for JanSankalp
        });
        const transcriptData = await transcriptResponse.json();
        const transcriptId = transcriptData.id;

        // 3. Polling for Result
        let result;
        while (true) {
            const pollingResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                headers: { "authorization": apiKey },
            });
            result = await pollingResponse.json();
            if (result.status === "completed" || result.status === "error") break;
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (result.status === "error") throw new Error(result.error);
        return result.text;

    } catch (error) {
        console.error("AssemblyAI/Whisper Error:", error);
        return "Transcription failed. Please use text input.";
    }
}

/**
 * Cohere Multi-lingual Detection & Translation
 */
export async function detectAndTranslate(text: string) {
    try {
        const cohereKey = process.env.COHERE_API_KEY;
        if (!cohereKey) {
            // Fallback to OpenAI
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
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
        }

        // Cohere implementation for superior multi-lingual
        const response = await fetch("https://api.cohere.ai/v1/chat", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${cohereKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `Detect the language and translate this text to English. Text: ${text}. Return JSON: { "originalLanguage": "...", "translatedText": "..." }`,
                preamble: "You are a multi-lingual expert. Response must be valid JSON.",
            }),
        });

        const data = await response.json();
        const result = JSON.parse(data.text);
        return {
            originalLanguage: result.originalLanguage || "Detected via Cohere",
            translatedText: result.translatedText || text,
        };

    } catch (error) {
        console.error("Translation Error:", error);
        return { originalLanguage: "Unknown", translatedText: text };
    }
}

/**
 * Hugging Face Vision & NLP Analysis
 */
export async function analyzeComplaint(text: string, imageUrl?: string) {
    try {
        const hfKey = process.env.HUGGINGFACE_API_KEY;
        let visionData = "";

        // If Image + HF Key exists, use HF Vision Model
        if (imageUrl && hfKey) {
            console.log("Using Hugging Face for Vision Analysis...");
            try {
                const response = await fetch(
                    "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
                    {
                        headers: { Authorization: `Bearer ${hfKey}` },
                        method: "POST",
                        body: JSON.stringify({ inputs: imageUrl }),
                    }
                );
                const result = await response.json();
                visionData = result[0]?.generated_text || "";
            } catch (vError) {
                console.error("HF Vision Error:", vError);
            }
        }

        // Combined analysis using OpenAI with HF Vision data if available
        const messages: any[] = [
            {
                role: "system",
                content: `Analyze the following civic complaint. 
        1. Classify it into one of: Pothole, Garbage, Water leakage, Streetlight issue, Road damage, Drain blockage.
        2. Assign a severity score from 1-5 (1: Minor, 5: Emergency).
        3. Analyze sentiment (0-1, where 1 is highly urgent/angry).
        Return JSON: { "category": "...", "severity": number, "sentiment": number, "confidence": number }`,
            },
            { role: "user", content: `Text: ${text}${visionData ? `\nVision Analysis Result: ${visionData}` : ""}` },
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
            model: "gpt-4o",
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
