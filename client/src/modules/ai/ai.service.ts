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
                confidence: aiData.confidence || 0.8,
                reasoning: aiData.reasoning || "AI-powered classification",
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
                    confidence: classified.confidence || 0.8,
                    reasoning: classified.reasoning || "AI-powered classification",
                };
            } catch (fallbackError) {
                console.error("AI Fallback also failed", fallbackError);
                
                // Final fallback - rule-based classification
                const desc = data.description.toLowerCase();
                let category = "General";
                let priority: "High" | "Medium" | "Low" = "Medium";
                
                if (desc.includes('road') || desc.includes('pothole')) {
                    category = "Road & Potholes";
                    priority = desc.includes('dangerous') || desc.includes('accident') ? "High" : "Medium";
                } else if (desc.includes('garbage') || desc.includes('sanitation')) {
                    category = "Garbage & Sanitation";
                    priority = desc.includes('health') || desc.includes('disease') ? "High" : "Medium";
                } else if (desc.includes('water') || desc.includes('supply')) {
                    category = "Water Supply";
                    priority = desc.includes('no water') || desc.includes('emergency') ? "High" : "Medium";
                } else if (desc.includes('electricity') || desc.includes('power')) {
                    category = "Electricity";
                    priority = desc.includes('outage') || desc.includes('critical') ? "High" : "Medium";
                }
                
                return {
                    title: `${category} Report`,
                    category,
                    department: `${category} Department`,
                    priority,
                    confidence: 0.6,
                    reasoning: "Rule-based classification",
                };
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
