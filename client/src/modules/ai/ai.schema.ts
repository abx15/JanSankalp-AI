import { z } from "zod";

export const suggestionSchema = z.object({
    description: z.string().min(10, "Description must be at least 10 characters"),
});

export type SuggestionRequest = z.infer<typeof suggestionSchema>;

export interface AISuggestionResponse {
    title: string;
    category: string;
    department: string;
    priority: "High" | "Medium" | "Low";
    confidence: number;
    reasoning: string;
}

export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export const chatSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string()
    })),
});

export type ChatRequest = z.infer<typeof chatSchema>;

export interface ChatResponse {
    choices: {
        message: ChatMessage;
    }[];
}
