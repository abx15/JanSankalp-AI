import { aiClient } from "./ai.client";
import { SuggestionRequest, AISuggestionResponse } from "./ai.schema";

export class AIService {
    async getSuggestions(data: SuggestionRequest): Promise<AISuggestionResponse | null> {
        try {
            // Try internal FastAPI service first
            const aiData = await aiClient.classify(data.description);

            return {
                title: `${aiData.category || "Issue"} Report`,
                category: aiData.category || "General",
                department: `${aiData.category || "General"} Department`,
                priority: this.mapSeverityToPriority(aiData.severity),
                confidence: aiData.confidence,
                reasoning: aiData.reasoning,
            };
        } catch (error) {
            console.warn("FastAPI failed, falling back to Grok", error);

            try {
                const classified = await aiClient.GrokFallback(data.description);
                return {
                    title: `${classified.category} Report`,
                    category: classified.category,
                    department: `${classified.category} Department`,
                    priority: this.mapSeverityToPriority(classified.severity),
                    confidence: classified.confidence,
                    reasoning: classified.reasoning,
                };
            } catch (fallbackError) {
                console.error("AI Fallback also failed", fallbackError);
                return null;
            }
        }
    }

    async chat(data: any) {
        const messages = data.messages;
        const lastMessage = messages[messages.length - 1]?.content || "";
        const history = messages.slice(0, -1);

        try {
            const response = await aiClient.chat(lastMessage, history);
            return {
                choices: [{ message: { role: "assistant", content: response } }],
            };
        } catch (error) {
            console.warn("AI engine unavailable — falling through to Grok");
            try {
                const content = await aiClient.chatGrokFallback(history, lastMessage);
                return {
                    choices: [{ message: { role: "assistant", content } }],
                };
            } catch (fallbackError) {
                throw new Error("AI service unavailable. Please try again later.");
            }
        }
    }

    async transcribe(file: File) {
        try {
            return await aiClient.transcribe(file);
        } catch (error) {
            console.error("Transcription Service Error:", error);
            return "Transcription failed. Please use text input.";
        }
    }

    async generateSpeech(text: string) {
        try {
            return await aiClient.generateSpeech(text);
        } catch (error) {
            console.error("TTS Service Error:", error);
            return null;
        }
    }

    private mapSeverityToPriority(severity: number): "High" | "Medium" | "Low" {
        if (severity >= 4) return "High";
        if (severity >= 2) return "Medium";
        return "Low";
    }
}

export const aiService = new AIService();
