import { env } from "@/core/env";
import { config } from "@/core/config";
import OpenAI from "openai";

export class AIClient {
    private baseUrl: string;
    private _openai?: OpenAI;

    constructor() {
        // For Docker: Use internal service name, fallback to localhost for dev
        this.baseUrl = process.env.NEXT_PUBLIC_AI_ENGINE_URL || 
                      process.env.AI_SERVICE_URL || 
                      (process.env.NODE_ENV === 'production' ? 'http://ai-engine:10000' : 'http://localhost:10000');
    }

    private getOpenAI() {
        if (!this._openai) {
            if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");
            this._openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
        }
        return this._openai;
    }

    async classify(text: string) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), config.ai.defaultTimeout);

        try {
            const response = await fetch(`${this.baseUrl}/classify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`AI Service error: ${response.status}`);
            }

            return await response.json();
        } finally {
            clearTimeout(timeout);
        }
    }

    async generateSuggestions(description: string) {
        // This could call a different FastAPI endpoint if needed
        // For now, mapping to the classify logic
        return this.classify(description);
    }

    async chat(message: string, history: { role: string; content: string }[]) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), config.ai.defaultTimeout);

        try {
            const response = await fetch(`${this.baseUrl}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, history }),
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`AI Service error: ${response.status}`);
            }

            const data = await response.json();
            return data.response;
        } finally {
            clearTimeout(timeout);
        }
    }

    async chatGrokFallback(messages: { role: string; content: string }[], userMessage: string) {
        const GROK_SYSTEM_PROMPT = `You are JanSankalp AI — an intelligent governance assistant for Indian citizens. 
You help people understand how to file civic complaints, track grievances, explain government schemes, and guide citizens through the JanSankalp platform. 
You speak in a helpful, clear, professional tone. You can respond in both English and Hindi. 
Keep responses concise (under 200 words) and action-oriented. Always encourage using official channels for reporting issues.`;

        const grokMessages = [
            { role: "system", content: GROK_SYSTEM_PROMPT },
            ...messages,
            { role: "user", content: userMessage },
        ];

        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${env.GROK_API_KEY}`,
            },
            body: JSON.stringify({
                model: "grok-2-latest",
                messages: grokMessages,
                max_tokens: 512,
                temperature: 0.7,
            }),
        });

        if (!response.ok) throw new Error(`Grok API error: ${response.status}`);

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async transcribe(audioFile: File) {
        try {
            const apiKey = env.ASSEMBLY_AI_API_KEY;
            if (!apiKey) {
                const openai = this.getOpenAI();
                const transcription = await openai.audio.transcriptions.create({
                    file: audioFile,
                    model: "whisper-1",
                });
                return transcription.text;
            }

            // Upload to AssemblyAI
            const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
                method: "POST",
                headers: { "authorization": apiKey },
                body: audioFile,
            });
            const uploadData = await uploadResponse.json();
            const uploadUrl = uploadData.upload_url;

            // Start Transcription
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

            // Polling
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
            console.error("Transcription Client Error:", error);
            throw error;
        }
    }

    async generateSpeech(text: string) {
        const openai = this.getOpenAI();
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text,
        });
        return Buffer.from(await mp3.arrayBuffer());
    }

    async GrokFallback(description: string) {
        const CATEGORIES = [
            "Road & Potholes", "Garbage & Sanitation", "Streetlight", "Water Supply",
            "Sewage & Drainage", "Electricity", "Traffic & Signals", "Noise Pollution",
            "Park & Recreation", "Corruption & Misconduct", "Building & Construction",
            "Public Safety", "Transport & Bus", "Healthcare", "Education",
        ];

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
                Authorization: `Bearer ${env.GROK_API_KEY}`,
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
        const jsonStr = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
        return JSON.parse(jsonStr);
    }
}

export const aiClient = new AIClient();
