import OpenAI from "openai";

// Initialize OpenAI lazily
const getOpenAI = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is missing");
    return new OpenAI({ apiKey });
};

/**
 * AssemblyAI Speech-to-Text Integration
 */
export async function transcribeVoice(audioFile: File) {
    try {
        const apiKey = process.env.ASSEMBLY_AI_API_KEY;
        if (!apiKey) {
            console.warn("AssemblyAI API Key missing, falling back to Whisper...");
            const openai = getOpenAI();
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
            body: JSON.stringify({
                audio_url: uploadUrl,
                language_code: "hi",
                boost_param: "high"
            }),
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
 * Text-to-Speech (Voice Generation)
 */
export async function generateSpeech(text: string) {
    try {
        const openai = getOpenAI();
        // Since AssemblyAI is primarily STT, we use OpenAI for high-quality TTS
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        return buffer;
    } catch (error) {
        console.error("TTS Error:", error);
        return null;
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
            const openai = getOpenAI();
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
                message: `Detect language and translate to English: ${text}. Return JSON: { "originalLanguage": "...", "translatedText": "..." }`,
            }),
        });

        const data = await response.json();
        const result = JSON.parse(data.text);
        return {
            originalLanguage: result.originalLanguage || "Detected",
            translatedText: result.translatedText || text,
        };

    } catch (error) {
        console.error("Translation Error:", error);
        return { originalLanguage: "Unknown", translatedText: text };
    }
}

/**
 * Hugging Face Vision & LLM Analysis Hub
 */
export async function analyzeComplaint(text: string, imageUrl?: string) {
    try {
        const hfKey = process.env.HUGGINGFACE_API_KEY;
        let visionSummary = "";

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
                visionSummary = result[0]?.generated_text || "";
            } catch (vError) {
                console.error("HuggingFace Vision failed:", vError);
            }
        }

        // Combined analysis using OpenAI with HF Vision data if available
        const openai = getOpenAI();
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Analyze this civic complaint. Use the vision analysis if provided.
                    Return JSON: { "category": "...", "severity": number (1-5), "sentiment": number (0-1), "confidence": number }`,
                },
                { role: "user", content: `Text: ${text}${visionSummary ? `\nVision: ${visionSummary}` : ""}` },
            ],
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

/**
 * Federated Learning Operations
 */
export async function getFederatedMetrics() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AI_ENGINE_URL || 'http://localhost:10000'}/analytics/federated`);
        if (!response.ok) throw new Error("Failed to fetch federated metrics");
        return await response.json();
    } catch (error) {
        console.error("Federated Metrics Error:", error);
        return null;
    }
}

export async function triggerTrainRound() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AI_ENGINE_URL || 'http://localhost:10000'}/federated/train-round`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error("Failed to trigger training round");
        return await response.json();
    } catch (error) {
        console.error("Train Round Error:", error);
        return null;
    }
}

/**
 * Infrastructure & IoT Monitoring
 */
export async function getInfrastructureAnalytics() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AI_ENGINE_URL || 'http://localhost:10000'}/analytics/infrastructure`);
        if (!response.ok) throw new Error("Failed to fetch infra analytics");
        return await response.json();
    } catch (error) {
        console.error("Infra Analytics Error:", error);
        return null;
    }
}
